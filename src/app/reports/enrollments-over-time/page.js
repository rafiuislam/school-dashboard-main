"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { fetchCourses } from "@/lib/apiClient";
import { exportEnrollmentTrendsToCSV } from "@/lib/csvExporter";

const fetchEnrollmentTrends = async () => {
  const courses = await fetchCourses();

  return courses.map((course) => ({
    id: course.id,
    title: course.title,
    enrollmentCount: course.enrollmentCount,
    // Simulated trend data (last 6 months)
    trend: [
      { month: "Jul", count: Math.floor(course.enrollmentCount * 0.8) },
      { month: "Aug", count: Math.floor(course.enrollmentCount * 0.9) },
      { month: "Sep", count: course.enrollmentCount },
      { month: "Oct", count: Math.floor(course.enrollmentCount * 1.1) },
      { month: "May", count: Math.floor(course.enrollmentCount * 1.2) },
      { month: "Nov", count: Math.floor(course.enrollmentCount * 1.3) },
    ],
  }));
};

export default function EnrollmentTrendsPage() {
  const { data: trends = [], isLoading } = useQuery({
    queryKey: ["enrollment-trends"],
    queryFn: fetchEnrollmentTrends,
  });

  if (isLoading) {
    return <div className="p-6">Loading report...</div>;
  }

  const handleExportCSV = () => {
    if (trends.length === 0) {
      alert("No data to export");
      return;
    }
    exportEnrollmentTrendsToCSV(trends, "enrollment-trends.csv");
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Course Enrollments Over Time</h1>

        <button
          onClick={handleExportCSV}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          disabled={trends.length === 0}
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
          href="/reports/top-students"
          className="text-sm px-3 py-1.5 bg-lSkyLight text-gray-700 rounded-md hover:bg-lSky transition-colors duration-150 font-medium"
        >
          Top Students Report →
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {trends.map((course) => (
          <div
            key={course.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <h2 className="font-semibold mb-4">{course.title}</h2>
            <div className="space-y-2">
              <p>
                <strong>Current Enrollment:</strong> {course.enrollmentCount}
              </p>
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">
                  Last 6 Months (Demo)
                </h3>
                <div className="space-y-1">
                  {course.trend.map((month, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{month.month}</span>
                      <span>{month.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
