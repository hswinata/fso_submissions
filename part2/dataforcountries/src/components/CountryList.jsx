import CountryDetail from "./CountryDetail";

const CountryList = ({
  filteredCountries,
  handleShowClick,
  visibility,
  temperature,
  wind,
}) => {
  return (
    <div>
      {filteredCountries.map((country) => (
        <li key={country.cca3}>
          {country.name.common}
          <button onClick={() => handleShowClick(country)}>
            {visibility[country.cca3] ? "hide" : "show"}
          </button>
          {visibility[country.cca3] && (
            <CountryDetail
              country={country}
              temperature={temperature}
              wind={wind}
            />
          )}
        </li>
      ))}
    </div>
  );
};

export default CountryList;
