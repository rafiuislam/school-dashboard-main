// src/app/students/[id]/page.js
"use client";

import { useParams } from "next/navigation";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import Link from "next/link";

export default function StudentProfilePage() {
  const params = useParams();
  const { id } = params;
  const { data: profile, isLoading, error } = useStudentProfile(id);

  if (isLoading) {
    return <div className="p-6">Loading student profile...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Failed to load student: {error.message}
      </div>
    );
  }

  if (!profile) {
    return <div className="p-6">Student not found.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
        <p className="text-gray-600">
          {profile.email} • Year {profile.year} • GPA: {profile.gpa}
        </p>
      </header>

      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          href="/"
          className="text-sm px-3 py-1.5 bg-lSkyLight text-gray-700 rounded-md hover:bg-lSky transition-colors duration-150 font-medium"
        >
          Dashboard Panel
        </Link>

        <Link
          href="/students"
          className="text-sm px-3 py-1.5 bg-lSkyLight text-gray-700 rounded-md hover:bg-lSky transition-colors duration-150 font-medium"
        >
          Student Panel →
        </Link>
      </div>

      {/* Enrolled Courses */}
      <section className="mb-10 mt-4">
        <h2 className="text-xl font-semibold mb-4">
          Enrolled Courses ({profile.enrolledCourses.length})
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {profile.enrolledCourses.map((course) => (
            <div key={course.id} className="border rounded-lg p-4">
              <h3 className="font-medium text-lg">{course.title}</h3>
              <p className="text-sm text-gray-600">
                Instructor: {course.facultyName}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Grades & Progress */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Grades & Progress Summary
        </h2>
        <div className="space-y-4">
          {profile.grades.map((grade) => (
            <div
              key={grade.courseId}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-medium">{grade.courseTitle}</h3>
                <p className="text-sm text-gray-600">
                  Grade: <span className="font-bold">{grade.grade}</span> (
                  {grade.score}%)
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono">{grade.progress}%</p>
                <div className="w-24 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${grade.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        {profile.grades.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-semibold">Overall Performance</h3>
            <p>
              Avg. Score:{" "}
              <span className="font-bold">
                {(
                  profile.grades.reduce((sum, g) => sum + g.score, 0) /
                  profile.grades.length
                ).toFixed(1)}
                %
              </span>
            </p>
            <p>
              Completed:{" "}
              <span className="font-bold">
                {profile.grades.filter((g) => g.progress === 100).length} /{" "}
                {profile.grades.length}
              </span>
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
