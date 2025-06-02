// // middlewares/upload.js
// const multer = require('multer');
// const path = require('path');

// // Cấu hình đích và định dạng tên file
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/uploads/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   }
// });

// const upload = multer({ storage });

// // Export cấu hình upload đơn và nhiều file
// module.exports = {
//   singleUpload: upload.single('image'),
//   multiUpload: upload.fields([
//     { name: 'image', maxCount: 1 },
//     { name: 'imagesMulti', maxCount: 10 },
//     { name: 'variantImages', maxCount: 100 }

//   ])
// };


// middlewares/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục uploads nếu chưa tồn tại
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình lưu trữ
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const now = new Date();
        const formattedDate = `${String(now.getDate()).padStart(2, '0')}${String(now.getMonth() + 1).padStart(2, '0')}${now.getFullYear()}`;
        const uniqueName = `${formattedDate}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// Chỉ cho phép file ảnh
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Chỉ cho phép tải lên file ảnh (JPEG, PNG, GIF).'));
    }
    cb(null, true);
};

// Cấu hình multer
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Export middleware
module.exports = {
    singleUpload: upload.single('file'),
    multiUpload: upload.array('files', 10),
    uploadDir
};
