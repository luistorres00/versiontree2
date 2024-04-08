// models/userModel.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return value.length > 7;
      },
      message: "Please enter a longer password. At least 8 characters.",
    },
  },
  usertype: {
    type: String,
    //required: true,
  },
});

// Define o modelo User
const User = mongoose.model("User", userSchema);

module.exports = User;
