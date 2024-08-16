import { useState, useEffect } from "react";
import axios from "axios";
import CountryList from "./components/CountryList";
import CountryDetail from "./components/CountryDetail";
import SearchForm from "./components/SearchForm";

const App = () => {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [visibility, setVisibility] = useState({});
  const [temperature, setTemperature] = useState("");
  const [wind, setWind] = useState("");

  // Filtered countries.
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  // Initial render all countries.
  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  //Fetch city weather and wind.
  const fetchWeather = (lat, lang) => {
    axios
      .get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lang}&current=temperature_2m,wind_speed_10m&wind_speed_unit=ms`
      )
      .then((response) => {
        setTemperature(response.data.current.temperature_2m + "Celsius");
        setWind(response.data.current.wind_speed_10m + "m/s");
      })
      .catch((error) => console.error(error.message));
  };

  const handleCountryChange = (event) => {
    setSearch(event.target.value);
  };

  const handleShowClick = (country) => {
    setVisibility((prevVisibility) => ({
      ...prevVisibility,
      [country.cca3]: !prevVisibility[country.cca3],
    }));

    fetchWeather(country.capitalInfo.latlng[0], country.capitalInfo.latlng[1]);
  };

  return (
    <div>
      <SearchForm search={search} handleCountryChange={handleCountryChange} />

      {filteredCountries.length === 1 ? (
        <>
          {fetchWeather(
            filteredCountries[0].capitalInfo.latlng[0],
            filteredCountries[0].capitalInfo.latlng[1]
          )}
          <CountryDetail
            country={filteredCountries[0]}
            temperature={temperature}
            wind={wind}
          />
        </>
      ) : (
        <ul>
          {search === "" ? (
            <p>Search country</p>
          ) : filteredCountries.length > 10 ? (
            <p>Too many matches, specify another filter</p>
          ) : (
            <>
              <CountryList
                filteredCountries={filteredCountries}
                handleShowClick={handleShowClick}
                visibility={visibility}
                temperature={temperature}
                wind={wind}
              />
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default App;
