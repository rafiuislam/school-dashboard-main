"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { fetchCourses, fetchFaculty } from "@/lib/apiClient";

const fetchCourseList = async () => {
  const [courses, faculty] = await Promise.all([
    fetchCourses(),
    fetchFaculty(),
  ]);
  console.log("courses:", courses);

  const facultyMap = faculty.reduce((acc, f) => {
    acc[f.id] = f.name;
    return acc;
  }, {});

  return courses.map((course) => ({
    ...course,
    facultyName: facultyMap[course.facultyId] || "—",
  }));
};

export default function CoursesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 3;

  const { data: courses = [] } = useQuery({
    queryKey: ["course-list"],
    queryFn: fetchCourseList,
  });

  // Pagination logic
  const totalPages = Math.ceil(courses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Course Management</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          href="/"
          className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-150 font-medium"
        >
          Dashboard Panel
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-sm text-gray-600">
            <tr>
              <th className="p-4">Course Title</th>
              <th className="p-4">Faculty</th>
              <th className="p-4">Enrollment</th>
            </tr>
          </thead>
          <tbody>
            {currentCourses.length > 0 ? (
              currentCourses.map((course) => (
                <tr
                  key={course.id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">{course.title}</td>
                  <td className="p-4">{course.facultyName}</td>
                  <td className="p-4">{course.enrollmentCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-center">
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
