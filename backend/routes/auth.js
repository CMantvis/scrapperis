const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const config = require("config");
const { User } = require("../models/user");

mongoose.set('useFindAndModify', false);

router.post("/login", async (req, res, next) => {
    try {
        const isValid = validate(req.body);
        if (isValid.error) return res.status(400).send(isValid.error.details[0].message);

        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("Invalid email or password");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send("Invalid email or password");

        const token = jwt.sign({ _id: user._id, email: user.email, isAdmin: user.isAdmin }, config.get("jwtPrivateKey"));
        
        res.header("x-auth-token", token).header("access-control-expose-headers", "x-auth-token").send("logged")
    } catch (err) {
        next(err)
    }
});


function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(6).max(255).email(),
        password: Joi.string().min(6).max(255)
    });
    return schema.validate(req);
};

module.exports = router