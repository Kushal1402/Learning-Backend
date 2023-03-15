// This is the 2nd file which is loaded
const express = require("express")
const bodyParser = require("body-parser")
const fs = require('fs');

// create our express app
const app = express()

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// route
const Routing = require("./api/routes/routing")
const restaurantRoutes = require("./api/routes/restaurant");

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");

    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE");
        return res.status(200).json({});
    }
    next();
});

app.use("/api", Routing);
app.use("/api/restaurant", restaurantRoutes);

module.exports = app;