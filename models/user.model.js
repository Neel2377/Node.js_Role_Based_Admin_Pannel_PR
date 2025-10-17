const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: 'employee', enum: ['employee', 'manager', 'admin'] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'userTbl' },
  age: { type: Number },
  address: { type: String },
  mobile: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] }


}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
})

const User = mongoose.model('userTbl', userSchema);

module.exports = User;