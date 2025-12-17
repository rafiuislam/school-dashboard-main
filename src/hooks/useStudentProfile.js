import { useQuery } from "@tanstack/react-query";
import {
  fetchStudents,
  fetchCourses,
  fetchFaculty,
  fetchGrades,
} from "@/lib/apiClient";

export function useStudentProfile(studentId) {
  return useQuery({
    queryKey: ["studentProfile", studentId],
    queryFn: async () => {
      const [students, courses, faculty, grades] = await Promise.all([
        fetchStudents(),
        fetchCourses(),
        fetchFaculty(),
        fetchGrades(),
      ]);

      const student = students.find((s) => s.id === studentId);
      if (!student) throw new Error("Student not found");

      const facultyMap = new Map(faculty.map((f) => [f.id, f]));
      const courseMap = new Map(courses.map((c) => [c.id, c]));

      const enrolledCourses = student.enrolledCourses.map((courseId) => {
        const courseIdStr = String(courseId);
        const course = courseMap.get(courseIdStr);
        const facultyMember = course ? facultyMap.get(course.facultyId) : null;

        return {
          id: courseIdStr,
          title: course?.title || `Course ${courseId}`,
          facultyName: facultyMember?.name || "—",
        };
      });

      const studentGrades = grades
        .filter((g) => g.studentId === studentId)
        .map((g) => {
          const course = courseMap.get(g.courseId);
          return {
            ...g,
            courseTitle: course?.title || `Course ${g.courseId}`,
          };
        });

      return {
        ...student,
        enrolledCourses,
        grades: studentGrades,
      };
    },
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000,
  });
}
