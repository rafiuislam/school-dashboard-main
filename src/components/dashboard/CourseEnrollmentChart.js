"use client";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function CourseEnrollmentChart({ courses }) {
  const options = {
    chart: { type: "bar", height: 320, toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 6, horizontal: false } },
    dataLabels: { enabled: false },
    xaxis: { categories: courses.map((c) => c.title) },
    yaxis: { title: { text: "Enrollment Count" } },
    colors: ["#cfceff"],
  };

  const series = [
    {
      name: `Students Enrolled`,
      data: courses.map((c) => c.enrollmentCount),
    },
  ];
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-500 p-4">
      <h3 className="font-semibold mb-4">
        Most Popular Courses (by enrollment count)
      </h3>
      <Chart options={options} series={series} type="bar" height={320} />
    </div>
  );
}
