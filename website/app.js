/* ----------------Global Variables---------------- */
// create the url
let apiKey = `&appid=ddc41e9557902b7fefb029830d71fe4d`;
let baseUrl = `http://api.openweathermap.org/data/2.5/weather?zip=`;

// Create a date instance dynamically with JS
let date = new Date().toDateString();

// the absolute url server
const server = "http://localhost:4000";

// the button to generate the weather
const generateBtn = document.getElementById("generate");

// varibles to update the UI dynamiclly
const dateEl = document.getElementById("date");
const tempEl = document.getElementById("temp");
const contentEl = document.getElementById("content");

// error message for testing purposes
const errorEl = document.querySelector(".holder.entry");

// the info
let info = {};

// the feelings
const feelings = document.getElementById("feelings");
generateBtn.addEventListener("click", () => {
  console.clear();
  zipCode = document.getElementById("zip").value.trim();
  console.log(baseUrl + zipCode + apiKey);
  console.log(`=================`);
  getWeatherData().then((data) => {
    if (data) {
      const {
        main: { temp },
        name: city,
        weather: [{ description }],
      } = data;

      let info = {
        data,
        city,
        temp: Math.round(temp),
        description,
        feelings: feelings.value || ` you did'nt enter your feelings`,
      };
      sendDataToTheServer(server + "/add", info);
      console.log(info);
      updateUI(info);
    }
  });
});

const getWeatherData = async () => {
  try {
    const respnose = await fetch(baseUrl + zipCode + apiKey);
    const data = await respnose.json();

    if (data.cod != 200) {
      errorEl.innerHTML = data.message;
      setTimeout(() => {
        errorEl.style.display = "block";
      }, 2000);
      throw `${data.message}`;
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

const sendDataToTheServer = async (url = "", info = {}) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
  });

  try {
    const newData = await res.json();
    console.log("You have saved" + newData);
    return newData;
  } catch (err) {
    console.log(err);
  }
};

const updateUI = async (info) => {
  const res = await fetch(server + "/all");
  try {
    const info = await res.json();

    dateEl.innerHTML = date;
    tempEl.innerHTML = `${info.temp}`;
    contentEl.innerHTML = info.feelings;
  } catch (err) {
    console.log(err);
  }
};
