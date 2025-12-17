Academic Management Dashboard
A feature-rich academic management system built with Next.js (App Router) that provides administrators and faculty members with tools to manage students, courses, grades, and generate reports.

Dependencies: npm install axios apexcharts react-apexcharts json2csv
npm install -D json-server
First run: npm run mock-api, to serve the local Mock API db.json file.
Then run: npm run dev

UI/UX Considered:
• Used React + TailwindCSS.
• Used React Query for state management.

Technicals:
• Used Next.js (16.0.10) & React (19.2.1).
• API handled using Axios.
• Component-based architecture used.
• Implement pagination, search, and filtering done where required.
• Used ApexCharts for analytics visualization such as bar chart

Key Implementation:
String IDs: All id fields in db.json use strings (required by JSON Server)
Consistent Data Fetching: Centralized API calls via apiClient.js
Real-time Updates: React Query cache invalidation ensures data consistency
Responsive Design: Fully mobile-friendly with Tailwind CSS
Error Handling: User-friendly alerts and console logging

🚀 Features
📊 Dashboard
Summary cards (total students, courses, faculty)
• Top students leaderboard (by GPA)
• Course enrollment analytics with ApexCharts(sorted by enrollment count)
👥 Student & Course Management
• Student listing with search, filter (year, course), and pagination
• Student profile with enrolled courses and grade history & progress summary
• Course listing with faculty and enrollment counts
👨‍🏫 Faculty Panel
• Grade Management: Assign/update student grades with auto-grade calculation
• Course Enrollment: Assign students to courses with duplicate prevention
Real-time data synchronization across all views
📈 Reporting & Exporting
• Course enrollment trends (simulated 5 months mock data)
• Top-performing students by course
• Export reports to CSV (Excel compatible)

src/
├── app/ # Next.js App Router pages
│ ├── page.js # Dashboard
│ ├── students/ # Student management
│ ├── courses/ # Course management  
│ ├── faculty/ # Grade & enrollment panels
│ └── reports/ # Analytics reports
├── lib/
│ ├── axios.js # API client
│ ├── apiClient.js # Centralized data fetching
│ └── csvExporter.js # CSV export utilities
└── components/ # Reusable UI components
