import ApiService from './pixabay-api';

const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const loadMore = document.querySelector('.load-more');
const apiService = new ApiService();

form.addEventListener('submit', onFormSubmit);
loadMore.addEventListener('click', onLoadMoreClick);

function onFormSubmit(evt) {
  evt.preventDefault();
  // Очищаэмо галерею
  resetGallery();
  apiService.resetPage();
  apiService.query = evt.target.elements.searchQuery.value;
  if (apiService.query === '') {
    alert(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  console.log(
    `Шукаємо: ${apiService.query} cторінка пагінації ${apiService.page}`
  );

  apiService
    .fetchImages()
    .then(data => renderCards(data))
    .catch(error => console.log(error));
}

function onLoadMoreClick() {
  apiService
    .fetchImages()
    .then(data => renderCards(data))
    .catch(error => console.log(error));
}

function renderCards(arr) {
  // Перевірка якщо пустий масив
  if (arr.length === 0) {
    alert(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  const cards = arr.map(
    ({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`;
    }
  );

  gallery.insertAdjacentHTML('beforeend', cards.join(''));
}

function resetGallery() {
  gallery.innerHTML = '';
}
// webformatURL - посилання на маленьке зображення для списку карток.
// largeImageURL - посилання на велике зображення.
// tags - рядок з описом зображення. Підійде для атрибуту alt.
// likes - кількість лайків.
// views - кількість переглядів.
// comments - кількість коментарів.
// downloads - кількість завантажень.
