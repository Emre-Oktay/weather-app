import './styles.css';

async function getWeatherData(location) {
    const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=QRCGFPVY2QRY635NJUNWUYVLL&contentType=json`,
        {
            mode: 'cors',
        }
    );
    const weatherData = await response.json();
    console.log(weatherData);
    const address = weatherData.resolvedAddress;
    const temp = weatherData.currentConditions.temp;
    const humidity = weatherData.currentConditions.humidity;
    const windSpeed = weatherData.currentConditions.windspeed;
    const icon = weatherData.currentConditions.icon;
    const conditions = weatherData.currentConditions.conditions;
    const description = weatherData.description;
    return [address, temp, humidity, windSpeed, icon, conditions, description];
}

const form = document.querySelector('form');
const input = document.querySelector('input');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    getWeatherData(input.value).then((result) => console.log(result));
});

getWeatherData('izmir').then((result) => console.log(result));
