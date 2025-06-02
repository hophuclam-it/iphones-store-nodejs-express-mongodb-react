// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log(`MongoDB connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error('MongoDB connection failed:', error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;


//new
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Atlas connected');
    console.log('DB name:', mongoose.connection.name); // In tên DB
  } catch (err) {
    console.error('MongoDB Atlas connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
