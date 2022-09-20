// Empty JS object to act as endpoint for all routes
let projectData = {};

// Express to run server and routes
import express from "express";

// Start up an instance of app
const app = express();

/* Middleware */
// Here we are configuring express to use body-parser as middle-ware.
import bodyParser from "body-parser";
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
import cors from "cors";
app.use(cors());

// Initialize the main project folder
app.use(express.static(`public`));

// Setup Server
const port = 8000;
app.listen(port, () => {
  console.log(`the server is running on localhost http://localhost:${port}`);
});

// the get route
app.get(`/getWeatherData`, (req, res) => {
  res.json(projectData);
});

// the post route
app.post(`/addWeatherData`, (req, res) => {
  projectData = req.body;
});
