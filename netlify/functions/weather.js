const DEFAULT_COORDS = { lat: 47.5615, lon: -52.7126 };

function parseCoord(value, fallback) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

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
  const params = event.queryStringParameters || {};
  const lat = parseCoord(params.lat, DEFAULT_COORDS.lat);
  const lon = parseCoord(params.lon, DEFAULT_COORDS.lon);
  const apiKey = process.env.OPENWEATHER_API_KEY || process.env.OPEN_WEATHER_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing OpenWeather API key.' }),
    };
  }

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`),
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'Unable to fetch weather data.' }),
      };
    }

    const current = await currentRes.json();
    const forecastData = await forecastRes.json();
    const forecast = pickDailyForecast(forecastData.list || []);

    return {
      statusCode: 200,
      body: JSON.stringify({
        current,
        forecast,
        updated: new Date().toISOString(),
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Weather service error.' }),
    };
  }
};
