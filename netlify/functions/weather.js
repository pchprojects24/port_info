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

const DEFAULT_COORDS = { lat: 44.6488, lon: -63.5724 };

function isValidCoordinate(lat, lon) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
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

  try {
    const lat = Number.parseFloat(event?.queryStringParameters?.lat);
    const lon = Number.parseFloat(event?.queryStringParameters?.lon);
    const coords = isValidCoordinate(lat, lon) ? { lat, lon } : DEFAULT_COORDS;
    const locationQuery = `lat=${coords.lat}&lon=${coords.lon}`;

    // Call OpenWeatherMap endpoints using coordinates
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?${locationQuery}&units=metric&appid=${apiKey}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?${locationQuery}&units=metric&appid=${apiKey}`),
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      // Return OpenWeatherMap's full JSON response verbatim for diagnostics
      const errorResponse = !currentRes.ok ? currentRes : forecastRes;
      let errorJson;
      try {
        errorJson = await errorResponse.json();
      } catch {
        errorJson = { error: 'Upstream weather provider returned invalid JSON.' };
      }
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
