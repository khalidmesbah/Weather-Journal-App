/* ----------------Global Variables---------------- */
// create the url
const personalApiKey = `&appid=ddc41e9557902b7fefb029830d71fe4d`;
const baseUrl = `http://api.openweathermap.org/data/2.5/weather?zip=`;

// the button to to display the weather info
const generateBtn = document.getElementById("generate");

// varibles to update the UI dynamiclly
const contentEl = document.getElementById("content");
const dateEl = document.getElementById("date");
const tempEl = document.getElementById("temp");

// the element where we will store the erroror message in
const errororEl = document.querySelector(".title");

let ourData;

/*Create an event listener for the element with the id: generate,
  with a callback function to execute when it is clicked.
  inside that callback function call your async GET request with the parameters:
    base url
    user entered zip code (see input in html with id zip)
    personal API key
*/

generateBtn.addEventListener("click", () => {
  const feelings = document.getElementById("feelings").value.trim();
  // const enteredZipCode = document.getElementById("zip").value.trim();
  // const enteredZipCode = 85001 ;
  // const enteredZipCode = 99501  ;
  const enteredZipCode = 72201;

  fetchOpenWeatherMapApi(baseUrl, enteredZipCode, personalApiKey).then(
    (apiResponse) =>
      addOurDataToTheServer(apiResponse).then(getOurDataFromTheServer())
  );
});

const addOurDataToTheServer = async (apiResponse) => {
  ourData = {
    temp: apiResponse.main.temp,
    date: new Date().toDateString(),
    feelings: feelings.value || "You didn't type your feelings",
  };
  try {
    await fetch("http://localhost:8080/addWeatherData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ourData),
    });
  } catch (error) {
    console.log(`error in addOurDataToTheServer: ${error}`);
  }
};

const getOurDataFromTheServer = async () => {
  const response = await fetch("http://localhost:8080/getWeatherData");
  let ourData = await response.json();
  console.log(ourData);

  return ourData;
  // try {
  //   if (!res.temp) {
  //     errororEl.textContent = res.message;
  //     dateEl.textContent = ``;
  //     tempEl.textContent = ``;
  //     contentEl.textContent = ``;
  //   } else {
  //     errororEl.textContent = "Most Recent Entry ";
  //     dateEl.textContent = `Date: ${res.date}`;
  //     tempEl.textContent = `Temp: ${res.temp}`;
  //     contentEl.textContent = `Feelings: ${res.feelings}`;
  //   }
  //   return res;
  // } catch (error) {
  //   console.log(`error in getOurDataFromTheServer(): ${error}`);
  // }
};

// Write an async function in app.js that uses fetch() to make a GET request to the OpenWeatherMap API.
const fetchOpenWeatherMapApi = async (
  baseUrl,
  enteredZipCode,
  personalApiKey
) => {
  try {
    const respnose = await fetch(
      `${baseUrl}${enteredZipCode}${personalApiKey}`
    );
    const apiData = await respnose.json();

    console.log(apiData);
    return apiData;
  } catch (error) {
    console.log(`error in fetchOpenWeatherMapApi (): ${error}`);
  }
};
