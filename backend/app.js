const express = require("express")
const app = express();
const cookieParser = require("cookie-parser");

// using middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Load environment variables from project root .env
require("dotenv").config();

const post = require("./routes/post");
const user = require("./routes/user");

//importing routes
app.use("/api/v1", post);
app.use("/api/v1", user);


module.exports = app;