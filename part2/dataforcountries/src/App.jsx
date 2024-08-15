import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(null);

  //Initial render all countries.
  useEffect(() => {
    //Return if countries array is empty.
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((response) => {
        const countriesCopy = [response.data][0].map((country) => ({
          name: country.name.common,
          cca3: country.cca3,
        }));
        setCountries(countriesCopy);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  // Render when search state changes.
  useEffect(() => {
    // Reset the country state if there is no match or the search query is empty
    if (filteredCountries.length === 0 || search === "") {
      setCountry(null);
      return;
    }

    //Stop effect if filteredCountries array has more than one country.
    if (filteredCountries.length !== 1) {
      return;
    }

    //Stop effect if country state is not empty.
    if (country !== null) {
      return;
    }

    axios
      .get(
        `https://studies.cs.helsinki.fi/restcountries/api/name/${filteredCountries[0].name}`
      )
      .then((response) => {
        setCountry({
          name: response.data.name.common,
          capital: response.data.capital[0],
          area: response.data.area,
          languages: Object.entries(response.data.languages).map(
            ([key, value]) => ({ [key]: value })
          ),
          flagPng: response.data.flags.png,
          flagAlt: response.data.flags.alt,
        });
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [search]);

  const handleCountryChange = (event) => {
    setSearch(event.target.value);
  };

  //Filtered countries
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  const countriesList = filteredCountries.map((country) => (
    <li key={country.cca3}>{country.name}</li>
  ));

  const countryDetail = () => {
    return (
      <div>
        <h3>{country.name}</h3>
        <p>capital {country.capital}</p>
        <p>area {country.area}</p>
        <ul>
          <strong>Languages:</strong>
          {country.languages.map((language) => (
            <li key={Object.keys(language)}>{Object.values(language)}</li>
          ))}
        </ul>
        <img alt={country.flagAlt} src={country.flagPng}></img>
      </div>
    );
  };

  return (
    <div>
      <form>
        find countries <input value={search} onChange={handleCountryChange} />
      </form>
      {country !== null ? (
        countryDetail()
      ) : (
        <ul>
          {search === "" ? (
            <p></p>
          ) : filteredCountries.length > 10 ? (
            <p>Too many matches, specify another filter</p>
          ) : (
            countriesList
          )}
        </ul>
      )}
    </div>
  );
};

export default App;
