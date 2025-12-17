"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import Link from "next/link";
import { fetchStudents, fetchCourses } from "@/lib/apiClient";

export default function StudentEnrollmentPage() {
  const queryClient = useQueryClient();
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");

  const enrollStudent = async ({ studentId, courseId }) => {
    const [student, course] = await Promise.all([
      fetchStudents().then((students) =>
        students.find((s) => s.id === studentId)
      ),
      fetchCourses().then((courses) => courses.find((c) => c.id === courseId)),
    ]);

    if (!student || !course) {
      throw new Error("Student or Course not found");
    }

    // Update student
    const courseIdNum = Number(courseId);
    const newEnrollments = [
      ...new Set([...student.enrolledCourses, courseIdNum]),
    ];

    // Update course
    const newEnrollmentCount = course.enrollmentCount + 1;

    // Save both
    await Promise.all([
      axios.put(`/students/${studentId}`, {
        ...student,
        enrolledCourses: newEnrollments,
      }),
      axios.put(`/courses/${courseId}`, {
        ...course,
        enrollmentCount: newEnrollmentCount,
      }),
    ]);
  };

  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });
  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const mutation = useMutation({
    mutationFn: enrollStudent,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
      queryClient.invalidateQueries({
        queryKey: ["studentProfile", variables.studentId],
      });
      queryClient.invalidateQueries({ queryKey: ["course-list"] });

      alert("Student enrolled successfully!");
      setStudentId("");
      setCourseId("");
    },
    onError: (err) => {
      console.error(err);
      alert("Failed to enroll student");
    },
  });

  const selectedStudent = students.find((s) => s.id === studentId);
  const isAlreadyEnrolled =
    selectedStudent && courseId
      ? selectedStudent.enrolledCourses.includes(Number(courseId))
      : false;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentId || !courseId) return;

    if (isAlreadyEnrolled) {
      alert("Student is already enrolled in this course!");
      return;
    }

    mutation.mutate({
      studentId,
      courseId,
    });
  };
  {
    console.log(studentId, courseId);
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assign Students to Courses</h1>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          href="/"
          className="text-sm px-3 py-1.5 bg-lSkyLight text-gray-700 rounded-md hover:bg-lSky transition-colors duration-150 font-medium"
        >
          Dashboard Panel
        </Link>

        <Link
          href="/faculty/grades"
          className="text-sm px-3 py-1.5 bg-lSkyLight text-gray-700 rounded-md hover:bg-lSky transition-colors duration-150 font-medium"
        >
          Student Grade Panel →
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
              {console.log("students:", studentId)}
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
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} (Enrolled: {c.enrollmentCount})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedStudent && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">
              <span className="font-medium">Current courses:</span>{" "}
              {selectedStudent.enrolledCourses
                .map(
                  (id) =>
                    courses.find((c) => c.id === String(id))?.title ||
                    `ID ${id}`
                )
                .join(", ") || "None"}
            </p>
          </div>
        )}
        {isAlreadyEnrolled && (
          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800">
              <span className="font-medium">Warning:</span> Student is already
              enrolled in this course!
            </p>
          </div>
        )}
        <button
          type="submit"
          disabled={
            mutation.isPending || !studentId || !courseId || isAlreadyEnrolled
          }
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {mutation.isPending ? "Enrolling..." : "Enroll Student"}
        </button>
      </form>
    </div>
  );
}
