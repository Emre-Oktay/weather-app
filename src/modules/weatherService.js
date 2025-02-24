export class WeatherService {
    async getWeatherData(location) {
        try {
            const response = await fetch(
                `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=QRCGFPVY2QRY635NJUNWUYVLL&contentType=json`,
                {
                    mode: 'cors',
                }
            );

            if (!response.ok) {
                throw new Error(`Error fetching data, status: ${response.status}`);
            }

            const apiData = await response.json();
            return this.formatWeatherData(apiData);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw error;
        }
    }

    formatWeatherData(apiData) {
        const nextDays = apiData.days.slice(0, 8).map((day) => {
            const d = new Date(day.datetime);
            const tempC = day.temp;
            const tempF = ((tempC * 9) / 5 + 32).toFixed(1);
            const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return {
                icon: day.icon,
                temp: { celsius: tempC, fahrenheit: tempF },
                date: weekday[d.getDay()],
            };
        });

        const tempC = apiData.currentConditions.temp;
        const tempF = ((tempC * 9) / 5 + 32).toFixed(1);

        return {
            address: apiData.resolvedAddress,
            temp: { celsius: tempC, fahrenheit: tempF },
            humidity: apiData.currentConditions.humidity,
            windSpeed: apiData.currentConditions.windspeed,
            icon: apiData.currentConditions.icon,
            conditions: apiData.currentConditions.conditions,
            description: apiData.description,
            nextDays,
        };
    }
}
