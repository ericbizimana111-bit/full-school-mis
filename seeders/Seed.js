const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load models
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');
const Class = require('../models/Class');
const Subject = require('../models/Subject');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany();
    await Student.deleteMany();
    await Teacher.deleteMany();
    await Parent.deleteMany();
    await Class.deleteMany();
    await Subject.deleteMany();

    console.log('✅ Cleared existing data');

    // Create Admin User
    const admin = await User.create({
      email: 'admin@school.com',
      password: 'admin123',
      role: 'admin',
      firstName: 'System',
      lastName: 'Administrator',
      phone: '1234567890',
      address: {
        street: '123 Admin St',
        city: 'Admin City',
        state: 'Admin State',
        zipCode: '12345',
        country: 'USA'
      },
      dateOfBirth: new Date('1980-01-01'),
      gender: 'Male'
    });

    console.log('✅ Created admin user');

    // Create Subjects
    const subjects = await Subject.insertMany([
      { name: 'Mathematics', code: 'MATH101', type: 'Core', totalMarks: 100, passingMarks: 33 },
      { name: 'English', code: 'ENG101', type: 'Core', totalMarks: 100, passingMarks: 33 },
      { name: 'Science', code: 'SCI101', type: 'Core', totalMarks: 100, passingMarks: 33 },
      { name: 'History', code: 'HIST101', type: 'Core', totalMarks: 100, passingMarks: 33 },
      { name: 'Geography', code: 'GEO101', type: 'Core', totalMarks: 100, passingMarks: 33 },
      { name: 'Computer Science', code: 'CS101', type: 'Elective', totalMarks: 100, passingMarks: 33 },
      { name: 'Physical Education', code: 'PE101', type: 'Optional', totalMarks: 50, passingMarks: 20 },
      { name: 'Art', code: 'ART101', type: 'Optional', totalMarks: 50, passingMarks: 20 }
    ]);

    console.log('✅ Created subjects');

    // Create Classes
    const classes = await Class.insertMany([
      {
        name: 'Class 1',
        grade: 1,
        sections: [
          { name: 'A', capacity: 30 },
          { name: 'B', capacity: 30 }
        ],
        subjects: subjects.slice(0, 5).map(s => s._id),
        academicYear: '2024-2025',
        fees: {
          tuition: 5000,
          admission: 1000,
          examination: 500,
          library: 200,
          sports: 300,
          transport: 1000,
          other: 200
        }
      },
      {
        name: 'Class 2',
        grade: 2,
        sections: [
          { name: 'A', capacity: 30 },
          { name: 'B', capacity: 30 }
        ],
        subjects: subjects.slice(0, 5).map(s => s._id),
        academicYear: '2024-2025',
        fees: {
          tuition: 5500,
          admission: 1000,
          examination: 500,
          library: 200,
          sports: 300,
          transport: 1000,
          other: 200
        }
      },
      {
        name: 'Class 3',
        grade: 3,
        sections: [
          { name: 'A', capacity: 30 },
          { name: 'B', capacity: 30 }
        ],
        subjects: subjects.slice(0, 6).map(s => s._id),
        academicYear: '2024-2025',
        fees: {
          tuition: 6000,
          admission: 1000,
          examination: 500,
          library: 200,
          sports: 300,
          transport: 1000,
          other: 200
        }
      }
    ]);

    console.log('✅ Created classes');

    // Create Teachers
    const teacherUsers = [];
    const teacherNames = [
      { first: 'John', last: 'Smith', email: 'john.smith@school.com' },
      { first: 'Sarah', last: 'Johnson', email: 'sarah.johnson@school.com' },
      { first: 'Michael', last: 'Brown', email: 'michael.brown@school.com' },
      { first: 'Emily', last: 'Davis', email: 'emily.davis@school.com' },
      { first: 'David', last: 'Wilson', email: 'david.wilson@school.com' }
    ];

    for (let i = 0; i < teacherNames.length; i++) {
      const teacherUser = await User.create({
        email: teacherNames[i].email,
        password: 'teacher123',
        role: 'teacher',
        firstName: teacherNames[i].first,
        lastName: teacherNames[i].last,
        phone: `555000${i + 1}000`,
        address: {
          street: `${i + 1}00 Teacher Lane`,
          city: 'School City',
          state: 'Education State',
          zipCode: '54321',
          country: 'USA'
        },
        dateOfBirth: new Date(1985 + i, i, 15),
        gender: i % 2 === 0 ? 'Male' : 'Female'
      });

      teacherUsers.push(teacherUser);

      await Teacher.create({
        user: teacherUser._id,
        employeeId: `EMP2024${String(i + 1).padStart(4, '0')}`,
        joiningDate: new Date('2023-01-01'),
        designation: i === 0 ? 'Principal' : 'Teacher',
        department: ['Mathematics', 'English', 'Science', 'History', 'Geography'][i],
        subjects: [subjects[i]._id],
        classes: [
          {
            class: classes[i % classes.length]._id,
            section: 'A',
            isClassTeacher: i === 0
          }
        ],
        qualifications: [
          {
            degree: 'B.Ed',
            institution: 'Education University',
            year: 2010 + i,
            specialization: ['Mathematics', 'English', 'Science', 'History', 'Geography'][i]
          }
        ],
        salary: {
          basic: 50000 + (i * 5000),
          allowances: {
            housing: 10000,
            transport: 5000,
            medical: 3000,
            other: 2000
          },
          deductions: {
            tax: 5000,
            providentFund: 2000,
            other: 1000
          }
        }
      });
    }

    console.log('✅ Created teachers');

    // Create Students with Parents
    const studentData = [
      { first: 'Alice', last: 'Anderson', email: 'alice.anderson@student.com', parent: 'Robert Anderson', parentEmail: 'robert.anderson@parent.com' },
      { first: 'Bob', last: 'Brown', email: 'bob.brown@student.com', parent: 'Linda Brown', parentEmail: 'linda.brown@parent.com' },
      { first: 'Charlie', last: 'Clark', email: 'charlie.clark@student.com', parent: 'James Clark', parentEmail: 'james.clark@parent.com' },
      { first: 'Diana', last: 'Davis', email: 'diana.davis@student.com', parent: 'Mary Davis', parentEmail: 'mary.davis@parent.com' },
      { first: 'Ethan', last: 'Evans', email: 'ethan.evans@student.com', parent: 'Thomas Evans', parentEmail: 'thomas.evans@parent.com' },
      { first: 'Fiona', last: 'Foster', email: 'fiona.foster@student.com', parent: 'Patricia Foster', parentEmail: 'patricia.foster@parent.com' },
      { first: 'George', last: 'Garcia', email: 'george.garcia@student.com', parent: 'Richard Garcia', parentEmail: 'richard.garcia@parent.com' },
      { first: 'Hannah', last: 'Harris', email: 'hannah.harris@student.com', parent: 'Barbara Harris', parentEmail: 'barbara.harris@parent.com' }
    ];

    for (let i = 0; i < studentData.length; i++) {
      // Create parent user
      const parentUser = await User.create({
        email: studentData[i].parentEmail,
        password: 'parent123',
        role: 'parent',
        firstName: studentData[i].parent.split(' ')[0],
        lastName: studentData[i].parent.split(' ')[1],
        phone: `555${String(i + 1).padStart(7, '0')}`,
        address: {
          street: `${i + 1}00 Parent Street`,
          city: 'Parent City',
          state: 'Parent State',
          zipCode: '67890',
          country: 'USA'
        },
        dateOfBirth: new Date(1975 + i, i, 10),
        gender: i % 2 === 0 ? 'Male' : 'Female'
      });

      // Create student user
      const studentUser = await User.create({
        email: studentData[i].email,
        password: 'student123',
        role: 'student',
        firstName: studentData[i].first,
        lastName: studentData[i].last,
        phone: `555${String(i + 100).padStart(7, '0')}`,
        address: {
          street: `${i + 1}00 Student Avenue`,
          city: 'Student City',
          state: 'Student State',
          zipCode: '98765',
          country: 'USA'
        },
        dateOfBirth: new Date(2010 + (i % 3), i % 12, 15),
        gender: i % 2 === 0 ? 'Male' : 'Female'
      });

      // Create parent record
      const parent = await Parent.create({
        user: parentUser._id,
        relation: i % 2 === 0 ? 'Father' : 'Mother',
        occupation: ['Engineer', 'Doctor', 'Teacher', 'Businessman', 'Lawyer'][i % 5],
        income: 50000 + (i * 10000),
        emergencyContact: {
          name: `Emergency ${studentData[i].parent}`,
          phone: `555${String(i + 200).padStart(7, '0')}`,
          relation: 'Spouse'
        }
      });

      // Create student record
      const student = await Student.create({
        user: studentUser._id,
        admissionNumber: `ADM2024${String(i + 1).padStart(4, '0')}`,
        admissionDate: new Date('2024-01-01'),
        class: classes[i % classes.length]._id,
        section: i % 2 === 0 ? 'A' : 'B',
        rollNumber: String(i + 1),
        academicYear: '2024-2025',
        parents: [parent._id],
        bloodGroup: ['A+', 'B+', 'O+', 'AB+'][i % 4],
        emergencyContact: {
          name: studentData[i].parent,
          relationship: i % 2 === 0 ? 'Father' : 'Mother',
          phone: `555${String(i + 1).padStart(7, '0')}`
        }
      });

      // Update parent with student reference
      parent.students.push(student._id);
      await parent.save();
    }

    console.log('✅ Created students and parents');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:');
    console.log('  Email: admin@school.com');
    console.log('  Password: admin123');
    console.log('\nTeacher (example):');
    console.log('  Email: john.smith@school.com');
    console.log('  Password: teacher123');
    console.log('\nStudent (example):');
    console.log('  Email: alice.anderson@student.com');
    console.log('  Password: student123');
    console.log('\nParent (example):');
    console.log('  Email: robert.anderson@parent.com');
    console.log('  Password: parent123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
