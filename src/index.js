import ApiService from './pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const loadMore = document.querySelector('.load-more');
const apiService = new ApiService();

let lightbox = new SimpleLightbox('.gallery a');

form.addEventListener('submit', onFormSubmit);
loadMore.addEventListener('click', onLoadMoreClick);

function onFormSubmit(evt) {
  evt.preventDefault();
  // Очищаэмо галерею
  resetGallery();
  loadMoreBtnHide();
  apiService.resetPage();
  apiService.query = form.elements.searchQuery.value;
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
    .then(({ hits }) => {
      renderCards(hits);
      // Додаємо плавне прокручування
      const { height: cardHeight } =
        gallery.firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    })
    .catch(error => {
      // Ховаємо кнопку і показуємо помилку
      loadMoreBtnHide();
      showError();
      console.log(error);
    });
}

function renderCards(arr) {
  const cards = arr.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return `<div class="photo-card"><a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
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
  // Оновлення lightbox після рендеру карток
  lightbox.refresh();
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
