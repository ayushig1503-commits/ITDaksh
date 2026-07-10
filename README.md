<h1 align="center">
School Management System (Admin Portal)
</h1>

<h3 align="center">
A MERN-based administration portal for managing school structure, teachers, students, subjects, attendance, and academic records.
</h3>

---

# About

This project is the administrative module of a School Management System built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

The application provides administrators with a centralized dashboard to manage the school's academic structure, including:

- Class Groups (Grades)
- Sections
- Subjects
- Students
- Teachers
- Attendance
- Marks
- Audit Logs

The project also includes an audit logging system which records important administrative actions performed within the application.

---

# Features

### Dashboard

- Administrative overview
- Quick navigation to management modules

### Class Management

- Create Class Groups (Grades)
- Create multiple Sections under each Class Group
- Delete and manage classes

### Subject Management

- Add subjects to a Class Group
- Assign teachers to subjects
- Configure weekly sessions

### Teacher Management

- Register teachers
- Assign teachers to sections and subjects
- View teacher profiles

### Student Management

- Register students
- Assign students to sections
- Manage student records

### Attendance

- Record attendance
- View attendance history

### Examination Records

- Store student marks
- View academic performance

### Audit Logging

Tracks administrative activities including:

- Login events
- Teacher creation
- Student creation
- Subject management
- Class management
- Record deletion
- Assignment updates

---

# Tech Stack

### Frontend

- React
- Redux Toolkit
- Material UI
- React Router

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

---

# Installation

## Backend

Navigate to the backend folder.

```
cd backend
npm install
```

Create a `.env` file inside the backend folder.

Example:

```
PORT=5000

MONGO_URL=your_mongodb_connection_string

SECRET_KEY=your_secret_key
```

Start the backend.

```
npm start
```

---

## Frontend

Navigate to the frontend folder.

```
cd frontend
npm install
```

Create a `.env` file.

```
REACT_APP_BASE_URL=http://localhost:5000
```

Start React.

```
npm start
```

The frontend runs on:

```
http://localhost:3000
```

The backend runs on:

```
http://localhost:5000
```

---

# MongoDB Setup

You may use either:

- MongoDB Community Server (local)
- MongoDB Atlas (cloud)

Example local connection string:

```
mongodb://127.0.0.1:27017/school_management
```

Example Atlas connection string:

```
mongodb+srv://username:password@cluster.mongodb.net/school_management
```

---

# Environment Variables

Backend

```
PORT=5000

MONGO_URL=<MongoDB Connection String>

SECRET_KEY=<Random Secret Key>
```

Frontend

```
REACT_APP_BASE_URL=http://localhost:5000
```

---

# Project Structure

```
backend/
    controllers/
    models/
    routes/
    middleware/
    utils/

frontend/
    components/
    pages/
    redux/
    theme/
```

---

# Audit Logging

The system records important administrative actions to provide accountability and traceability.

Examples include:

- Administrator login
- Teacher registration
- Student registration
- Subject assignment
- Class creation
- Record deletion
- Attendance updates

---

# Notes

This project contains only the **Administrator module** of the School Management System.

Student and Teacher portals are not included in this version.