import ApiService from './pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

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
  loadMoreBtnHide();
  apiService.resetPage();
  apiService.query = evt.target.elements.searchQuery.value;
  if (apiService.query === '') {
    showNotification();
    return;
  }
  // Робимо запит на сервіс
  apiService
    .fetchImages()
    .then(({ hits, totalHits }) => {
      // Перевірка якщо пустий масив
      if (hits.length === 0) {
        showNotification();
        return;
      }
      renderCards(hits);
      showTotalHits(totalHits);
      loadMoreBtnShow();
    })
    .catch(error => {
      loadMoreBtnHide();
      console.log(error);
    });
}

function onLoadMoreClick() {
  apiService
    .fetchImages()
    .then(({ hits }) => renderCards(hits))
    .catch(error => {
      // Ховаємо кнопку і показуємо помилку
      loadMoreBtnHide();
      showError();
      console.log(error);
    });
}

function renderCards(arr) {
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

// Очищаємо сторінку
function resetGallery() {
  gallery.innerHTML = '';
}

// Повідомлення про помилку і TotalHits
function showNotification() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function showTotalHits(quantity) {
  Notify.success(`Hooray! We found ${quantity} images.`);
}

function showError() {
  Notify.failure(`We're sorry, but you've reached the end of search results.`);
}

// Дві функції для кнопки loadMoreBtn
function loadMoreBtnShow() {
  loadMore.hidden = false;
}

function loadMoreBtnHide() {
  loadMore.hidden = true;
}
// webformatURL - посилання на маленьке зображення для списку карток.
// largeImageURL - посилання на велике зображення.
// tags - рядок з описом зображення. Підійде для атрибуту alt.
// likes - кількість лайків.
// views - кількість переглядів.
// comments - кількість коментарів.
// downloads - кількість завантажень.
