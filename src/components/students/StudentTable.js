import { useState } from "react";
import Link from "next/link";

export default function StudentTable({ students }) {
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 3;

  // Pagination logic
  const totalPages = Math.ceil(students.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (!students?.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
        No students found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 text-left text-sm text-gray-600">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Year</th>
            <th className="p-4">GPA</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student) => (
            <tr
              key={student.id}
              className="border-t border-gray-100 hover:bg-gray-50"
            >
              <td className="p-4 font-medium">{student.name}</td>
              <td className="p-4 text-gray-600">{student.email}</td>
              <td className="p-4">{student.year}</td>
              <td className="p-4">{student.gpa.toFixed(2)}</td>
              <td className="p-4">
                <Link
                  href={`/students/${student.id}`}
                  className="text-indigo-600 hover:underline"
                >
                  View Profile
                </Link>
              </td>
            </tr>
          ))}
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
  );
}
