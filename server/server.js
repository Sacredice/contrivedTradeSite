require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const corsOptions = require('./config/corsOprions')
const cookieParser = require("cookie-parser");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const  { randomIntervals, setNewMaterialDoc, keepServerUp } = require("./utilities/randomIntervals");
const app = express();
const PORT = process.env.PORT || 3500;


randomIntervals("gold");
randomIntervals("uranium");
randomIntervals("ripCoin");
randomIntervals("tibCoin");
randomIntervals("diamond");
randomIntervals("plutonium");
keepServerUp();



// Connect to MongoDB
connectDB();

// logger middleware
app.use(logger);

// Cross Origin Resource Sharing
// app.use(cors({ credentials: true, origin: true }));
app.use(cors(corsOptions));

// Static files
app.use("/", express.static(path.join(__dirname, "public")));

// built-in middleware to handle urlencoded data i.e. form data: 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// Routes
app.use("/ping", require("./routes/api/ping"));
app.use("/register", require("./routes/api/register"));
app.use("/refresh", require("./routes/api/refresh"));
app.use("/logout", require("./routes/api/logout"));
app.use("/login", require("./routes/api/login"));

app.use(verifyJWT);
app.use("/", require("./routes/api/user"));




app.use(errorHandler);

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});