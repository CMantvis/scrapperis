const mongoose = require("mongoose");
const Joi = require('@hapi/joi');
const {jobSchema} = require("./job")

const userSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true,
        minlength:6,
        maxlength:255
    },
    email: {
        type: String,
        required: true,
        minlength:6,
        maxlength:255,
        unique: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    favorites: [jobSchema],
  });

  const User = mongoose.model("user", userSchema)

  function validateUser(user) {
    const schema = Joi.object({
      email: Joi.string().min(6).max(255).email(),
      password: Joi.string().min(6).max(255),
      password2: Joi.string().min(6).max(255)
    });
  
    return schema.validate(user);
  }
  
  exports.User = User; 
  exports.validate = validateUser;