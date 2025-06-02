// const removeVietnameseTones = (str) => {
//     return str
//       .normalize('NFD') // Tách các ký tự có dấu thành ký tự cơ bản và dấu
//       .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
//       .replace(/đ/g, 'd') // Chuyển đổi ký tự đặc biệt "đ"
//       .replace(/Đ/g, 'D') // Chuyển đổi ký tự đặc biệt "Đ"
//       .replace(/[^a-zA-Z0-9\s-]/g, '') // Loại bỏ các ký tự không hợp lệ
//       .trim() // Loại bỏ khoảng trắng thừa
//       .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
//       .toLowerCase(); // Chuyển thành chữ thường
//   };

// module.exports = removeVietnameseTones;

const removeVietnameseTones = (str) => {
    return str
      .normalize('NFD') // Tách các ký tự có dấu thành ký tự cơ bản và dấu
      .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
      .replace(/đ/g, 'd') // Chuyển đổi ký tự đặc biệt "đ"
      .replace(/Đ/g, 'D') // Chuyển đổi ký tự đặc biệt "Đ")
      .replace(/[^a-zA-Z0-9\s-]/g, '') // Loại bỏ các ký tự không hợp lệ
      .trim() // Loại bỏ khoảng trắng thừa
      .replace(/\s+/g, '-'); // Thay khoảng trắng bằng dấu gạch ngang
  };
  
  module.exports = removeVietnameseTones;