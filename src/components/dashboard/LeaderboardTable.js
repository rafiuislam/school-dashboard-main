import { useState } from "react";

export default function LeaderboardTable({ students }) {
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 3;

  // Calculate pagination
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold">Top Students (by GPA)</h3>
      </div>

      <table className="w-full">
        <thead className="bg-gray-50 text-left text-sm text-gray-600">
          <tr>
            <th className="p-4">Rank</th>
            <th className="p-4">Name</th>
            <th className="p-4">GPA</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.length > 0 ? (
            currentStudents.map((student, index) => (
              <tr
                key={student.id}
                className="border-t border-gray-100 hover:bg-gray-50"
              >
                <td className="p-4 font-medium">
                  #{(currentPage - 1) * studentsPerPage + index + 1}
                </td>
                <td className="p-4">{student.name}</td>
                <td className="p-4">{student.gpa.toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-500">
                No students found.
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
  );
}
