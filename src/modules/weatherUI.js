import { Icon } from './icons.js';

export class WeatherUI {
    constructor(weatherList, alertList) {
        this.weatherList = weatherList;
        this.alertList = alertList;
    }

    displayWeather(locationData, displayUnit, onRemove) {
        const weatherDiv = document.createElement('div');
        weatherDiv.classList.add('weather-card');

        const titleDiv = document.createElement('h2');

        const closeBtn = document.createElement('button');
        closeBtn.classList.add('close-button');
        closeBtn.textContent = '✖';
        closeBtn.setAttribute('aria-label', `Remove ${locationData.address} weather card`);
        closeBtn.addEventListener('click', () => {
            onRemove(locationData.address);
            weatherDiv.remove();
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
            displayUnit === 'celsius' ? `${locationData.temp.celsius}°C` : `${locationData.temp.fahrenheit}°F`;

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
        humidityImg.src = Icon['humidity'];
        humidityImg.height = 24;
        const humiditySpan = document.createElement('span');
        humiditySpan.textContent = `${locationData.humidity}%`;

        humidityDiv.appendChild(humidityImg);
        humidityDiv.appendChild(humiditySpan);

        const windDiv = document.createElement('div');

        const windImg = document.createElement('img');
        windImg.src = Icon['wind'];
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
            span.textContent = displayUnit === 'celsius' ? `${day.temp.celsius}°C` : `${day.temp.fahrenheit}°F`;
            const span2 = document.createElement('span');
            span2.textContent = day.date;
            div.appendChild(icon);
            div.appendChild(span);
            div.appendChild(span2);
            nextDiv.appendChild(div);
        }

        weatherDiv.appendChild(nextDiv);

        this.weatherList.appendChild(weatherDiv);
    }

    clearWeatherList() {
        this.weatherList.textContent = '';
    }

    displayAlert(message) {
        const alertDiv = document.createElement('div');
        alertDiv.classList.add('alert');

        const alertSpan = document.createElement('span');
        alertSpan.textContent = message;

        const alertCloseButton = document.createElement('button');
        alertCloseButton.classList.add('alert-close-button');
        alertCloseButton.textContent = '✖';

        alertCloseButton.addEventListener('click', () => {
            alertDiv.remove();
        });

        setTimeout(function () {
            alertDiv.remove();
        }, 5000);

        alertDiv.appendChild(alertSpan);
        alertDiv.appendChild(alertCloseButton);

        this.alertList.appendChild(alertDiv);
    }
}
