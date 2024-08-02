const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["admin", "client"],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
  },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = { UserModel };
