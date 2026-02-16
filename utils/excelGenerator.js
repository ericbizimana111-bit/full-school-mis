const ExcelJS = require('exceljs');
const path = require('path');
const logger = require('./logger');

// Generate attendance report
exports.generateAttendanceReport = async (attendanceData, dateRange) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance Report');

    // Add title
    worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').value = 'Attendance Report';
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // Add date range
    worksheet.mergeCells('A2:F2');
    worksheet.getCell('A2').value = `Period: ${dateRange.start} to ${dateRange.end}`;
    worksheet.getCell('A2').alignment = { horizontal: 'center' };

    // Add headers
    worksheet.addRow([]);
    const headerRow = worksheet.addRow([
      'Student Name',
      'Admission Number',
      'Total Days',
      'Present',
      'Absent',
      'Percentage'
    ]);
    
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };

    // Add data
    attendanceData.forEach(record => {
      worksheet.addRow([
        record.name,
        record.admissionNumber,
        record.totalDays,
        record.present,
        record.absent,
        `${record.percentage.toFixed(2)}%`
      ]);
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = 20;
    });

    // Save file
    const fileName = `attendance_report_${Date.now()}.xlsx`;
    const filePath = path.join(__dirname, '../uploads/reports', fileName);
    await workbook.xlsx.writeFile(filePath);

    logger.info(`Attendance report generated: ${fileName}`);
    return filePath;
  } catch (error) {
    logger.error(`Excel Generation Error: ${error.message}`);
    throw error;
  }
};

// Generate fee report
exports.generateFeeReport = async (feeData, academicYear) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Fee Report');

    // Add title
    worksheet.mergeCells('A1:G1');
    worksheet.getCell('A1').value = `Fee Report - ${academicYear}`;
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // Add headers
    worksheet.addRow([]);
    const headerRow = worksheet.addRow([
      'Student Name',
      'Admission Number',
      'Total Fee',
      'Paid',
      'Pending',
      'Status',
      'Due Date'
    ]);
    
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };

    // Add data
    feeData.forEach(record => {
      const row = worksheet.addRow([
        record.studentName,
        record.admissionNumber,
        record.totalAmount,
        record.paidAmount,
        record.totalAmount - record.paidAmount,
        record.status,
        record.dueDate
      ]);

      // Color code based on status
      if (record.status === 'Overdue') {
        row.getCell(6).font = { color: { argb: 'FFFF0000' } };
      } else if (record.status === 'Paid') {
        row.getCell(6).font = { color: { argb: 'FF00FF00' } };
      }
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = 20;
    });

    // Save file
    const fileName = `fee_report_${academicYear}_${Date.now()}.xlsx`;
    const filePath = path.join(__dirname, '../uploads/reports', fileName);
    await workbook.xlsx.writeFile(filePath);

    logger.info(`Fee report generated: ${fileName}`);
    return filePath;
  } catch (error) {
    logger.error(`Excel Generation Error: ${error.message}`);
    throw error;
  }
};

// Generate grade sheet
exports.generateGradeSheet = async (gradesData, exam) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Grade Sheet');

    // Add title
    worksheet.mergeCells('A1:E1');
    worksheet.getCell('A1').value = `Grade Sheet - ${exam.name}`;
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // Add headers
    worksheet.addRow([]);
    const headerRow = worksheet.addRow([
      'Student Name',
      'Admission Number',
      'Subject',
      'Marks',
      'Grade'
    ]);
    
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };

    // Add data
    gradesData.forEach(record => {
      worksheet.addRow([
        record.studentName,
        record.admissionNumber,
        record.subjectName,
        `${record.obtained}/${record.total}`,
        record.grade
      ]);
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = 20;
    });

    // Save file
    const fileName = `gradesheet_${exam.name}_${Date.now()}.xlsx`;
    const filePath = path.join(__dirname, '../uploads/reports', fileName);
    await workbook.xlsx.writeFile(filePath);

    logger.info(`Grade sheet generated: ${fileName}`);
    return filePath;
  } catch (error) {
    logger.error(`Excel Generation Error: ${error.message}`);
    throw error;
  }
};