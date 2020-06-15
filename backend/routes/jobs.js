const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Job } = require("../models/job");
const { User } = require("../models/user");
const cvbankas = require("../cvbankas");
const cvonline = require("../cvonline");
const cvmarket = require("../cvmarket");
const auth = require("../middleware/auth");

router.get("/:id", (req, res, next) => {

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date();

    Job.find({
        dateScrapped: {
            $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
            $lt: new Date(new Date(endDate).setHours(23, 59, 59))
        },
        keyword: req.params.id
    })
        .then(rez => res.send(rez))
        .catch(err => next(err))
});

router.get("/auth/:id", auth, async (req, res, next) => {

    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    try {
        const user = await User.findOne({ _id: req.user._id });
        if (!user) return res.status(404).send("No user with the given id found");
        Job.find({
            dateScrapped: {
                $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
                $lt: new Date(new Date(endDate).setHours(23, 59, 59))
            },
            keyword: req.params.id
        })

        const userPostsIds = user.favorites.map(item => item._id);

        jobs.map(item => {
            if (userPostsIds.includes(item._id)) {
                item.liked = true;
            }
            return item
        });
        res.send(job);

    } catch (err) {
        next(err)
    }
});

router.post("/", async (req, res, next) => {
    try {
        (async (keyword) => {

            await cvbankas.initialize(keyword);
            const cvbankasResults = await cvbankas.getResults(keyword);

            await cvonline.initialize(keyword);
            const cvonlineResults = await cvonline.getResults(keyword);

            await cvmarket.initialize(keyword);
            const cvmarketResults = await cvmarket.getResults(keyword);

            const results = [...cvbankasResults, ...cvonlineResults, ...cvmarketResults]

            const jobsCount = await Job.countDocuments()

            if (jobsCount === 0) {
                Job.collection.insertMany(results);
                res.send("succes");
            } else {
                const jobs = await Job.find();
                //get all results urls
                const resultsUrls = results.map(item => item.jobUrl);
                // filter jobs array that matches the search keyword and find their urls

                let filteredJobs = [];
                let jobsUrls;

                jobs.map(item => {
                    if (item.keyword === req.body.keyword) {
                        filteredJobs.push(item)
                    }
                });

                filteredJobs.length === 0?jobsUrls = jobs.map(item => item.jobUrl):jobsUrls = filteredJobs.map(item => item.jobUrl)

                // filter all duplicating urls from results
                let filteredResultsUrls = resultsUrls.filter(url => !jobsUrls.includes(url));

                const filteredResults = results.filter(item => {
                    return filteredResultsUrls.indexOf(item.jobUrl) !== -1
                });

                // put filtered results into jobs docs
                Job.insertMany(filteredResults);
                res.send("succes");
            }
        })(req.body.keyword);
    } catch (err) {
        next(err)
    }
});

module.exports = router