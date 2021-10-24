// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require("express");

// Start up an instance of app
const app = express();
const bodyParser = require("body-parser")
const cors = require("cors")
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

// Cors for cross origin allowance

// Initialize the main project folder
app.use(express.static("website"));

// Setup Server
const port = 4000;
function listening() {
    console.log("hello"+port)
}
const server = app.listen(port, listening());
