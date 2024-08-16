import CountryDetail from "./CountryDetail";

const CountryList = ({ filteredCountries, handleShowClick, visibility }) => {
  return (
    <div>
      {filteredCountries.map((country) => (
        <li key={country.cca3}>
          {country.name.common}
          <button onClick={() => handleShowClick(country.cca3)}>
            {visibility[country.cca3] ? "hide" : "show"}
          </button>
          {visibility[country.cca3] && <CountryDetail country={country} />}
        </li>
      ))}
    </div>
  );
};

export default CountryList;
