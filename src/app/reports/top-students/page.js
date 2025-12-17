"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { fetchStudents, fetchGrades, fetchCourses } from "@/lib/apiClient";
import { exportReportToCSV } from "@/lib/csvExporter";

const fetchTopStudentsByCourse = async () => {
  const [students, grades, courses] = await Promise.all([
    fetchStudents(),
    fetchGrades(),
    fetchCourses(),
  ]);

  const courseTitleMap = new Map();
  courses.forEach((course) => {
    courseTitleMap.set(course.id, course.title);
  });

  const gradesByCourse = new Map();
  grades.forEach((grade) => {
    if (!gradesByCourse.has(grade.courseId)) {
      gradesByCourse.set(grade.courseId, []);
    }
    gradesByCourse.get(grade.courseId).push(grade);
  });

  const report = [];
  for (const [courseId, courseGrades] of gradesByCourse) {
    const sortedGrades = courseGrades.sort((a, b) => b.score - a.score);

    const topStudents = sortedGrades.slice(0, 3).map((grade) => {
      const student = students.find((s) => s.id === grade.studentId);
      return {
        studentName: student?.name || "Unknown",
        score: grade.score,
        grade: grade.grade,
        progress: grade.progress,
      };
    });

    report.push({
      courseId,
      courseTitle: courseTitleMap.get(courseId) || `Course ${courseId}`,
      topStudents,
    });
  }

  return report;
};

export default function TopStudentsReportPage() {
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["top-students-report"],
    queryFn: fetchTopStudentsByCourse,
  });

  if (isLoading) {
    return <div className="p-6">Loading report...</div>;
  }

  const handleExportCSV = () => {
    if (reports.length === 0) {
      alert("No data to export");
      return;
    }
    exportReportToCSV(reports, "top-students-report.csv");
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">
          Top-Performing Students by Course
        </h1>

        <button
          onClick={handleExportCSV}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          disabled={reports.length === 0}
        >
          Export to CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          href="/"
          className="text-sm px-3 py-1.5 bg-lSkyLight text-gray-700 rounded-md hover:bg-lSky transition-colors duration-150 font-medium"
        >
          Dashboard Panel
        </Link>
        <Link
          href="/reports/enrollments-over-time"
          className="text-sm px-3 py-1.5 bg-lSkyLight text-gray-700 rounded-md hover:bg-lSky transition-colors duration-150 font-medium"
        >
          Enrollments Over Time →
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {reports.map((report) => (
          <div
            key={report.courseId}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <h2 className="font-semibold mb-4">{report.courseTitle}</h2>
            <div className="space-y-3">
              {report.topStudents.length > 0 ? (
                report.topStudents.map((student, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-100 pb-2 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{student.studentName}</p>
                        <p className="text-sm text-gray-600">
                          Score: {student.score} | Grade: {student.grade}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">Progress: {student.progress}%</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No students enrolled yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
