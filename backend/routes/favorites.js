const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const { Job } = require("../models/job");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        if (!user) return res.status(401).send("No user with the given id found");
        res.send(user.favorites)
    } catch (err) {
        next(err)
    }
});

router.post("/like", auth, async (req, res, next) => {

    try {
        const user = await User.findOne({ _id: req.user._id });
        if (!user) return res.status(404).send("No user with the given id found");

        const job = await Job.findById(req.body.id);
        if (!job) return res.status(404).send("No job post with the given id found");

        // let user = await User.findById(req.body.userId);
        // if (!user) return res.status(401).send("No user with the given id found");

        const userPosts = user.favorites.map(item => item._id);
        const postIndex = userPosts.findIndex(id => id.toString() === req.body.id.toString());

        if (postIndex > -1) {
            res.send("post is already liked");
        } else {
            job.liked = true;
            user.favorites.push(job);
            await user.save();
            res.send(user);
        }
    } catch (err) {
        next(err)
    }
});

router.delete("/unlike/:id", auth, async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        if (!user) return res.status(404).send("No user with the given id found");

        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).send("No job post with the given id found");
        const userPosts = user.favorites.map(item => item._id);
        const postIndex = userPosts.findIndex(id => id.toString() === req.params.id.toString());

        if (postIndex > -1) {
            user.favorites.splice(postIndex, 1);
            await user.save();
            res.send(user);
        } else {
            res.send("post already deleted");
        }
    } catch (err) {
        next(err)
    }
});

module.exports = router;