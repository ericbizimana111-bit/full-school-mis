
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, './uploads/'); },
    filename: function (req,
        file, cb) {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)} `;
        cb(null, uniqueName);
    }
});
// Filefilter 
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only JPEG, PNG, PDF, DOC,DOCX, XLS, and XLSX files are allowed.'));
    }
};
// Configure upload 
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: fileFilter
});


module.exports = upload;

