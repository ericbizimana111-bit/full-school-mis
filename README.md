# 🎓 School Management Information System (MIS)

A comprehensive, production-ready full-stack school management system built with Node.js, Express, MongoDB, and React.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Seeding](#database-seeding)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

##  Features

### Core Modules

- *** User Management**
  - Multi-role system (Admin, Teacher, Student, Parent, Accountant, Librarian)
  - JWT authentication & authorization
  - Profile management
  - Password reset

- *** Student Management**
  - Student registration & enrollment
  - Academic records
  - Document management
  - Performance tracking
  - Hostel & transport allocation

- *** Teacher Management**
  - Employee records
  - Subject assignments
  - Class teacher designation
  - Performance reviews
  - Leave management

- *** Attendance System**
  - Daily attendance marking
  - Period-wise tracking
  - Attendance reports
  - Automated notifications
  - Analytics & statistics

- *** Academic Management**
  - Grade management
  - Exam scheduling
  - Report card generation
  - Assignment tracking
  - Timetable management

- *** Fee Management**
  - Fee structure setup
  - Payment processing
  - Receipt generation
  - Payment reminders
  - Financial reports

- *** Library Management**
  - Book catalog
  - Issue/return tracking
  - Fine calculation
  - Borrowing history

- *** Transport Management**
  - Route management
  - Vehicle tracking
  - Driver information
  - Student allocation

- *** Hostel Management**
  - Room allocation
  - Warden assignment
  - Facilities management

- *** Communication**
  - Announcements
  - Events calendar
  - Notifications
  - Email alerts

## * Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Winston** - Logging
- **Socket.io** - Real-time updates
- **Cloudinary** - File storage
- **PDF-lib** - PDF generation
- **ExcelJS** - Excel reports

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management

##  Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**
- **Git**

##  Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/school-mis.git
cd school-mis
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

##  Configuration

### 1. Create Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/school_mis

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 2. Setup Cloudinary (Optional but Recommended)

1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get your credentials from dashboard
3. Update `.env` with your credentials

### 3. Setup Email Service

For Gmail:
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use app password in `.env`

##  Database Seeding

### Create Necessary Directories

```bash
cd backend
node scripts/createDirectories.js
```

### Seed the Database

```bash
npm run seed
```

This will create:
- 1 Admin user
- 5 Teachers
- 8 Students with Parents
- 3 Classes
- 8 Subjects

### Default Login Credentials

**Admin:**
- Email: `admin@school.com`
- Password: `admin123`

**Teacher:**
- Email: `john.smith@school.com`
- Password: `teacher123`

**Student:**
- Email: `alice.anderson@student.com`
- Password: `student123`

**Parent:**
- Email: `robert.anderson@parent.com`
- Password: `parent123`

 **Important:** Change these passwords in production!

##  Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

**Frontend:**
```bash
cd frontend
npm start
```
Client runs on `http://localhost:3000`

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```

##  API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
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

#### Login
```http
POST /api/auth/login
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

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Student Endpoints

#### Get All Students
```http
GET /api/students
Authorization: Bearer <token>

Query Parameters:
- class: Filter by class ID
- section: Filter by section
- academicYear: Filter by academic year
- status: Filter by status (active, inactive, etc.)
- search: Search by name or email
```

#### Get Single Student
```http
GET /api/students/:id
Authorization: Bearer <token>
```

#### Create Student
```http
POST /api/students
Authorization: Bearer <token>
Content-Type: application/json

{
  "userData": {
    "email": "student@example.com",
    "password": "password123",
    "firstName": "Jane",
    "lastName": "Doe",
    "phone": "1234567890",
    "dateOfBirth": "2010-01-01",
    "gender": "Female"
  },
  "studentData": {
    "admissionNumber": "ADM20240001",
    "admissionDate": "2024-01-01",
    "class": "class_id_here",
    "section": "A",
    "rollNumber": "1",
    "academicYear": "2024-2025",
    "bloodGroup": "O+"
  }
}
```

#### Update Student
```http
PUT /api/students/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "userData": { ... },
  "studentData": { ... }
}
```

#### Delete Student (Soft Delete)
```http
DELETE /api/students/:id
Authorization: Bearer <token>
```

#### Get Student Attendance
```http
GET /api/students/:id/attendance
Authorization: Bearer <token>

Query Parameters:
- startDate: Start date (YYYY-MM-DD)
- endDate: End date (YYYY-MM-DD)
```

#### Get Student Grades
```http
GET /api/students/:id/grades
Authorization: Bearer <token>

Query Parameters:
- academicYear: Filter by academic year
- exam: Filter by exam ID
```

### Attendance Endpoints

#### Mark Attendance
```http
POST /api/attendance
Authorization: Bearer <token>
Content-Type: application/json

{
  "students": [
    {
      "studentId": "student_id_1",
      "status": "Present",
      "remarks": "On time"
    },
    {
      "studentId": "student_id_2",
      "status": "Absent",
      "remarks": "Sick"
    }
  ],
  "date": "2024-01-15",
  "class": "class_id",
  "section": "A",
  "subject": "subject_id",
  "period": 1
}
```

#### Get Attendance by Class
```http
GET /api/attendance/class/:classId
Authorization: Bearer <token>

Query Parameters:
- date: Date (YYYY-MM-DD)
- section: Section name
```

#### Get Attendance Report
```http
GET /api/attendance/report
Authorization: Bearer <token>

Query Parameters:
- startDate: Start date
- endDate: End date
- class: Class ID
- section: Section name
```

### Grade Endpoints

#### Add Grade
```http
POST /api/grades
Authorization: Bearer <token>
Content-Type: application/json

{
  "student": "student_id",
  "exam": "exam_id",
  "subject": "subject_id",
  "marks": {
    "obtained": 85,
    "total": 100
  },
  "remarks": "Excellent performance",
  "academicYear": "2024-2025"
}
```

#### Update Grade
```http
PUT /api/grades/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "marks": {
    "obtained": 90,
    "total": 100
  },
  "remarks": "Outstanding"
}
```

#### Get Grades by Exam
```http
GET /api/grades/exam/:examId
Authorization: Bearer <token>
```

#### Get Report Card
```http
GET /api/grades/report/:studentId/:examId
Authorization: Bearer <token>
```

### Fee Endpoints

#### Create Fee Record
```http
POST /api/fees
Authorization: Bearer <token>
Content-Type: application/json

{
  "student": "student_id",
  "academicYear": "2024-2025",
  "feeStructure": {
    "tuition": 5000,
    "admission": 1000,
    "examination": 500,
    "library": 200,
    "sports": 300
  },
  "totalAmount": 7000,
  "dueDate": "2024-12-31"
}
```

#### Record Payment
```http
POST /api/fees/payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "feeId": "fee_id",
  "student": "student_id",
  "amount": 2000,
  "paymentMethod": "Cash",
  "transactionId": "TXN123456",
  "remarks": "Partial payment"
}
```

#### Get Fee Details
```http
GET /api/fees/:id
Authorization: Bearer <token>
```

#### Get Fee Report
```http
GET /api/fees/report
Authorization: Bearer <token>

Query Parameters:
- academicYear: Filter by academic year
- class: Filter by class
- status: Filter by status (Paid, Pending, Overdue)
```

### Dashboard Endpoints

#### Admin Dashboard
```http
GET /api/dashboard/admin
Authorization: Bearer <token>
```

#### Teacher Dashboard
```http
GET /api/dashboard/teacher
Authorization: Bearer <token>
```

#### Student Dashboard
```http
GET /api/dashboard/student
Authorization: Bearer <token>
```

### Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

##  Project Structure

```
school-mis/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   ├── cloudinary.js
│   │   └── email.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Teacher.js
│   │   └── ... (all models)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   └── ... (all controllers)
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── ... (all middlewares)
│   ├── routes/
│   │   ├── auth.js
│   │   ├── students.js
│   │   └── ... (all routes)
│   ├── utils/
│   │   ├── logger.js
│   │   ├── emailService.js
│   │   └── ... (all utilities)
│   ├── seeders/
│   │   └── seed.js
│   ├── scripts/
│   │   ├── createDirectories.js
│   │   └── cleanDatabase.js
│   ├── logs/
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── services/
    │   ├── utils/
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 💡 Usage Tips

### For Administrators
1. Login with admin credentials
2. Create classes and subjects
3. Add teachers and assign them to classes
4. Enroll students
5. Manage fees and payments
6. Monitor attendance and grades
7. Generate reports

### For Teachers
1. Login with teacher credentials
2. Mark daily attendance
3. Enter grades and exam results
4. Create assignments
5. Communicate with parents
6. View class performance

### For Students/Parents
1. Login with credentials
2. View attendance records
3. Check grades and report cards
4. View assignments
5. Make fee payments
6. Read announcements

##  Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Rate limiting on auth endpoints
- Input validation and sanitization
- SQL injection protection
- XSS prevention
- CORS configuration
- Helmet security headers

##  Reporting Features

The system generates various reports:
- Attendance reports (Excel)
- Fee reports (Excel)
- Grade sheets (Excel)
- Report cards (PDF)
- Payment receipts (PDF)
- Performance analytics

##  Real-time Features

Using Socket.io for:
- Attendance notifications
- Result publications
- Announcements
- Live updates

##  Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

##  Scripts

```bash
# Backend
npm start          # Start production server
npm run dev        # Start development server
npm run seed       # Seed database
npm run setup      # Setup directories and seed
npm run clean      # Clean database

# Frontend
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License.

##  Support

For support, email support@schoolmis.com or join our Slack channel.
##  Acknowledgments

- Node.js community
- MongoDB team
- React developers
- All contributors

---

**Made with  for educational institutions**
