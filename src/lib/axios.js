import axios from "axios";

const api = axios.create({
  baseURL: "https://school-dashboard-db.onrender.com", // incase of local dev use: "http://localhost:4000"
  timeout: 15000,
});

// Use Render backend URL in production
// const baseURL =
//   process.env.NODE_ENV === "production"
//     ? "https://school-dashboard-db.onrender.com"
//     : "http://localhost:4000";

// const api = axios.create({
//   baseURL,
//   timeout: 15000,
// });

export default api;
