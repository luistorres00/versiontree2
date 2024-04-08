// utils/utils.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/models");
const secret = require("../middleware/jwtSecrets");

const generateToken = (user_info, callback) => {
  let token = jwt.sign(
    {
      data: user_info,
    },
    secret,
    { expiresIn: "24h" }
  );
  return callback(token);
};

const validateToken = (token, callback) => {
  if (!token) {
    return callback(false, null);
  }
  jwt.verify(token.replace("Bearer ", ""), secret, function (error, decoded) {
    if (error) {
      return callback(false, null);
    }
    let loggedUser = decoded.data.user;
    User.findOne({ email: loggedUser })
      .then((user) => {
        if (user) {
          return callback(true, loggedUser);
        } else {
          return callback(false, null);
        }
      })
      .catch(() => {
        return callback(false, null);
      });
  });
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

module.exports = { generateToken, validateToken, hashPassword, secret };
