const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    // required: true,
  },
  password: {
    type: String,
    // required: true,
  },
  address: {
    type: String,
    unique: true,
  },
  privateKey: {
    type: String,
  },
  receivedToken: {
    type: Number,
    default: 0,
  },
  expectedToken: {
    type: Number,
    default: 0,
  },
  NFTPossessed: { type: [Number] },
});

userSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.password = hash;
};

userSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

userSchema.methods.hidePw = function () {
  const data = this.toJSON();
  delete data.password;
  return data;
};

userSchema.methods.generateToken = function () {
  const token = jwt.sign(
    { _id: this.id, username: this.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
  return token;
};

userSchema.statics.findByUsername = function (username) {
  return this.findOne({ username });
};

module.exports = mongoose.model("User", userSchema);
