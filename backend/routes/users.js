const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const {User, validate} = require("../models/user");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

mongoose.set('useFindAndModify', false);

router.get("/me", auth, (req,res,next) => {
    try {
        User.findById(req.user._id)
        .then(rez => {
            res.send(rez)
        })
    } catch (err) {
        next(err)
    }
});

router.post("/signup", async (req, res,next) => {
    try {
        const isValid = validate(req.body);
        if (isValid.error) {
            res.status(400).send(isValid.error.details[0].message);
                return;
    }

    let user = await User.findOne({email: req.body.email});
        if (user) return res.status(400).send("User already exists");

        if(req.body.password !=req.body.password2) return res.status(400).send("Password doesn't match")

    user = new User({
        email: req.body.email,
        password: req.body.password,
        password2: req.body.password2
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);

    await user.save();
    const token = jwt.sign({_id:user._id, email: user.email, isAdmin:user.isAdmin}, config.get("jwtPrivateKey"));
    res.send(token);
    } catch (err) {
        next(err)
    }
});

module.exports = router;