const mongoose = require("mongoose");

const userLogin = new mongoose.Schema(
  {
    name:{type:String},
    email: { type: String, required: true},
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserLogin", userLogin);