// This is the 2nd file which is loaded
const express = require("express")
// create our express app
const app = express()
const morgan = require("morgan");
require("dotenv").config();
require("./learn_cron");

// const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const db = require("./api/config/db")


mongoose.Promise = global.Promise;

// middleware
app.use(morgan("dev"));  // used to log which api-request recently called .
// Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option .
// app.use(bodyParser.json());
// Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option. This parser accepts only UTF-8 encoding of the body. 
// app.use(bodyParser.urlencoded({ extended: true }));

// use this instead of body-parser package as middleware Body parser, reading data from body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serving static files
app.use("/uploads", express.static("uploads"));
// app.use(express.static(path.join(__dirname, 'public')));

// route
const Routing = require("./api/routes/routing");
const restaurantRoutes = require("./api/routes/restaurant");
const productRoutes = require("./api/routes/dailyproducts");
const adminRoutes = require("./api/routes/admin");
const newRestro = require('./api/routes/newRestaurant');
const studentRoutes = require("./api/routes/students");
const encdecRoutes = require('./api/routes/encdec');

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
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/restro', newRestro);
app.use('/api/student', studentRoutes);
app.use('/api/encdec', encdecRoutes);

module.exports = app;