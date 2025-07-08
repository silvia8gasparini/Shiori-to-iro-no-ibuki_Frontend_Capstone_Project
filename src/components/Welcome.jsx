import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

const Welcome = () => {
  const [weatherData, setWeatherData] = useState([]);

  const iconMap = {
    "clear sky": "/img/weather-icons/clear.svg",
    "few clouds": "/img/weather-icons/fewclouds.svg",
    "scattered clouds": "/img/weather-icons/brokenclouds.svg",
    "broken clouds": "/img/weather-icons/brokenclouds.svg",
    "overcast clouds": "/img/weather-icons/brokenclouds.svg",
    "shower rain": "/img/weather-icons/shower.svg",
    rain: "/img/weather-icons/rain.svg",
    "light rain": "/img/weather-icons/rain.svg",
    "moderate rain": "/img/weather-icons/rain.svg",
    "heavy intensity rain": "/img/weather-icons/shower.svg",
    "very heavy rain": "/img//weather-icons/shower.svg",
    "extreme rain": "/img//weather-icons/shower.svg",
    "freezing rain": "/public/img/weather-icons/snow.svg",
    "light intensity shower rain": "/img//weather-icons/shower.svg",
    "heavy intensity shower rain": "/img//weather-icons/shower.svg",
    "ragged shower rain": "/img//weather-icons/shower.svg",
    thunderstorm: "/img/weather-icons/thunderstorm.svg",
    "thunderstorm with light rain": "/img/weather-icons/thunderstorm.svg",
    "thunderstorm with rain": "/img/weather-icons/thunderstorm.svg",
    "thunderstorm with heavy rain": "/img/weather-icons/thunderstorm.svg",
    "light thunderstorm": "/img/weather-icons/thunderstorm.svg",
    "heavy thunderstorm": "/img/weather-icons/thunderstorm.svg",
    "thunderstorm with light drizzle": "/img/weather-icons/thunderstorm.svg",
    "thunderstorm with drizzle": "/img/weather-icons/thunderstorm.svg",
    "thunderstorm with heavy drizzle": "/img/weather-icons/thunderstorm.svg",
    snow: "/public/img/weather-icons/snow.svg",
    mist: "/public/img/weather-icons/mist.svg",
  };

  useEffect(() => {
    const cities = ["Kyoto", "Okinawa"];
    const apiKey = "1507cc7f5a41802bff4e537e298edc27";

    Promise.all(
      cities.map((city) =>
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            city
          )}&appid=${apiKey}&units=metric`
        ).then((response) => {
          if (!response.ok) throw new Error(`Errore per ${city}`);
          return response.json();
        })
      )
    )
      .then((data) => {
        const formatted = data.map((d) => ({
          city: d.name,
          temp: d.main.temp,
          description: d.weather[0].description,
          icon: d.weather[0].icon,
        }));
        setWeatherData(formatted);
      })
      .catch((error) => {
        console.error("Errore meteo:", error);
      });
  }, []);

  return (
    <Container fluid className="welcome-section">
      <Row className="text-center">
        <Col xs={12} sm={4}></Col>

        <Col xs={12} sm={4}>
          <p className="paragraph">いらっしゃいませ！ Benvenutə! </p>
        </Col>

        <Col xs={12} sm={4}>
          {weatherData.length > 0 ? (
            <div className="d-flex justify-content-center gap-4 flex-wrap">
              {weatherData.map((w, index) => (
                <div
                  key={index}
                  className="text-center"
                  style={{
                    fontSize: "1.2rem",
                    padding: "0.5em 1em",
                  }}
                >
                  <div>
                    <strong>{w.city}</strong>
                  </div>
                  <div>
                    {w.temp.toFixed(1)}°C – {w.description}
                  </div>
                  <img
                    src={
                      iconMap[w.description.toLowerCase()] ||
                      "/weather-icons/default.svg"
                    }
                    alt={w.description}
                    style={{ width: "40px", height: "40px" }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="fs-6">Caricamento meteo...</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Welcome;
