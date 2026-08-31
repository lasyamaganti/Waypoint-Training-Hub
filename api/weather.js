export default async function handler(req, res) {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({
      error: "City is required"
    });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&units=imperial&appid=${apiKey}`
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Unable to retrieve weather"
      });
    }

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Weather request failed"
    });
  }
}
