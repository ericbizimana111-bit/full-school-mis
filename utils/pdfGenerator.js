const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');

// Generate receipt PDF
exports.generateReceipt = async (payment) => {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const { width, height } = page.getSize();
    
    // Title
    page.drawText('PAYMENT RECEIPT', {
      x: 50,
      y: height - 50,
      size: 20,
      font: boldFont,
      color: rgb(0, 0, 0)
    });

    // Receipt details
    const details = [
      `Receipt Number: ${payment.receiptNumber}`,
      `Date: ${new Date(payment.paymentDate).toLocaleDateString()}`,
      `Amount: $${payment.amount}`,
      `Payment Method: ${payment.paymentMethod}`,
      `Transaction ID: ${payment.transactionId || 'N/A'}`
    ];

    let yPosition = height - 100;
    details.forEach(detail => {
      page.drawText(detail, {
        x: 50,
        y: yPosition,
        size: 12,
        font: font,
        color: rgb(0, 0, 0)
      });
      yPosition -= 25;
    });

    // Footer
    page.drawText('Thank you for your payment!', {
      x: 50,
      y: 50,
      size: 10,
      font: font,
      color: rgb(0.5, 0.5, 0.5)
    });

    const pdfBytes = await pdfDoc.save();
    
    // Save to file
    const fileName = `receipt_${payment.receiptNumber}.pdf`;
    const filePath = path.join(__dirname, '../uploads/receipts', fileName);
    await fs.writeFile(filePath, pdfBytes);

    logger.info(`Receipt PDF generated: ${fileName}`);
    return filePath;
  } catch (error) {
    logger.error(`PDF Generation Error: ${error.message}`);
    throw error;
  }
};

// Generate report card PDF
exports.generateReportCard = async (student, exam, grades, overall) => {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const { width, height } = page.getSize();
    
    // Header
    page.drawText('REPORT CARD', {
      x: width / 2 - 60,
      y: height - 50,
      size: 24,
      font: boldFont,
      color: rgb(0, 0, 0)
    });

    // Student details
    let yPos = height - 100;
    const studentDetails = [
      `Name: ${student.user.firstName} ${student.user.lastName}`,
      `Admission Number: ${student.admissionNumber}`,
      `Class: ${student.class.name}`,
      `Exam: ${exam.name} (${exam.type})`
    ];

    studentDetails.forEach(detail => {
      page.drawText(detail, {
        x: 50,
        y: yPos,
        size: 12,
        font: font
      });
      yPos -= 25;
    });

    // Grades table header
    yPos -= 30;
    page.drawText('Subject', { x: 50, y: yPos, size: 12, font: boldFont });
    page.drawText('Marks', { x: 250, y: yPos, size: 12, font: boldFont });
    page.drawText('Grade', { x: 350, y: yPos, size: 12, font: boldFont });
    
    yPos -= 20;
    
    // Draw line
    page.drawLine({
      start: { x: 50, y: yPos },
      end: { x: width - 50, y: yPos },
      thickness: 1,
      color: rgb(0, 0, 0)
    });

    yPos -= 20;

    // Grades
    grades.forEach(grade => {
      page.drawText(grade.subject.name, {
        x: 50,
        y: yPos,
        size: 11,
        font: font
      });
      page.drawText(`${grade.marks.obtained}/${grade.marks.total}`, {
        x: 250,
        y: yPos,
        size: 11,
        font: font
      });
      page.drawText(grade.grade, {
        x: 350,
        y: yPos,
        size: 11,
        font: font
      });
      yPos -= 20;
    });

    // Overall performance
    yPos -= 30;
    page.drawText('Overall Performance', {
      x: 50,
      y: yPos,
      size: 14,
      font: boldFont
    });
    yPos -= 25;
    
    const overallDetails = [
      `Total Marks: ${overall.obtainedMarks}/${overall.totalMarks}`,
      `Percentage: ${overall.percentage}%`,
      `Grade: ${overall.grade}`
    ];

    overallDetails.forEach(detail => {
      page.drawText(detail, {
        x: 50,
        y: yPos,
        size: 12,
        font: font
      });
      yPos -= 20;
    });

    const pdfBytes = await pdfDoc.save();
    
    // Save to file
    const fileName = `reportcard_${student.admissionNumber}_${exam._id}.pdf`;
    const filePath = path.join(__dirname, '../uploads/reports', fileName);
    await fs.writeFile(filePath, pdfBytes);

    logger.info(`Report card PDF generated: ${fileName}`);
    return filePath;
  } catch (error) {
    logger.error(`PDF Generation Error: ${error.message}`);
    throw error;
  }
};
