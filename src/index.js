import './styles.css';

import CLOUD_SNOW from './assets/cloud-snow.svg';
import CLOUD_RAIN from './assets/cloud-rain.svg';
import CLOUD_FOG from './assets/cloud-fog.svg';
import WIND from './assets/wind.svg';
import CLOUDY from './assets/cloudy.svg';
import CLOUD_SUN from './assets/cloud-sun.svg';
import CLOUD_MOON from './assets/cloud-moon.svg';
import SUN from './assets/sun.svg';
import MOON from './assets/moon.svg';
import HUMIDITY from './assets/humidity.svg';

const Icon = {
    snow: CLOUD_SNOW,
    rain: CLOUD_RAIN,
    fog: CLOUD_FOG,
    wind: WIND,
    cloudy: CLOUDY,
    'partly-cloudy-day': CLOUD_SUN,
    'partly-cloudy-night': CLOUD_MOON,
    'clear-day': SUN,
    'clear-night': MOON,
};

const form = document.querySelector('form');
const input = document.querySelector('input');
const unitSwitch = document.querySelector('input.switch');
const unitSpan = document.querySelector('#unit');
const weatherList = document.querySelector('.weather-list');

const weatherData = {
    locations: [],
    displayUnit: 'celsius',
};

form.addEventListener('submit', (event) => {
    event.preventDefault();
    getWeatherData(input.value).then((result) => {
        if (result == -1) {
            console.log('The location is already being displayed');
        } else if (result !== null) {
            displayWeather(result);
        }
    });
    input.value = '';
});

unitSwitch.addEventListener('change', function () {
    if (this.checked) {
        unitSpan.textContent = 'Fahrenheit';
        weatherData.displayUnit = 'fahrenheit';
    } else {
        unitSpan.textContent = 'Celsius';
        weatherData.displayUnit = 'celsius';
    }
    renderAllWeatherCards();
});

function renderAllWeatherCards() {
    weatherList.textContent = '';

    weatherData.locations.forEach((location) => {
        displayWeather(location, weatherData.displayUnit);
    });
}

async function getWeatherData(location) {
    try {
        const response = await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=QRCGFPVY2QRY635NJUNWUYVLL&contentType=json`,
            {
                mode: 'cors',
            }
        );
        const apiData = await response.json();

        const nextDays = [];
        const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        for (let day of apiData.days.slice(0, 8)) {
            const d = new Date(day.datetime);
            const tempC = day.temp;
            const tempF = ((tempC * 9) / 5 + 32).toFixed(1);
            nextDays.push({ icon: day.icon, temp: { celsius: tempC, fahrenheit: tempF }, date: weekday[d.getDay()] });
        }

        const tempC = apiData.currentConditions.temp;
        const tempF = ((tempC * 9) / 5 + 32).toFixed(1);

        const locationData = {
            address: apiData.resolvedAddress,
            temp: {
                celsius: tempC,
                fahrenheit: tempF,
            },
            humidity: apiData.currentConditions.humidity,
            windSpeed: apiData.currentConditions.windspeed,
            icon: apiData.currentConditions.icon,
            conditions: apiData.currentConditions.conditions,
            description: apiData.description,
            nextDays: nextDays,
        };

        const existingIndex = weatherData.locations.findIndex((loc) => loc.address === locationData.address);
        if (existingIndex >= 0) {
            return -1;
        } else {
            weatherData.locations.push(locationData);
        }

        return locationData;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

function displayWeather(locationData) {
    const weatherDiv = document.createElement('div');
    weatherDiv.classList.add('weather-card');

    const titleDiv = document.createElement('h2');

    const closeBtn = document.createElement('button');
    closeBtn.classList.add('closeBtn');
    closeBtn.textContent = '✖';
    closeBtn.setAttribute('aria-label', `Remove ${locationData.address} weather card`);
    closeBtn.addEventListener('click', () => {
        const index = weatherData.locations.findIndex((loc) => loc.address === locationData.address);
        if (index >= 0) weatherData.locations.splice(index, 1);
        weatherList.removeChild(weatherDiv);
    });

    const titleSpan = document.createElement('span');
    titleSpan.textContent = locationData.address;

    titleDiv.appendChild(closeBtn);
    titleDiv.appendChild(titleSpan);

    weatherDiv.appendChild(titleDiv);

    const tempDiv = document.createElement('div');
    tempDiv.classList.add('temperature');

    const tempImg = document.createElement('img');
    tempImg.src = Icon[locationData.icon];
    tempImg.height = 32;
    const tempSpan = document.createElement('span');
    tempSpan.textContent =
        weatherData.displayUnit === 'celsius' ? `${locationData.temp.celsius}°C` : `${locationData.temp.fahrenheit}°F`;

    tempDiv.appendChild(tempImg);
    tempDiv.appendChild(tempSpan);

    weatherDiv.appendChild(tempDiv);

    const statusDiv = document.createElement('div');
    statusDiv.classList.add('status');

    const conditionsSpan = document.createElement('span');
    conditionsSpan.textContent = locationData.conditions;

    const descriptionSpan = document.createElement('span');
    descriptionSpan.textContent = locationData.description;

    statusDiv.appendChild(conditionsSpan);
    statusDiv.appendChild(descriptionSpan);

    weatherDiv.appendChild(statusDiv);

    const dataDiv = document.createElement('div');
    dataDiv.classList.add('data');

    const humidityDiv = document.createElement('div');

    const humidityImg = document.createElement('img');
    humidityImg.src = HUMIDITY;
    humidityImg.height = 24;
    const humiditySpan = document.createElement('span');
    humiditySpan.textContent = `${locationData.humidity}%`;

    humidityDiv.appendChild(humidityImg);
    humidityDiv.appendChild(humiditySpan);

    const windDiv = document.createElement('div');

    const windImg = document.createElement('img');
    windImg.src = WIND;
    windImg.height = 24;
    const windSpan = document.createElement('span');
    windSpan.textContent = `${locationData.windSpeed} km/h`;

    windDiv.appendChild(windImg);
    windDiv.appendChild(windSpan);

    dataDiv.appendChild(humidityDiv);
    dataDiv.appendChild(windDiv);

    weatherDiv.appendChild(dataDiv);

    const nextDiv = document.createElement('div');
    nextDiv.classList.add('next-day-list');

    for (let day of locationData.nextDays) {
        const div = document.createElement('div');
        div.classList.add('next-day');
        const icon = document.createElement('img');
        icon.src = Icon[day.icon];
        icon.height = 24;
        const span = document.createElement('span');
        span.textContent = span.textContent =
            weatherData.displayUnit === 'celsius' ? `${day.temp.celsius}°C` : `${day.temp.fahrenheit}°F`;
        const span2 = document.createElement('span');
        span2.textContent = day.date;
        div.appendChild(icon);
        div.appendChild(span);
        div.appendChild(span2);
        nextDiv.appendChild(div);
    }

    weatherDiv.appendChild(nextDiv);

    weatherList.appendChild(weatherDiv);
}

function populateList() {
    getWeatherData('Istanbul').then((result) => displayWeather(result));
    getWeatherData('Tokyo').then((result) => displayWeather(result));
    getWeatherData('London').then((result) => displayWeather(result));
    getWeatherData('New york').then((result) => displayWeather(result));
    getWeatherData('Sydney').then((result) => displayWeather(result));
}

populateList();
