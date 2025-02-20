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

async function getWeatherData(location) {
    const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=QRCGFPVY2QRY635NJUNWUYVLL&contentType=json`,
        {
            mode: 'cors',
        }
    );
    const weatherData = await response.json();

    const address = weatherData.resolvedAddress;
    const temp = weatherData.currentConditions.temp;
    const humidity = weatherData.currentConditions.humidity;
    const windSpeed = weatherData.currentConditions.windspeed;
    const icon = weatherData.currentConditions.icon;
    const conditions = weatherData.currentConditions.conditions;
    const description = weatherData.description;

    const nextDays = [];
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for (let day of weatherData.days.slice(0, 7)) {
        const d = new Date(day.datetime);
        nextDays.push({ icon: day.icon, temp: day.temp, date: weekday[d.getDay()] });
    }

    return [address, temp, humidity, windSpeed, icon, conditions, description, nextDays];
}

const form = document.querySelector('form');
const input = document.querySelector('input');
const weatherList = document.querySelector('.weather-list');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    getWeatherData(input.value).then((result) => displayWeather(result));
    input.value = '';
});

function displayWeather([address, temp, humidity, windSpeed, icon, conditions, description, nextDays]) {
    const weatherDiv = document.createElement('div');
    weatherDiv.classList.add('weather-card');

    const titleDiv = document.createElement('h2');

    const closeBtn = document.createElement('button');
    closeBtn.classList.add('closeBtn');
    closeBtn.textContent = '✖';
    closeBtn.setAttribute('aria-label', `Remove ${address} weather card`);
    closeBtn.addEventListener('click', () => weatherList.removeChild(weatherDiv));

    const titleSpan = document.createElement('span');
    titleSpan.textContent = address;

    titleDiv.appendChild(closeBtn);
    titleDiv.appendChild(titleSpan);

    weatherDiv.appendChild(titleDiv);

    const tempDiv = document.createElement('div');
    tempDiv.classList.add('temperature');

    const tempImg = document.createElement('img');
    tempImg.src = handleIcon(icon);
    tempImg.height = 32;
    const tempSpan = document.createElement('span');
    tempSpan.textContent = `${temp}°`;

    tempDiv.appendChild(tempImg);
    tempDiv.appendChild(tempSpan);

    weatherDiv.appendChild(tempDiv);

    const statusDiv = document.createElement('div');
    statusDiv.classList.add('status');

    const conditionsSpan = document.createElement('span');
    conditionsSpan.textContent = conditions;

    const descriptionSpan = document.createElement('span');
    descriptionSpan.textContent = description;

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
    humiditySpan.textContent = `${humidity}%`;

    humidityDiv.appendChild(humidityImg);
    humidityDiv.appendChild(humiditySpan);

    const windDiv = document.createElement('div');

    const windImg = document.createElement('img');
    windImg.src = WIND;
    windImg.height = 24;
    const windSpan = document.createElement('span');
    windSpan.textContent = `${windSpeed} km/h`;

    windDiv.appendChild(windImg);
    windDiv.appendChild(windSpan);

    dataDiv.appendChild(humidityDiv);
    dataDiv.appendChild(windDiv);

    weatherDiv.appendChild(dataDiv);

    const nextDiv = document.createElement('div');
    nextDiv.classList.add('next-day-list');

    for (let day of nextDays) {
        const div = document.createElement('div');
        div.classList.add('next-day');
        const icon = document.createElement('img');
        icon.src = handleIcon(day.icon);
        icon.height = 24;
        const span = document.createElement('span');
        span.textContent = `${day.temp}°`;
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

function handleIcon(icon) {
    switch (icon) {
        case 'snow':
            return CLOUD_SNOW;
        case 'rain':
            return CLOUD_RAIN;
        case 'fog':
            return CLOUD_FOG;
        case 'wind':
            return WIND;
        case 'cloudy':
            return CLOUDY;
        case 'partly-cloudy-day':
            return CLOUD_SUN;
        case 'partly-cloudy-night':
            return CLOUD_MOON;
        case 'clear-day':
            return SUN;
        case 'clear-night':
            return MOON;
    }
}

function populateList() {
    getWeatherData('Istanbul').then((result) => displayWeather(result));
    getWeatherData('Tokyo').then((result) => displayWeather(result));
    getWeatherData('London').then((result) => displayWeather(result));
    getWeatherData('New york').then((result) => displayWeather(result));
    getWeatherData('Sydney').then((result) => displayWeather(result));
}

populateList();
