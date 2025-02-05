const apiKey = "23e208b3ad2a2aa203ea715f8347be4d";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchbox = document.querySelector('.search input');
const searchButton = document.querySelector('.search button');

async function getWeather(city) {
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        const data = await response.json();

        console.log(data);

        // Check if the API returned an error
        if (data.cod === "404") {
            alert("City not found. Please enter a valid city name.");
            return;
        }

        // Update the DOM with weather data
        document.querySelector('.city').innerHTML = data.name;
        document.querySelector('.temp').innerHTML = Math.round(data.main.temp) + '°C';
        document.querySelector('.humidity').innerHTML = data.main.humidity + '%';
        document.querySelector('.wind').innerHTML = data.wind.speed + ' km/h';
        document.querySelector('.pressure').innerHTML = data.main.pressure + ' hPa';

        // Update the weather icon based on the weather condition
        const weatherIcon = document.querySelector('.weather-icon');
        if (data.weather && data.weather[0]) {
            const iconCode = data.weather[0].icon;
            weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("An error occurred while fetching weather data. Please try again.");
    }
}

function handleSearch() {
    const city = searchbox.value.trim();
    if (city) {
        getWeather(city);
    } else {
        alert("Please enter a city name.");
    }
}

// Fetch Athens' weather on page load
document.addEventListener("DOMContentLoaded", () => {
    getWeather("Athens");
});

// Event listener for the search button
searchButton.addEventListener('click', handleSearch);

// Event listener for the Enter key in the search input
searchbox.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        handleSearch();
    }
});

// forecast

async function getForecast(city) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${city}&appid=${apiKey}`;

    try {
        const response = await fetch(forecastUrl);
        const data = await response.json();

        const forecastContainer = document.querySelector('.forecast-container');
        forecastContainer.innerHTML = ""; // Clear previous results

        // Loop through data to get one forecast per day
        const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));

        dailyForecasts.forEach(day => {
            const date = new Date(day.dt_txt).toLocaleDateString();
            const temp = Math.round(day.main.temp);
            const icon = day.weather[0].icon;

            const forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');
            forecastItem.innerHTML = `
                <p>${date}</p>
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather icon">
                <p>${temp}°C</p>
            `;

            forecastContainer.appendChild(forecastItem);
        });

    } catch (error) {
        console.error("Error fetching forecast data:", error);
    }
}

// Update the getWeather function to call getForecast
async function getWeather(city) {
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        const data = await response.json();

        if (data.cod === "404") {
            alert("City not found. Please enter a valid city name.");
            return;
        }

        document.querySelector('.city').innerHTML = data.name;
        document.querySelector('.temp').innerHTML = Math.round(data.main.temp) + '°C';
        document.querySelector('.humidity').innerHTML = data.main.humidity + '%';
        document.querySelector('.wind').innerHTML = data.wind.speed + ' km/h';
        document.querySelector('.pressure').innerHTML = data.main.pressure + ' hPa';

        const weatherIcon = document.querySelector('.weather-icon');
        if (data.weather && data.weather[0]) {
            const iconCode = data.weather[0].icon;
            weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        }

        // Fetch forecast data
        getForecast(city);

    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}