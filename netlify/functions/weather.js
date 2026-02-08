function pickDailyForecast(list) {
  const dayMap = new Map();
  list.forEach((item) => {
    if (!item.dt_txt) return;
    const [date, time] = item.dt_txt.split(' ');
    const existing = dayMap.get(date);
    if (!existing || time === '12:00:00') {
      dayMap.set(date, item);
    }
  });
  return Array.from(dayMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, item]) => item)
    .slice(0, 4);
}

exports.handler = async (event) => {
  // Read API key from environment variable
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing OpenWeather API key in environment variables.' }),
    };
  }

  try {
    // Call OpenWeatherMap endpoints for St. John's, CA
    // Using city name format as specified in requirements
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=St.%20John%27s,CA&units=metric&appid=${apiKey}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=St.%20John%27s,CA&units=metric&appid=${apiKey}`),
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Unable to fetch weather data from OpenWeatherMap.' }),
      };
    }

    const current = await currentRes.json();
    const forecastData = await forecastRes.json();
    const forecast = pickDailyForecast(forecastData.list || []);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        current,
        forecast,
        updated: new Date().toISOString(),
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Weather service error.',
        message: error.message
      }),
    };
  }
};
