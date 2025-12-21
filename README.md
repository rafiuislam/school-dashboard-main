
Academic Management Dashboard
A feature-rich academic management system built with Next.js (App Router) that provides administrators and faculty members with tools to manage students, courses, grades, and generate reports.

<img width="1918" height="918" alt="dashboard" src="https://github.com/user-attachments/assets/ad689379-5ebe-4112-a78c-eb92b6049728" />

<br/>
Incase of local deployement:
Dependencies: npm install axios apexcharts react-apexcharts json2csv / npm i
npm install -D json-server
First run: npm run mock-api, to serve the local Mock API db.json file. In the axios.js // use: "http://localhost:4000" as baseURL
Then run: npm run dev

<br/>

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

<br/>
UI/UX Considerations:
• Used React + TailwindCSS.
• Used React Query for state management.

<br/>
Technicals:
• Used Next.js (16.0.10) & React (19.2.1).
• API handled using Axios.
• Component-based architecture used. 
• Implement pagination, search, and filtering done where required.
• Used ApexCharts for analytics visualization such as bar chart 

<br/>
Key Implementation:
String IDs: All id fields in db.json use strings (required by JSON Server)
Consistent Data Fetching: Centralized API calls via apiClient.js
Real-time Updates: React Query cache invalidation ensures data consistency
Responsive Design: Fully mobile-friendly with Tailwind CSS
Error Handling: User-friendly alerts and console logging

<br/>
📁 Mock Data (db.json)
Includes realistic academic data:
5 students with GPA and enrollments
4 courses with faculty assignments
grade records with scores and progress
Enrollment counts automatically synced


<br/>
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

<img width="1919" height="923" alt="studentManagement" src="https://github.com/user-attachments/assets/65879b42-8223-4413-951f-29e50efaddb5" />
<img width="1646" height="998" alt="studentDetails" src="https://github.com/user-attachments/assets/dfbc1313-48f5-413c-b7c9-b62649a0d944" />
<img width="1694" height="845" alt="courseManagement" src="https://github.com/user-attachments/assets/e0d514a1-39e2-464d-9861-26cbd297aea6" />
<img width="1774" height="1006" alt="Enrollments-overTime" src="https://github.com/user-attachments/assets/f8162e36-ca0f-4d9a-b5d5-274f979a09a9" />
<img width="1653" height="855" alt="assignEnrollment" src="https://github.com/user-attachments/assets/534a0314-2397-449c-9c8b-5780da253f46" />
<img width="1761" height="1006" alt="Top-PerformingStudents" src="https://github.com/user-attachments/assets/dce33d37-98d7-44a6-aa15-6e08b9d6a7db" />
<img width="1652" height="806" alt="manageGrade" src="https://github.com/user-attachments/assets/d5d4a391-be3b-4a0a-a018-a0199272f2aa" />
