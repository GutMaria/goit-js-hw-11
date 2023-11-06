import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const searchParams = new URLSearchParams({
  key: '40504298-48a8820d7aa83aae1666f868d',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: 3,
  // page: 1,
});

// export default async function fetchImages(searchQuery) {
//   const query = searchQuery;
//   console.log(`Шукаємо ${query}`);

//   const response = await axios.get(`${URL}?q=${query}&${searchParams}`);
//   return response.data.hits;
// }

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    // Формуємо рядок запиту: URL + пошук + параметри + сторінка пагінації
    const requestUrl = `${URL}?q=${this.searchQuery}&${searchParams}&page=${this.page}`;
    const response = await axios.get(requestUrl);
    console.log(`Поточна пагінація сторінка - ${this.page}`);
    this.incrementPage();

    return response.data.hits;
  }

  incrementPage() {
    this.page += 1;
    console.log(`збільшили пагінацію на 1  буде= ${this.page}`);
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
