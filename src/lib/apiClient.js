import api from "@/lib/axios";

export const fetchStudents = () => api.get("/students").then((res) => res.data);
export const fetchCourses = () => api.get("/courses").then((res) => res.data);
export const fetchFaculty = () => api.get("/faculty").then((res) => res.data);
export const fetchGrades = () => api.get("/grades").then((res) => res.data);
