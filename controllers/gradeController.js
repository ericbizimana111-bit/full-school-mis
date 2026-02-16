const Grade = require('../models/Grade'); const
    Student = require('../models/Student'); const Exam = require('../models/Exam'); const logger =
        require('../utils/logger'); // @desc Add grade // @route POST /api/grades // @access Private/Teacher
exports.addGrade =
    async (req, res, next) => {
        try {
            const grade = await Grade.create({ ...req.body, gradedBy: req.user.id }); const
                populatedGrade = await Grade.findById(grade._id).populate('student').populate({
                    path: 'student', populate: {
                        path:
                            'user', select: 'firstName lastName'
                    }
                }).populate('exam', 'name type').populate('subject', 'name');
            res.status(201).json({ success: true, data: populatedGrade });
        } catch (error) {
            logger.error(`Add Grade Error: ${error.message
                } `); next(error);
        }
    }; // @desc Update grade // @route PUT /api/grades/:id // @access Private/Teacher
exports.updateGrade = async (req, res, next) => {
    try {
        let grade = await Grade.findById(req.params.id); if (!grade) {
            return res.status(404).json({ success: false, message: 'Grade not found' });
        } grade = await
            Grade.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('student')
                .populate('exam').populate('subject'); res.status(200).json({ success: true, data: grade });
    } catch (error) {
        next(error);
    }
}; // @desc Get grades by exam // @route GET /api/grades/exam/:examId // @access Private
exports.getGradesByExam = async (req, res, next) => {
    try {
        const grades = await Grade.find({ exam: req.params.examId })
            .populate('student').populate({ path: 'student', populate: { path: 'user', select: 'firstName lastName' } })
            .populate('subject', 'name code').sort({ 'marks.obtained': -1 }); res.status(200).json({
                success: true, count:
                    grades.length, data: grades
            });
    } catch (error) { next(error); }
}; // @desc Get report card // @route GET/api/grades / report /: studentId /:examId      
// 

// @access Private 
exports.getReportCard = async (req, res, next) => {
    try {
        const { studentId, examId } = req.params;
        const grades = await Grade.find({ student: studentId, exam: examId })
            .populate('subject', 'name code').populate('exam', 'name type'); if (grades.length === 0) {
                return res.status(404).json({ success: false, message: 'No grades found for this student and exam' });
            } // Calculate overallstatistics 
        const totalMarks = grades.reduce((sum, g) => sum + g.marks.total, 0);
        const obtainedMarks = grades.reduce((sum, g) => sum + g.marks.obtained, 0);
        const percentage = ((obtainedMarks / totalMarks) * 100).toFixed(2); // Determine overall grade let overallGrade; 
        if (percentage >= 90) overallGrade = 'A+';
        else if (percentage >= 80) overallGrade = 'A'; else if (percentage >= 70) overallGrade = 'B+'; else if (percentage >= 60)
            overallGrade = 'B'; else if (percentage >= 50) overallGrade = 'C+'; else if (percentage >= 40) overallGrade = 'C'; else
                if (percentage >= 33) overallGrade = 'D'; else overallGrade = 'F'; const student = await
                    Student.findById(studentId).populate('user', 'firstName lastName'); res.status(200).json({
                        success: true, data: {
                            student, exam: grades[0].exam, subjects: grades, overall: { totalMarks, obtainedMarks, percentage, grade: overallGrade }
                        }
                    });
    } catch (error) { next(error); }
};