
module.exports = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    from: `School MIS <${process.env.EMAIL_USER}>`,
    templates: {
        welcome: {
            subject: 'Welcome to School Management System',
            template: 'welcome'
        },
        attendance: {
            subject: 'Attendance Notification',
            template: 'attendance'
        },
        fee: {
            subject: 'Fee Payment Reminder',
            template: 'fee'
        },
        exam: {
            subject: 'Exam Notification',
            template: 'exam'
        },
        result: {
            subject: 'Results Published',
            template: 'result'
        }
    }
};