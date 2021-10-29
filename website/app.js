/* ----------------Global Variables---------------- */
// create the url
const apiKey = `&appid=ddc41e9557902b7fefb029830d71fe4d`;
const baseUrl = `http://api.openweathermap.org/data/2.5/weather?zip=`;

// Create a date instance dynamically with JS
const date = new Date().toDateString();

// the absolute url of the server
const server = "http://localhost:4000";

// the button to to display the weather info
const generateBtn = document.getElementById("generate");

// varibles to update the UI dynamiclly
const descriptionEl = document.getElementById("description");
const contentEl = document.getElementById("content");
const dateEl = document.getElementById("date");
const tempEl = document.getElementById("temp");
const cityEl = document.getElementById("city");

// the element where we will store the error message in
const errorEl = document.querySelector(".title");

// the info object for weatherData
const info = {};

generateBtn.addEventListener("click", () => {
  // get the user's feelings
  const feelings = document.getElementById("feelings").value.trim();

  // get the user's zipcode
  const zipCode = document.getElementById("zip").value.trim();

  // a funciotn to get the weather info from the API and send it to the server and get it back from the server and then update the UI with this info
  getWeatherInfo(zipCode, feelings).then((info) => {
    if (info) {
      // destructuring the object to get the data we want
      const {
        main: { temp },
        name: city,
        weather: [{ description }],
      } = info;

      // the data we want
      const data = {
        city,
        temp: Math.round(temp),
        description,
        feelings: feelings || `you didn't type your feelings`,
      };
      sendDataToTheServer(`${server}/addWeatherData`, data).then(updateUI());
    }
  });
});

const getWeatherInfo = async (zipCode) => {
  try {
    const respnose = await fetch(`${baseUrl}${zipCode}${apiKey}`);
    const info = await respnose.json();

    if (info.cod != 200) {
      errorEl.textContent = info.message;
      dateEl.textContent = ``;
      tempEl.textContent = ``;
      cityEl.textContent = ``;
      descriptionEl.textContent = ``;
      contentEl.textContent = ``;
      throw `${info.message}`;
    }

    return info;
  } catch (err) {
    console.log(err);
  }
};

const sendDataToTheServer = async (url = "", data = {}) => {
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

// an asynchronous function to fetch the data from the app endpoint
const updateUI = async () => {
  const res = await fetch(`${server}/getWeatherData`);
  const info = await res.json();

  try {
    errorEl.textContent = "Most Recent Entry ";
    cityEl.textContent = `City: ${info.city}`;
    descriptionEl.textContent = `description: ${info.description}`;
    dateEl.textContent = `Date: ${date}`;
    tempEl.textContent = `Temp: ${info.temp}`;
    contentEl.textContent = `Your feeling: ${info.feelings}`;
  } catch (err) {
    console.log(err);
  }
};
