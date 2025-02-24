import './styles.css';

import { WeatherService } from './modules/weatherService';
import { WeatherStore } from './modules/weatherStore';
import { WeatherUI } from './modules/weatherUI';

class WeatherApp {
    constructor() {
        this.weatherService = new WeatherService();
        this.weatherStore = new WeatherStore();
        this.weatherUI = new WeatherUI(document.querySelector('.weather-list'), document.querySelector('.alert-list'));

        this.setupEventListeners();
        this.initializeDefaultLocations();
    }

    setupEventListeners() {
        const form = document.querySelector('form');
        const input = document.querySelector('input');
        const unitSwitch = document.querySelector('input.switch');
        const unitSpan = document.querySelector('#unit');

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            await this.addLocation(input.value);
            input.value = '';
        });

        unitSwitch.addEventListener('change', (event) => {
            const unit = event.target.checked ? 'fahrenheit' : 'celsius';
            unitSpan.textContent = unit.charAt(0).toUpperCase() + unit.slice(1);
            this.weatherStore.setDisplayUnit(unit);
            this.renderAllWeatherCards();
        });
    }

    async addLocation(location) {
        try {
            const weatherData = await this.weatherService.getWeatherData(location);
            if (this.weatherStore.addLocation(weatherData)) {
                console.log(weatherData);
                this.displayWeather(weatherData);
            } else {
                this.weatherUI.displayAlert('The location is already being displayed');
            }
        } catch (error) {
            this.weatherUI.displayAlert(error);
        }
    }

    displayWeather(locationData) {
        console.log('display weather');
        this.weatherUI.displayWeather(locationData, this.weatherStore.getDisplayUnit(), (address) =>
            this.weatherStore.removeLocation(address)
        );
    }

    renderAllWeatherCards() {
        this.weatherUI.clearWeatherList();
        this.weatherStore.getLocations().forEach((location) => {
            this.displayWeather(location);
        });
    }

    async initializeDefaultLocations() {
        const defaultLocations = ['New york', 'Tokyo', 'Istanbul'];
        for (const location of defaultLocations) {
            await this.addLocation(location);
        }
    }
}

new WeatherApp();
