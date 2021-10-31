/* ----------------Global Variables---------------- */
// the url & my credentials on OpenWeatherMap.com
const key = `&appid=ddc41e9557902b7fefb029830d71fe4d`;
const url = `http://api.openweathermap.org/data/2.5/weather?zip=`;

// our server to make a get & post request to
const server = `http://localhost:8080`;

// the generate button to to display the weather info
document.getElementById("generate").addEventListener("click", () => {
  const feelings = document.getElementById("feelings").value.trim();
  const zip = document.getElementById("zip").value.trim();
  // get the weather info
  fetchOpenWeatherMapApi(url, zip, key)
    // make our data(the data that we want) from the weather info
    .then((apiResponse) => makeOurData(apiResponse, feelings))
    // add our data to the server
    .then((ourData) =>
      addOurDataToTheServer(server, ourData).then(
        // get our data from the server
        getOurDataFromTheServer(server).then(
          // update the ui
          (ourData) => updateTheUi(ourData)
        )
      )
    );
});

// an async function to get the weather info from the api
const fetchOpenWeatherMapApi = async (url, zip, key) => {
  try {
    const respnose = await fetch(`${url}${zip}${key}`);
    return await respnose.json();
  } catch (error) {
    console.log(`error in fetchOpenWeatherMapApi(): ${error}`);
  }
};

// a function to make our data from the weather info
const makeOurData = async (apiResponse, feelings) => {
  if (apiResponse.cod !== 200) {
    return apiResponse;
  } else {
    let ourData = {
      temp: apiResponse.main.temp,
      date: new Date().toDateString(),
      feelings: feelings || "You didn't type your feelings",
    };
    return ourData;
  }
};

// an async function to add our data to the server
const addOurDataToTheServer = async (server, ourData) => {
  try {
    await fetch(`${server}/addWeatherData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ourData),
    });
  } catch (error) {
    console.log(`error in addOurDataToTheServer(): ${error}`);
  }
};

// an async function to get our data from the server
const getOurDataFromTheServer = async (server) => {
  try {
    const response = await fetch(`${server}/getWeatherData`);
    return await response.json();
  } catch (error) {
    console.log(`error in getOurDataFromTheServer(): ${error}`);
  }
};

// a function to update the ui according to our data
const updateTheUi = (ourData) => {
  try {
    if (ourData.temp) {
      document.querySelector(".title").innerHTML = `Most Recent Entry`;
      document.getElementById(
        "content"
      ).innerHTML = `Feelings: ${ourData.feelings}`;
      document.getElementById("date").innerHTML = `Date: ${ourData.date}`;
      document.getElementById("temp").innerHTML = `Temp: ${ourData.temp}`;
    } else {
      document.querySelector(".title").innerHTML = ourData.message;
      document.getElementById("content").innerHTML = ``;
      document.getElementById("date").innerHTML = ``;
      document.getElementById("temp").innerHTML = ``;
    }
  } catch (error) {
    console.log(`error in updateTheUi(): ${error}`);
  }
};
