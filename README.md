# StudentManagementSystem
Overview
The Student Management System is a full-stack application built with React and ASP.NET Core Web API. It enables the management of students, classes, and teachers, and supports image uploads for better visual identification.

Features
Student Management: Add, edit, and view student details.
Class Management: Manage classes and assign students.
Teacher Management: Assign teachers to classes and manage their details.
Image Uploads: Upload and display images for students and teachers.
Responsive Design: Optimized for both desktop and mobile devices.
Tech Stack
Frontend
React: For the user interface and dynamic interactions.
Axios: For API requests.
Material-UI: For responsive and accessible components.
Backend
ASP.NET Core Web API: Handles business logic, data processing, and API endpoints.
Entity Framework Core: For database interaction and migrations.
Database
SQL Server: Relational database for storing entities such as students, teachers, and classes.
Prerequisites
Node.js (for running React)
.NET SDK (for the backend API)
SQL Server (for the database)

API Endpoints
Endpoint	Method	Description
/api/students	GET	Retrieve all students
/api/students/{id}	GET	Retrieve a specific student
/api/students	POST	Add a new student
/api/students/{id}	PUT	Update student details
/api/students/{id}	DELETE	Delete a student
/api/classes	GET	Retrieve all classes
/api/teachers	GET	Retrieve all teachers
