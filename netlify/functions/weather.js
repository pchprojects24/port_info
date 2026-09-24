// Roll the 3-hourly forecast up into daily highs/lows in the port's local time.
function dailyForecast(list, tzOffsetSec = 0) {
  const days = new Map();
  list.forEach((item) => {
    if (!item.main || !Number.isFinite(item.dt)) return;
    const local = new Date((item.dt + tzOffsetSec) * 1000);
    const date = local.toISOString().slice(0, 10);
    const middayDistance = Math.abs(local.getUTCHours() - 13);
    let day = days.get(date);
    if (!day) {
      day = { date, temp_max: -Infinity, temp_min: Infinity, pop: 0, wind: 0, humidity: 0, count: 0, rep: null, repDistance: Infinity };
      days.set(date, day);
    }
    day.temp_max = Math.max(day.temp_max, item.main.temp_max ?? item.main.temp);
    day.temp_min = Math.min(day.temp_min, item.main.temp_min ?? item.main.temp);
    day.pop = Math.max(day.pop, item.pop || 0);
    day.wind = Math.max(day.wind, item.wind?.speed || 0);
    day.humidity += item.main.humidity || 0;
    day.count += 1;
    // Use the reading closest to early afternoon for the icon/description
    if (middayDistance < day.repDistance) {
      day.rep = item;
      day.repDistance = middayDistance;
    }
  });

  const sorted = Array.from(days.values()).sort((a, b) => a.date.localeCompare(b.date));
  // Drop today if only a sliver of it is left in the forecast
  if (sorted.length > 4 && sorted[0].count < 3) sorted.shift();

  return sorted.slice(0, 4).map((day) => ({
    date: day.date,
    temp_max: day.temp_max,
    temp_min: day.temp_min,
    pop: day.pop,
    wind: day.wind,
    humidity: Math.round(day.humidity / day.count),
    icon: day.rep?.weather?.[0]?.icon || '',
    description: day.rep?.weather?.[0]?.description || '',
  }));
}

const DEFAULT_COORDS = { lat: 46.7792, lon: -56.1762 };

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
    const forecast = dailyForecast(forecastData.list || [], forecastData.city?.timezone || 0);

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
