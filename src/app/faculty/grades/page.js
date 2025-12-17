"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import Link from "next/link";
import { fetchStudents, fetchCourses, fetchGrades } from "@/lib/apiClient";

const saveGrade = async ({ studentId, courseId, score, grade, progress }) => {
  const grades = await fetchGrades();
  const existingGrade = grades.find(
    (g) => g.studentId === studentId && g.courseId === courseId
  );

  if (existingGrade) {
    return axios.put(`/grades/${existingGrade.id}`, {
      studentId,
      courseId,
      score,
      grade,
      progress,
    });
  } else {
    return axios.post("/grades", {
      studentId,
      courseId,
      score,
      grade,
      progress,
    });
  }
};

export default function GradeAssignmentPage() {
  const queryClient = useQueryClient();
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [score, setScore] = useState("");
  const [progress, setProgress] = useState("100");

  const grade = useMemo(() => {
    if (score === "") return "";
    const numScore = Number(score);
    if (numScore >= 97) return "A+";
    if (numScore >= 93) return "A";
    if (numScore >= 90) return "A-";
    if (numScore >= 87) return "B+";
    if (numScore >= 83) return "B";
    if (numScore >= 80) return "B-";
    if (numScore >= 77) return "C+";
    if (numScore >= 73) return "C";
    if (numScore >= 70) return "C-";
    if (numScore >= 67) return "D+";
    if (numScore >= 65) return "D";
    return "F";
  }, [score]);

  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });
  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });
  const { data: grades = [] } = useQuery({
    queryKey: ["grades"],
    queryFn: fetchGrades,
  });

  const selectedStudent = students.find((s) => s.id === studentId);
  const enrolledCourseIds = selectedStudent
    ? selectedStudent.enrolledCourses.map((id) => String(id))
    : [];

  const availableCourses = studentId
    ? courses.filter((course) => enrolledCourseIds.includes(course.id))
    : [];

  console.log("grades:", grades);
  const mutation = useMutation({
    mutationFn: saveGrade,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["grades"] });
      queryClient.invalidateQueries({
        queryKey: ["studentProfile", variables.studentId],
      });
      alert("Grade saved successfully!");
    },
    onError: (err) => {
      console.error(err);
      alert("Failed to save grade");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentId || !courseId || !score) return;
    mutation.mutate({
      studentId,
      courseId,
      score: Number(score),
      grade,
      progress: Number(progress),
    });
  };

  const currentGrade = grades.find(
    (g) => g.studentId === studentId && g.courseId === courseId
  );

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Grades</h1>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          href="/"
          className="text-sm px-3 py-1.5 bg-lSkyLight text-gray-700 rounded-md hover:bg-lSky transition-colors duration-150 font-medium"
        >
          Dashboard Panel
        </Link>

        <Link
          href="/faculty/enrollments"
          className="text-sm px-3 py-1.5 bg-lSkyLight text-gray-700 rounded-md hover:bg-lSky transition-colors duration-150 font-medium"
        >
          Courses Assign Panel →
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-500"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student
            </label>
            <select
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                setCourseId("");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select a student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Year: {s.year})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
              disabled={!studentId}
            >
              <option value="">Select a course</option>
              {availableCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Score (0–100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade
            </label>
            <input
              type="text"
              value={grade}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Progress (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {currentGrade && (
          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800">
              <span className="font-medium">Current grade:</span>{" "}
              {currentGrade.grade} ({currentGrade.score}%)
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={mutation.isPending || !studentId || !courseId}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {mutation.isPending ? "Saving..." : "Save Grade"}
        </button>
      </form>
    </div>
  );
}
