// weather-service.js - Weather Forecast Simulation & Agro-climatic Zone Service
class WeatherService {
  /**
   * Get simulated 15-day forecast for a given district
   */
  static getForecast(districtKey, baseTemp = 28, baseRain = 750) {
    const days = [];
    const conditionPool = [
      { name: "Sunny / Clear", icon: "☀️", rainProb: 10 },
      { name: "Partly Cloudy", icon: "⛅", rainProb: 25 },
      { name: "Scattered Showers", icon: "🌦️", rainProb: 65 },
      { name: "Monsoon Rain", icon: "🌧️", rainProb: 85 },
      { name: "Thunderstorm", icon: "⛈️", rainProb: 90 }
    ];

    const today = new Date();

    for (let i = 0; i < 15; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayOffset = Math.sin(i * 0.5) * 3;
      const maxTemp = Math.round(baseTemp + 4 + dayOffset + (Math.random() * 2 - 1));
      const minTemp = Math.round(baseTemp - 5 + dayOffset + (Math.random() * 2 - 1));
      
      const condIndex = baseRain > 800 
        ? Math.floor(Math.random() * conditionPool.length)
        : Math.floor(Math.random() * 3); // Drier

      const condition = conditionPool[condIndex];
      const dailyRainfallMm = condition.rainProb > 50 ? Math.round(Math.random() * 25 + 5) : 0;

      days.push({
        dayIndex: i + 1,
        dateString: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        weekday: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        maxTemp,
        minTemp,
        condition: condition.name,
        icon: condition.icon,
        rainProbability: condition.rainProb,
        dailyRainfallMm,
        humidity: Math.min(95, Math.max(40, Math.round(60 + (dailyRainfallMm > 0 ? 25 : -10) + Math.random() * 10)))
      });
    }

    // Agro-meteorological advisory
    const total15DayRain = days.reduce((acc, d) => acc + d.dailyRainfallMm, 0);
    let advisory = "Normal seasonal conditions expected. Good for sowing and land preparation.";
    if (total15DayRain > 100) {
      advisory = "Heavy rainfall predicted over next 10 days. Ensure proper drainage channels in fields.";
    } else if (total15DayRain < 15) {
      advisory = "Dry spell ahead. Schedule early morning or drip irrigation to conserve soil moisture.";
    }

    return {
      days,
      total15DayRain,
      advisory
    };
  }
}

window.WeatherService = WeatherService;
