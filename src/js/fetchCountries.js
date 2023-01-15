const BASIC_URL = 'https://restcountries.com/v3.1/name';
const options = 'name,capital,population,flags,languages';

function fetchCountries(name) {
  return fetch(`${BASIC_URL}/${name}?fields=${options}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
};

export { fetchCountries };
