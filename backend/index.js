const express = require("express");
const app = express();
const {connectMongo, populateDb} = require("./db")
const jobs = require("./routes/jobs");
const users = require("./routes/users");
const auth = require("./routes/auth");
const home = require("./routes/home");
const favorites = require("./routes/favorites");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const config = require("config")

if (!config.get("jwtPrivateKey")) {
    console.log("JWT KEY NOT DEFINED");
    process.exit(1);
}

connectMongo();

app.use(helmet());
app.use(compression())
app.use(cors());
app.use(express.json());
app.use("/", home);
app.use("/api/jobs", jobs);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/favorites", favorites);

app.use(function(err,req,res,next) {
    console.log(err);
    res.status(500).send("Something failed");
});

const port = process.env.PORT || config.get("port");
app.listen(port, () => {console.log(`Listening on port ${port}...`)});
