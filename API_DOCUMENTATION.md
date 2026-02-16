# API Documentation

## Base URL
`http://localhost:5000/api/v1`

## Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "phone": "1234567890"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "student",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

## Available Endpoints

### Students
- GET /students - Get all students (requires auth)
- GET /students/:id - Get single student (requires auth)
- POST /students - Create new student (requires auth)
- PUT /students/:id - Update student (requires auth)
- DELETE /students/:id - Delete student (requires auth)

### Teachers
- GET /teachers - Get all teachers
- GET /teachers/:id - Get single teacher
- POST /teachers - Create new teacher
- PUT /teachers/:id - Update teacher
- DELETE /teachers/:id - Delete teacher

### Classes
- GET /classes - Get all classes
- GET /classes/:id - Get single class
- POST /classes - Create new class
- PUT /classes/:id - Update class
- DELETE /classes/:id - Delete class

### Exams
- GET /exams - Get all exams
- GET /exams/:id - Get single exam
- POST /exams - Create new exam
- PUT /exams/:id - Update exam
- DELETE /exams/:id - Delete exam

### Grades
- GET /grades - Get all grades
- GET /grades/:id - Get single grade
- POST /grades - Add new grade
- PUT /grades/:id - Update grade
- DELETE /grades/:id - Delete grade

### Fees
- GET /fees - Get all fees
- GET /fees/:id - Get single fee
- POST /fees - Create fee
- POST /fees/payment - Record payment
- GET /fees/report - Get fee report

### Attendance
- POST /attendance - Mark attendance
- GET /attendance/class/:classId - Get class attendance
- GET /attendance/report - Get attendance report

### Library
- GET /library/books - Get all books
- POST /library/books - Add book
- POST /library/books/:id/issue - Issue book
- POST /library/books/:id/return - Return book

### Tasks
- GET /tasks - Get all tasks
- GET /tasks/:id - Get single task
- POST /tasks - Create task
- PUT /tasks/:id - Update task
- DELETE /tasks/:id - Delete task

## Authorization

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message description"
}
```

HTTP Status Codes:
- 200 - OK
- 201 - Created
- 400 - Bad Request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not Found
- 500 - Internal Server Error
