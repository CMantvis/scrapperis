const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
    },
    jobUrl: {
        type: String,
    },
    city: {
        type: String,
    },
    salaryAmount: {
        type: String,
    },
    postDate: {
        type: String,
    },
    companyName: {
        type: String,
    },
    keyword: {
        type: String
    },
    searchedSite: {
        type: String
    },
    liked: {
        type: Boolean,
    },
    dateScrapped: {
        type: Date,
        required: true,
    }
});

const Job = mongoose.model("job", jobSchema);

exports.Job = Job;
exports.jobSchema = jobSchema;