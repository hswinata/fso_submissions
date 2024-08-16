const CountryDetail = ({ country, temperature, wind }) => {
  //Show loading if the state hasn't been populated yet.
  if (!country) {
    return <div>Loading...</div>;
  }

  const languages = Object.entries(country.languages).map(([key, value]) => ({
    [key]: value,
  }));

  return (
    <div>
      <h3>{country.name.common}</h3>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <ul>
        <strong>Languages:</strong>
        {languages.map((language) => (
          <li key={Object.keys(language)}>{Object.values(language)}</li>
        ))}
      </ul>
      <img alt={country.flags.alt} src={country.flags.png}></img>
      <h3>Weather in {country.capital}</h3>
      <p>temperature {temperature}</p>
      <p>wind {wind}</p>
    </div>
  );
};

export default CountryDetail;
