// the url & my credentials on OpenWeatherMap.com
const key = `&appid=ddc41e9557902b7fefb029830d71fe4d&units=metric`;
const url = `https://api.openweathermap.org/data/2.5/weather?zip=`;
const form = document.getElementById("myForm");
const zip = document.getElementById(`zip`);
// our server to make a get & post request to
const server = `http://localhost:8000`;

const deActivate = () => {
  zip.setAttribute(`placeholder`, `Wrong zip code`);
  zip.classList.add(`invalid`);
  zip.value = ``;
};

const activate = () => {
  zip.setAttribute(`placeholder`, `Enter zip code here`);
  zip.classList.remove(`invalid`);
};
// the generate button to to display the weather info
form.addEventListener(`submit`, (e) => {
  const value = zip.value.trim();
  if (value === "" || value === null) {
    deActivate();
    e.preventDefault();
  } else {
    activate();
    fetchOpenWeatherMapApi(url, value, key)
      .then((data) => makeOurData(data))
      .then((data) =>
        postData(server, data).then(getData(server).then(updateTheUi(data)))
      )
      .catch((error) => {
        deActivate();
        console.error(error);
      });
  }
});

// an async function to get the weather info from the api
const fetchOpenWeatherMapApi = async (url, zip, key) => {
  try {
    const response = await fetch(url + zip + key);
    return await response.json();
  } catch (error) {
    console.error(`error in fetchOpenWeatherMapApi(): ${error}`);
  }
};

// a function to make our data from the weather info
const makeOurData = async ({ main: { temp } }) => {
  const feelings = document.getElementById(`feelings`).value.trim();
  return {
    temp,
    date: new Date().toDateString(),
    feelings: feelings || `You didn't type your feelings`,
  };
};

// an async function to add our data to the server
const postData = async (server, ourData) => {
  try {
    fetch(`${server}/addWeatherData`, {
      method: `POST`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ourData),
    });
  } catch (error) {
    console.error(`error in postData(): ${error}`);
  }
};

// an async function to get our data from the server
const getData = async (server) => {
  try {
    const response = await fetch(`${server}/getWeatherData`);
    return await response.json();
  } catch (error) {
    console.error(`error in getData(): ${error}`);
  }
};

// a function to update the ui according to our data
const updateTheUi = ({ temp, date, feelings }) => {
  document.querySelector(".title").innerHTML = `Most Recent Entry`;
  document.getElementById("content").innerHTML = `Feelings: ${feelings}`;
  document.getElementById("date").innerHTML = `Date: ${date}`;
  document.getElementById("temp").innerHTML = `Temp: ${temp} `;
};