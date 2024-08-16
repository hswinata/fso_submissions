const SearchForm = ({search, handleCountryChange}) => {
  return (
    <form>
      find countries <input value={search} onChange={handleCountryChange} />
    </form>
  );
};

export default SearchForm;
