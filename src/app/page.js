"use client";

import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/ui/StatCard";
import LeaderboardTable from "@/components/dashboard/LeaderboardTable";
import CourseEnrollmentChart from "@/components/dashboard/CourseEnrollmentChart";
import Link from "next/link";
import { fetchStudents, fetchCourses, fetchFaculty } from "@/lib/apiClient";

const fetchDashboardData = async () => {
  const [students, courses, faculty] = await Promise.all([
    fetchStudents(),
    fetchCourses(),
    fetchFaculty(),
  ]);

  const stats = [students.length, courses.length, faculty.length];

  const topStudents = [...students].sort((a, b) => b.gpa - a.gpa).slice(0, 10);

  const popularCourses = [...courses]
    .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
    .slice(0, 5);

  return {
    stats,
    topStudents,
    popularCourses,
  };
};

export default function DashboardPage() {
  const {
    data = { stats: [0, 0, 0], topStudents: [], popularCourses: [] },
    isLoading,
  } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: fetchDashboardData,

    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const [totalStudents, totalCourses, totalFaculty] = data.stats;

  if (isLoading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Academic Dashboard</h1>

      {/* Navigation Links */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          href="/students"
          className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-150 font-medium"
        >
          Student Panel
        </Link>
        <Link
          href="/courses"
          className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-150 font-medium"
        >
          Course Panel
        </Link>
        <Link
          href="/faculty/grades"
          className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-150 font-medium"
        >
          Student Grade Panel
        </Link>
        <Link
          href="/faculty/enrollments"
          className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-150 font-medium"
        >
          Courses Assign Panel
        </Link>
        <Link
          href="/reports/top-students"
          className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-150 font-medium"
        >
          Top Students Report
        </Link>
        <Link
          href="/reports/enrollments-over-time"
          className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-150 font-medium"
        >
          Enrollments Over Time Report
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Students" value={totalStudents} />
        <StatCard title="Total Courses" value={totalCourses} />
        <StatCard title="Faculty Members" value={totalFaculty} />
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LeaderboardTable students={data.topStudents} />
        <CourseEnrollmentChart courses={data.popularCourses} />
      </div>
    </div>
  );
}
