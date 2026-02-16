const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Send welcome email
exports.sendWelcomeEmail = async (user) => {
    try {
        const mailOptions = {
            from: `School MIS <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Welcome to School Management System',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a5568;">Welcome to School MIS!</h2>
          <p>Dear ${user.firstName} ${user.lastName},</p>
          <p>Your account has been successfully created.</p>
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Role:</strong> ${user.role}</p>
          </div>
          <p>Please login to access the system.</p>
          <p>If you have any questions, please contact the administrator.</p>
          <hr style="border: 1px solid #e2e8f0; margin: 30px 0;">
          <p style="color: #718096; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);
        logger.info(`Welcome email sent to ${user.email}`);
    } catch (error) {
        logger.error(`Email Error: ${error.message}`);
    }
};

// Send attendance notification
exports.sendAttendanceNotification = async (student, date, status) => {
    try {
        const mailOptions = {
            from: `School MIS <${process.env.EMAIL_USER}>`,
            to: student.user.email,
            subject: `Attendance Update - ${date}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a5568;">Attendance Notification</h2>
          <p>Dear Parent/Guardian,</p>
          <p>This is to inform you about the attendance status:</p>
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Student:</strong> ${student.user.firstName} ${student.user.lastName}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Status:</strong> <span style="color: ${status === 'Present' ? '#48bb78' : '#f56565'};">${status}</span></p>
          </div>
          <p>For any queries, please contact the school.</p>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);
        logger.info(`Attendance notification sent for student ${student._id}`);
    } catch (error) {
        logger.error(`Email Error: ${error.message}`);
    }
};

// Send fee reminder
exports.sendFeeReminder = async (student, fee) => {
    try {
        const mailOptions = {
            from: `School MIS <${process.env.EMAIL_USER}>`,
            to: student.user.email,
            subject: 'Fee Payment Reminder',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a5568;">Fee Payment Reminder</h2>
          <p>Dear Parent/Guardian,</p>
          <p>This is a reminder about the pending fee payment:</p>
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Student:</strong> ${student.user.firstName} ${student.user.lastName}</p>
            <p><strong>Total Amount:</strong> $${fee.totalAmount}</p>
            <p><strong>Paid Amount:</strong> $${fee.paidAmount}</p>
            <p><strong>Pending Amount:</strong> $${fee.totalAmount - fee.paidAmount}</p>
            <p><strong>Due Date:</strong> ${fee.dueDate}</p>
          </div>
          <p>Please make the payment at your earliest convenience.</p>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);
        logger.info(`Fee reminder sent for student ${student._id}`);
    } catch (error) {
        logger.error(`Email Error: ${error.message}`);
    }
};

// Send exam notification
exports.sendExamNotification = async (students, exam) => {
    try {
        const emailPromises = students.map(student => {
            const mailOptions = {
                from: `School MIS <${process.env.EMAIL_USER}>`,
                to: student.user.email,
                subject: `Exam Notification - ${exam.name}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a5568;">Exam Notification</h2>
            <p>Dear Student/Parent,</p>
            <p>This is to inform you about the upcoming exam:</p>
            <div style="background-color: #f7fafc; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Exam:</strong> ${exam.name}</p>
              <p><strong>Type:</strong> ${exam.type}</p>
              <p><strong>Start Date:</strong> ${exam.startDate}</p>
              <p><strong>End Date:</strong> ${exam.endDate}</p>
            </div>
            <p>Please prepare accordingly and be on time.</p>
          </div>
        `
            };
            return transporter.sendMail(mailOptions);
        });

        await Promise.all(emailPromises);
        logger.info(`Exam notifications sent for ${exam.name}`);
    } catch (error) {
        logger.error(`Email Error: ${error.message}`);
    }
};

// Send result notification
exports.sendResultNotification = async (student, exam) => {
    try {
        const mailOptions = {
            from: `School MIS <${process.env.EMAIL_USER}>`,
            to: student.user.email,
            subject: `Results Published - ${exam.name}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a5568;">Results Published</h2>
          <p>Dear Student/Parent,</p>
          <p>Results for ${exam.name} have been published.</p>
          <p>Please login to the system to view your detailed results.</p>
          <a href="${process.env.FRONTEND_URL}/results" 
             style="display: inline-block; background-color: #4299e1; color: white; padding: 10px 20px; 
                    text-decoration: none; border-radius: 5px; margin: 20px 0;">
            View Results
          </a>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);
        logger.info(`Result notification sent for student ${student._id}`);
    } catch (error) {
        logger.error(`Email Error: ${error.message}`);
    }
};
