import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const searchParams = new URLSearchParams({
  key: '40504298-48a8820d7aa83aae1666f868d',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: 200,
});

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    // Формуємо рядок запиту: URL + пошук + параметри + сторінка пагінації
    const requestUrl = `${URL}?q=${this.searchQuery}&${searchParams}&page=${this.page}`;
    const response = await axios.get(requestUrl);
    // Збільшуємо сторінку пагінації
    this.incrementPage();

    return response.data;
  }

  incrementPage() {
    this.page += 1;
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
