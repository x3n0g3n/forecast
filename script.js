const searchButton = document.querySelector('.searchbutton');
const searchInput = document.querySelector('.search-bar');

searchButton.addEventListener('click', async function () {
  const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchInput.value}&limit=1&appid=5c24ae42624e82bc2dd372d2ce2a5afc`);
  const data = await response.json();
  getWeather(data[0].lat, data[0].lon);
});

function getWeather(latitude, longitude) {
  const weatherApi = `http://api.openweathermap.org/data/2.5/forecast?&units=imperial&lat=${latitude}&lon=${longitude}&appid=5c24ae42624e82bc2dd372d2ce2a5afc`;
  fetch(weatherApi)
    .then(response => response.json())
    .then(data => {
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
    })
    .catch(error => {
      console.error(error);
      alert("Weather data not found.");
    });
}

const weather = {
  appKey: "5c24ae42624e82bc2dd372d2ce2a5afc",
  fetchWeather: function (city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.appKey}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then(data => this.displayWeather(data))
      .catch(error => {
        console.error(error);
        alert("Weather data not found.");
      });
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
    this.fetchWeather(searchInput.value);
  },
};

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    weather.search();
  }
});

weather.fetchWeather("");

