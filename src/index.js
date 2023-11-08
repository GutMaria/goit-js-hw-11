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
  // Робимо запит на серв
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
  form.reset();
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
      <b>Likes </b>${likes}
    </p>
    <p class="info-item">
      <b>Views </b>${views}
    </p>
    <p class="info-item">
      <b>Comments </b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads </b>${downloads}
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
  loadMore.classList.remove('is-hidden');
}

function loadMoreBtnHide() {
  loadMore.classList.add('is-hidden');
}
// webformatURL - посилання на маленьке зображення для списку карток.
// largeImageURL - посилання на велике зображення.
// tags - рядок з описом зображення. Підійде для атрибуту alt.
// likes - кількість лайків.
// views - кількість переглядів.
// comments - кількість коментарів.
// downloads - кількість завантажень.
