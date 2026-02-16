
const moment = require('moment');
// Format date
exports.formatDate = (date, format = 'YYYY-MM-DD') => {
    return moment(date).format(format);
};

// Calculate age
exports.calculateAge = (dateOfBirth) => {
    return moment().diff(moment(dateOfBirth), 'years');
};

// Generate admission number
exports.generateAdmissionNumber = async (academicYear) => {
    const Student = require('../models/Student');
    const count = await Student.countDocuments({ academicYear });
    const year = academicYear.substring(0, 4);
    return `ADM${year}${String(count + 1).padStart(4, '0')}`;
};

// Generate employee ID
exports.generateEmployeeId = async () => {
    const Teacher = require('../models/Teacher');
    const count = await Teacher.countDocuments();
    const year = new Date().getFullYear();
    return `EMP${year}${String(count + 1).padStart(4, '0')}`;
};

// Calculate percentage
exports.calculatePercentage = (obtained, total) => {
    if (total === 0) return 0;
    return ((obtained / total) * 100).toFixed(2);
};

// Get grade from percentage
exports.getGradeFromPercentage = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 33) return 'D';
    return 'F';
};

// Paginate results
exports.paginate = (query, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return query.skip(skip).limit(limit);
};

// Generate random password
exports.generatePassword = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

// Validate email
exports.isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate phone
exports.isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
};

// Get academic year
exports.getCurrentAcademicYear = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Academic year starts in April (month 3)
    if (currentMonth >= 3) {
        return `${currentYear}-${currentYear + 1}`;
    } else {
        return `${currentYear - 1}-${currentYear}`;
    }
};

// Calculate late fee
exports.calculateLateFee = (dueDate, baseAmount, lateFeePercentage = 5) => {
    const today = new Date();
    const due = new Date(dueDate);

    if (today <= due) return 0;

    const daysLate = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
    const lateFee = (baseAmount * lateFeePercentage / 100) * Math.ceil(daysLate / 30);

    return lateFee;
};

// Get working days between dates
exports.getWorkingDays = (startDate, endDate) => {
    let count = 0;
    const start = moment(startDate);
    const end = moment(endDate);

    while (start <= end) {
        const dayOfWeek = start.day();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
            count++;
        }
        start.add(1, 'days');
    }

    return count;
};

// Format currency
exports.formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

// Sanitize input
exports.sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
};

