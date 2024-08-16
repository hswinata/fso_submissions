import { useState, useEffect } from "react";
import axios from "axios";
import CountryList from "./components/CountryList";
import SearchForm from "./components/SearchForm";

const App = () => {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [visibility, setVisibility] = useState({});

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

  const handleCountryChange = (event) => {
    setSearch(event.target.value);
  };

  const handleShowClick = (cca3) => {
    setVisibility((prevVisibility) => ({
      ...prevVisibility,
      [cca3]: !prevVisibility[cca3],
    }));
  };

  return (
    <div>
      <SearchForm search={search} handleCountryChange={handleCountryChange} />

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
            />
          </>
        )}
      </ul>
    </div>
  );
};

export default App;
