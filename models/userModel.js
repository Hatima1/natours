const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'must have '],
  },
  email: {
    type: String,
    require: [true, 'must have '],
    unique: true,
    lowercase: true,
    validator: [validator.isEmail, 'please enter valid email'],
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guied', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    require: [true, 'must have '],
    minlength: 8,
    select: false,
  },
  photo: String,
  passwordConfirm: {
    type: String,
    require: [true, 'must have '],
    validate: {
      validator: function (el) {
        //only work in save and create
        return el === this.password;
      },
      message: 'the password are not same',
    },
  },
  PasswordChangeAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candicatePassword,
  userPassword
) {
  return await bcrypt.compare(candicatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (jetImestamp) {
  if (this.PasswordChangeAt) {
    const CangedTimesStamp = +this.PasswordChangeAt.getTime() / 1000;
    // console.log(CangedTimesStamp, jetImestamp);
    // console.log(CangedTimesStamp > jetImestamp);
    return CangedTimesStamp > jetImestamp;
  }
  // console.log('test');

  return false;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
