// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const router = express.Router();

// // Kiểm tra và tạo thư mục `uploads/` nếu chưa tồn tại
// const uploadDir = path.join(__dirname, '..', 'uploads');
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// // // Cấu hình Multer để lưu file vào thư mục `uploads/` với tên gốc
// // const storage = multer.diskStorage({
// //     destination: (req, file, cb) => {
// //         cb(null, uploadDir); // Lưu file vào thư mục `uploads/`
// //     },
// //     filename: (req, file, cb) => {
// //         const uniqueSuffix = `${file.originalname}`;
// //         cb(null, uniqueSuffix); // Đặt tên file với timestamp để tránh trùng lặp
// //     }
// // });

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir); // Lưu file vào thư mục `uploads/`
//     },
//     filename: (req, file, cb) => {
//         // Lấy ngày hiện tại ở định dạng ddmmyyyy
//         const now = new Date();
//         const day = String(now.getDate()).padStart(2, '0'); // Lấy ngày (dd)
//         const month = String(now.getMonth() + 1).padStart(2, '0'); // Lấy tháng (mm)
//         const year = now.getFullYear(); // Lấy năm (yyyy)
//         const formattedDate = `${day}${month}${year}`; // Kết hợp thành ddmmyyyy

//         // Tạo tên file với định dạng ddmmyyyy-originnamefile
//         const uniqueSuffix = `${formattedDate}-${file.originalname}`;
//         cb(null, uniqueSuffix); // Đặt tên file
//     }
// });


// // Kiểm tra loại file (chỉ cho phép ảnh)
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//     if (!allowedTypes.includes(file.mimetype)) {
//         return cb(new Error('Chỉ cho phép tải lên file ảnh (JPEG, PNG, GIF).'));
//     }
//     cb(null, true);
// };

// // Cấu hình Multer
// const upload = multer({
//     storage,
//     fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn kích thước file: 5MB
// });

// // API Upload ảnh
// router.post('/', upload.single('file'), (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: 'Không có file nào được tải lên.' });
//         }

//         const fileUrl = `/uploads/${req.file.filename}`; // URL truy cập ảnh

//         res.json({
//             message: 'Tải lên thành công.',
//             url: fileUrl // Trả về URL của ảnh đã tải lên
//         });
//     } catch (err) {
//         console.error('Lỗi khi tải lên file:', err.message);
//         res.status(500).json({ message: 'Lỗi server', error: err.message });
//     }
// });

// // API Upload nhiều ảnh
// router.post('/multiple', upload.array('files', 10), (req, res) => {
//     try {
//         if (!req.files || req.files.length === 0) {
//             return res.status(400).json({ message: 'Không có file nào được tải lên.' });
//         }

//         const fileUrls = req.files.map(file => `/uploads/${file.filename}`); // URL truy cập ảnh

//         res.json({
//             message: 'Tải lên thành công.',
//             urls: fileUrls // Trả về URL của ảnh đã tải lên
//         });
//     } catch (err) {
//         console.error('Lỗi khi tải lên file:', err.message);
//         res.status(500).json({ message: 'Lỗi server', error: err.message });
//     }
// });


// // API Lấy danh sách ảnh đã tải lên
// router.get('/', (req, res) => {
//     fs.readdir(uploadDir, (err, files) => {
//         if (err) {
//             return res.status(500).json({ message: 'Lỗi đọc thư mục ảnh' });
//         }

//         const images = files.map(file => ({
//             url: `/uploads/${file}`,
//             filename: file
//         }));

//         res.json(images);
//     });
// });


// // API Xóa ảnh
// router.delete('/:filename', (req, res) => {
//     const filePath = path.join(uploadDir, req.params.filename);

//     fs.unlink(filePath, (err) => {
//         if (err) {
//             return res.status(500).json({ message: 'Lỗi khi xóa file', error: err.message });
//         }

//         res.json({ message: 'Xóa file thành công.' });
//     });
// });



// module.exports = router;



const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const { singleUpload, multiUpload, uploadDir } = require('../middlewares/upload');

// Upload 1 ảnh
router.post('/', singleUpload, (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Không có file nào được tải lên.' });
        }
        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({ message: 'Tải lên thành công.', url: fileUrl });
    } catch (err) {
        console.error('Lỗi khi tải lên file:', err.message);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
});

// Upload nhiều ảnh
router.post('/multiple', multiUpload, (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Không có file nào được tải lên.' });
        }
        const fileUrls = req.files.map(file => `/uploads/${file.filename}`);
        res.json({ message: 'Tải lên thành công.', urls: fileUrls });
    } catch (err) {
        console.error('Lỗi khi tải lên file:', err.message);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
});

// // Danh sách ảnh đã upload
// router.get('/', (req, res) => {
//     fs.readdir(uploadDir, (err, files) => {
//         if (err) {
//             return res.status(500).json({ message: 'Lỗi đọc thư mục ảnh' });
//         }

//         const images = files.map(file => ({
//             url: `/uploads/${file}`,
//             filename: file
//         }));
//         res.json(images);
//     });
// });

router.get('/', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Lỗi đọc thư mục ảnh' });
        }

        // Lấy thông tin stat cho từng file để lấy thời gian tạo
        const images = files.map(file => {
            const filePath = path.join(uploadDir, file);
            const stat = fs.statSync(filePath); // Đồng bộ để đơn giản, hoặc dùng Promise.all nếu muốn bất đồng bộ

            return {
                url: `/uploads/${file}`,
                filename: file,
                createdAt: stat.birthtime // hoặc stat.ctime tùy OS
            };
        });

        // Sắp xếp từ mới nhất đến cũ nhất
        images.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(images);
    });
});



// Xóa ảnh
router.delete('/:filename', (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename);
    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Lỗi khi xóa file', error: err.message });
        }
        res.json({ message: 'Xóa file thành công.' });
    });
});

module.exports = router;
