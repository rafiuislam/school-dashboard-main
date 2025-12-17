import { Parser } from "json2csv";

export const exportReportToCSV = (
  reports,
  filename = "top-students-report.csv"
) => {
  try {
    const csvData = [];

    reports.forEach((report) => {
      report.topStudents.forEach((student, index) => {
        csvData.push({
          "Course ID": report.courseId,
          "Course Title": report.courseTitle,
          Rank: index + 1,
          "Student Name": student.studentName,
          Score: student.score,
          Grade: student.grade,
          "Progress (%)": student.progress,
        });
      });
    });

    const parser = new Parser();
    const csv = parser.parse(csvData);

    // Create and download file
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("CSV Export Error:", error);
    alert("Failed to export CSV file");
  }
};

export const exportEnrollmentTrendsToCSV = (
  trends,
  filename = "enrollment-trends.csv"
) => {
  try {
    const csvData = [];

    trends.forEach((course) => {
      const row = {
        "Course ID": course.id,
        "Course Title": course.title,
        "Current Enrollment": course.enrollmentCount,
      };

      // Add monthly columns
      course.trend.forEach((monthData) => {
        row[monthData.month] = monthData.count;
      });

      csvData.push(row);
    });

    const parser = new Parser();
    const csv = parser.parse(csvData);

    // Create and download file
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("CSV Export Error:", error);
    alert("Failed to export CSV file");
  }
};
