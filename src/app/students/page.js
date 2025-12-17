"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import StudentTable from "@/components/students/StudentTable";
import Link from "next/link";
import { fetchStudents, fetchCourses } from "@/lib/apiClient";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");

  const debouncedSearch = useDebounce(search, 300);

  const { data: allStudents = [] } = useQuery({
    queryKey: ["all-students"],
    queryFn: fetchStudents,
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["all-courses"],
    queryFn: fetchCourses,
  });

  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      // Year filter
      const matchesYear = !yearFilter || String(student.year) === yearFilter;

      // Search by name or email (case-insensitive)
      const matchesSearch =
        !debouncedSearch ||
        student.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        student.email.toLowerCase().includes(debouncedSearch.toLowerCase());

      // Course filter
      const matchesCourse =
        !courseFilter || student.enrolledCourses.includes(Number(courseFilter));

      return matchesYear && matchesSearch && matchesCourse;
    });
  }, [allStudents, yearFilter, debouncedSearch, courseFilter]);

  const years = [...new Set(allStudents.map((s) => s.year))].sort().reverse();

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Student Management</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          href="/"
          className="text-sm px-3 py-1.5 bg-lSkyLight text-gray-700 rounded-md hover:bg-lSky transition-colors duration-150 font-medium"
        >
          Dashboard Panel
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-500 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="px-4 py-2 border border-gray-500 rounded-lg w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-500 rounded-lg"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            className="px-4 py-2 border border-gray-500 rounded-lg"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Table */}
      <StudentTable students={filteredStudents} />
    </div>
  );
}
