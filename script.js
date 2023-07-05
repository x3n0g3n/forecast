const button = document.querySelector('#button');

async function getGeoData() {
  const GeolocationCoordinates = "http://api.openweathermap.org/geo/1.0/direct?q=London&limit=1&units=standard&appid=5c24ae42624e82bc2dd372d2ce2a5afc";
  const request = await fetch(GeolocationCoordinates);
  const data = await request.json();
  console.log(data);
  getWeather(data[0].lat, data[0].lon);
}

getGeoData();

function getWeather(latitude, longitude) {
  var weatherApi = "http://api.openweathermap.org/data/2.5/forecast?&units=imperial&lat=" + latitude + "&lon=" + longitude + "&appid=5c24ae42624e82bc2dd372d2ce2a5afc";
  fetch(weatherApi)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      console.dir(data.list);
      console.log(data.list[0]);

      const icon = document.querySelector('.icon');
      icon.src = `http://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`;

      const wind = document.querySelector('#wind');
      const humidity = document.querySelector('#humidity');
      humidity.textContent = data.list[0].main.humidity;
      wind.textContent = data.list[0].wind.speed;

      const days = ['mon', 'tue', 'wed', 'thur', 'fri', 'sat'];
      for (let i = 0; i < days.length; i++) {
        const day = document.querySelector(`#temp_${days[i]}`);
        day.textContent = data.list[i * 8].main.temp;
        const dayHumidity = document.querySelector(`#${days[i]}Humidity`);
        dayHumidity.textContent = data.list[i * 8].main.humidity;
        const dayWind = document.querySelector(`#${days[i]}Wind`);
        dayWind.textContent = data.list[i * 8].wind.speed;
      }
    });
}

const searchButton = document.querySelector('.searchbutton');

button.addEventListener('click', async function () {
  const searchBar = document.querySelector('.search-bar');
  const request = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchBar.value}&limit=1&appid=5c24ae42624e82bc2dd372d2ce2a5afc`);
  const data = await request.json();
  getWeather(data[0].lat, data[0].lon);
});

const weather = {
  appKey: "5c24ae42624e82bc2dd372d2ce2a5afc",
  fetchWeather: function (city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.appKey}`)
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
  },
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${icon}.png`;
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");
  },
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
};

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
  if (event.key == "Enter") {
    weather.search();
  }
});

weather.fetchWeather("");
