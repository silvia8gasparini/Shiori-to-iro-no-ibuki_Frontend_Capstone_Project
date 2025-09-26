import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentMicroSeason } from "../redux/currentMicroSeasonSlice";
import { fetchNextMicroSeasons } from "../redux/nextMicroSeasonsSlice";
import { fetchColorByMicroSeasonId } from "../redux/selectedColorSlice";
import { fetchBooksByMicroSeasonId } from "../redux/booksSlice";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../assets/welcomeSection.css";

function getRandomCities(array, count = 2) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const Welcome = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [seasonIndex, setSeasonIndex] = useState(0);
  const dispatch = useDispatch();

  const { microSeason: currentMicroSeason } = useSelector(
    (state) => state.currentMicroSeason
  );
  const { nextSeasons, loading, error } = useSelector(
    (state) => state.nextMicroSeasons
  );

  const allSeasons = currentMicroSeason
    ? [currentMicroSeason, ...nextSeasons]
    : [];

  const selectedSeason = allSeasons[seasonIndex] || null;

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
    "very heavy rain": "/img/weather-icons/shower.svg",
    "extreme rain": "/img/weather-icons/shower.svg",
    "freezing rain": "/img/weather-icons/snow.svg",
    "light intensity shower rain": "/img/weather-icons/shower.svg",
    "heavy intensity shower rain": "/img/weather-icons/shower.svg",
    "ragged shower rain": "/img/weather-icons/shower.svg",
    thunderstorm: "/img/weather-icons/thunderstorm.svg",
    "thunderstorm with light rain": "/img/weather-icons/thunderstorm.svg",
    "thunderstorm with rain": "/img/weather-icons/thunderstorm.svg",
    "thunderstorm with heavy rain": "/img/weather-icons/thunderstorm.svg",
    "light thunderstorm": "/img/weather-icons/thunderstorm.svg",
    "heavy thunderstorm": "/img/weather-icons/thunderstorm.svg",
    "thunderstorm with light drizzle": "/img/weather-icons/thunderstorm.svg",
    "thunderstorm with drizzle": "/img/weather-icons/thunderstorm.svg",
    "thunderstorm with heavy drizzle": "/img/weather-icons/thunderstorm.svg",
    snow: "/img/weather-icons/snow.svg",
    mist: "/img/weather-icons/mist.svg",
  };

  useEffect(() => {
    dispatch(fetchCurrentMicroSeason());
    dispatch(fetchNextMicroSeasons(6));

    const cities = [
      "Kyoto",
      "Okinawa",
      "Kamakura",
      "Sapporo",
      "Hiroshima",
      "Nagasaki",
      "Nara",
      "Takayama",
      "Kurashiki",
      "Ise",
      "Karuizawa",
      "Tokyo",
      "Osaka",
      "Kanazawa",
      "Kumamoto",
      "Niigata",
      "Kobe",
      "Sendai",
      "Himeji",
      "Okayama",
    ];
    const selectedCities = getRandomCities(cities, 2);
    const apiKey = "1507cc7f5a41802bff4e537e298edc27";

    Promise.all(
      selectedCities.map((city) =>
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            city
          )}&appid=${apiKey}&units=metric`
        ).then((res) => {
          if (!res.ok) throw new Error(`Errore per ${city}`);
          return res.json();
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
      .catch((err) => {
        console.error("Errore meteo:", err);
      });
  }, [dispatch]);

  useEffect(() => {
    if (selectedSeason) {
      dispatch(fetchColorByMicroSeasonId(selectedSeason.id));
      dispatch(fetchBooksByMicroSeasonId(selectedSeason.id));
    }
  }, [selectedSeason, dispatch]);

  const handleChangeSeason = () => {
    if (allSeasons.length > 0) {
      setSeasonIndex((prev) => (prev + 1) % allSeasons.length);
    }
  };

  return (
    <Container fluid className="welcome-section mt-4">
      <Row className="text-center align-items-center">
        <Col xs={12} sm={4}>
          {loading && <p>Caricamento micro-stagione...</p>}
          {error && <p>Errore: {error}</p>}
          {selectedSeason && (
            <>
              <h5 className="season-title">{selectedSeason.italianName}</h5>
              <h5 className="season-title-jp">{selectedSeason.japaneseName}</h5>
              <p id="season-p">
                {new Date(selectedSeason.startDate).toLocaleDateString(
                  "it-IT",
                  {
                    day: "numeric",
                    month: "long",
                  }
                )}{" "}
                →{" "}
                {new Date(selectedSeason.endDate).toLocaleDateString("it-IT", {
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </>
          )}
          <Button
            className="season-button"
            variant="outline-dark"
            onClick={handleChangeSeason}
          >
            Cambia stagione
          </Button>
        </Col>

        <Col xs={12} sm={4}>
          <p className="welcomep">しおりと色の息吹</p>
          <p className="welcomep-it">Il respiro dei colori tra le pagine</p>
        </Col>

        <Col xs={12} sm={4}>
          {weatherData.length > 0 ? (
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              {weatherData.map((w, index) => (
                <div key={index} className="weather text-center">
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
                    className="weather-icon"
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
