const mongoose = require("mongoose");
const {Job} = require("./models/job");
const config = require("config")

function connectMongo () {
    const db = config.get("db")
    mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
.then(() => console.log(`connected to mongoDb..`))
}

exports.connectMongo = connectMongo;
