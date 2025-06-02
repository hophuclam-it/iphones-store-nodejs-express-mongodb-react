const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phone: String,
  address: {
    street: String,
    city: String,
    zip: String,
    country: String
  },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

//id user ảo để truy xuất
userSchema.virtual('id').get(function () {
  return this._id.toHexString()
});

userSchema.set('toJSON', {
  virtuals: true,
});


//xuất ra module export để gọi
module.exports = mongoose.model('User', userSchema);
