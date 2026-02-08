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
      body: JSON.stringify({ error: 'OPENWEATHER_API_KEY is not available to the Netlify function' }),
    };
  }

  // Log API key length (server-side only, not the value)
  console.log(`API key length: ${apiKey.length}`);

  try {
    // Call OpenWeatherMap endpoints for St. John's, CA
    // Using city name format as specified in requirements
    const city = "St. John's,CA";
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`),
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      // Return OpenWeatherMap's full JSON response verbatim for diagnostics
      const errorResponse = !currentRes.ok ? currentRes : forecastRes;
      const errorJson = await errorResponse.json();
      return {
        statusCode: errorResponse.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorJson),
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
