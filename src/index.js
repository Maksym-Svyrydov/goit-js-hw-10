import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refs = {
  inputEl: document.querySelector(['#search-box']),
  listEl: document.querySelector('.country-list'),
  infoEl: document.querySelector('.country-info'),
};
function cleanMarkup(ref) {
  return (ref.innerHTML = '');
}
refs.inputEl.addEventListener('input', debounce(onInputValue, DEBOUNCE_DELAY));
function onInputValue() {
  const name = refs.inputEl.value.trim();
  if (name === '') {
    return (refs.listEl.innerHTML = ''), (refs.infoEl.innerHTML = '');
  }
  fetchCountries(name)
    .then(response => {
      refs.listEl.innerHTML = '';
      refs.infoEl.innerHTML = '';
      if (response.length > 10) {
        cleanMarkup(refs.listEl);
        cleanMarkup(refs.infoEl);
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (response.length < 10 && response.length >= 2) {
        refs.listEl.insertAdjacentHTML(
          'beforeend',
          countryListMarkup(response)
        );
      } else {
        refs.infoEl.insertAdjacentHTML(
          'beforeend',
          countryInfoMarkup(response)
        );
      }
    })
    .catch(() => {
      cleanMarkup(refs.listEl);
      cleanMarkup(refs.infoEl);
      Notiflix.Notify.failure('Oops, there is no country with that name');
      return [];
    });
}
function countryListMarkup(countries) {
  return countries
    .map(({ flags, name }) => {
      return `<li class="country-list__item">
        <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 50px height = 50px>
        <h2 class="country-list__name">${name.official}</h2>
    </li>`;
    })
    .join('');
}
function countryInfoMarkup(countries) {
  return countries
    .map(({ flags, name, capital, population, languages }) => {
      return `
    <img width="100px" height="100px" src='${flags.svg}' 
    alt='${name.official} flag' />
      <ul class="country-info__list">
          <li class="country-info__item">
          <p><b>Name: </b>${name.official}</p></li>
          <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
          <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
          <li class="country-info__item"><p><b>Languages: </b>${Object.values(
            languages
          )}</p></li>
      </ul>
      `;
    })
    .join();
}
