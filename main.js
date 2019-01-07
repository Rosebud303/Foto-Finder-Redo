var cardArea = document.querySelector('.card-area');
var addButton = document.querySelector('.add-button');
var titleInput = document.querySelector('#title-input');
var captionInput = document.querySelector('#caption-input');
var chooseImage = document.querySelector('#choose-input');
var searchInput = document.querySelector('#search-input');
var favoriteCounter = document.querySelector('.favorite-counter');
var viewFavorites = document.querySelector('.favorite-button');
var reader = new FileReader();
var photoArray = [];
var favoriteNum = 0;


addButton.disabled = true;

addButton.addEventListener('click', createElement);
captionInput.addEventListener('keyup', enableAddButton);
titleInput.addEventListener('keyup', enableAddButton);
searchInput.addEventListener('keyup', searchCards);
viewFavorites.addEventListener('click', showFavorites);

window.onload = loadFromLocalStorage();

function loadFromLocalStorage () {
  var doesHavePhotos = localStorage.getItem('photos').length;
  console.log(doesHavePhotos)
  if(doesHavePhotos){
    JSON.parse(localStorage.getItem('photos')).forEach(function(photo){
      appendPhoto(photo);
      photo = new Photo(photo.id, photo.title, photo.caption, photo.file, photo.favorite)
      photoArray.push(photo);
      favoriteSaver(photo);
    });
  }
}

function searchCards () {
  var search = searchInput.value.toUpperCase();
  var filteredPhotos = photoArray.filter(function(photo) {
    var upperCaseTitle = photo.title.toUpperCase();
    var upperCaseCaption = photo.caption.toUpperCase();
    return  upperCaseCaption.includes(search) || upperCaseTitle.includes(search);
  });
  cardArea.innerHTML = '';
  filteredPhotos.forEach(function(filteredPhoto) {
    appendPhoto(filteredPhoto);
  });
}

function createElement() {
  if (chooseImage.files[0]) {
    reader.readAsDataURL(chooseImage.files[0]); 
    reader.onload = createPhoto;
  }
}

function clearInputs () {
  titleInput.value = '';
  captionInput.value = '';
  enableAddButton();
}

function enableAddButton () {
  var shouldDisable = titleInput.value == '' || captionInput.value == '';
  addButton.disabled = shouldDisable;
}

function createPhoto (event) {
  event.preventDefault();
  const newPhoto = new Photo (Date.now(), titleInput.value, captionInput.value, event.target.result, false);
  photoArray.push(newPhoto);
  newPhoto.saveToStorage(photoArray);
  appendPhoto(newPhoto);
}

function deleteCard (id) {
  var cardElement = document.querySelector(`.full-card[data-id="${id}"]`);
  cardElement.remove();
  var deletedPhoto = photoArray.find((photo)=> {
    return id === photo.id;
  });
  deletedPhoto.deleteFromStorage(photoArray, deletedPhoto.id);
}

function favoriteIncrement (favAdder) {
  if (favAdder.favorite === true) {
    favoriteNum++
  } else {
    favoriteNum--
  }
  favoriteCounter.innerHTML = favoriteNum;
}

function favoriteSaver (fav) {
  if (fav.favorite === true) {
    favoriteNum++
  }
  favoriteCounter.innerHTML = favoriteNum;
}

function favoredPhoto (photoFav) {
  let favPhoto = photoArray.find(function(photo) {
    return photoFav === photo.id
  });
  favPhoto.favorite = !favPhoto.favorite;
  favPhoto.saveToStorage(photoArray);
  favoriteIncrement(favPhoto);
}

function showFavorites (event) {
  event.preventDefault();
  let filteredFavorites = photoArray.filter(function(photo) {
    return !photo.favorite;
  });
  filteredFavorites.forEach(function(card) {
    document.querySelector(`[data-id="${card.id}"]`).classList.add('hidden');
    console.log(document.querySelector(`[data-id="${card.id}"]`))
  });
}

function appendPhoto (photo) {
  var card = 
  `
    <section class="full-card" data-id="${photo.id}">
      <p class="card-title">${photo.title}</p>
      <img class="card-img" src="${photo.file}"/>
      <p class="card-caption">${photo.caption}</p>
      <article class="fav-del-area">
        <img onclick="deleteCard(${photo.id})" src="images/delete.svg" class="delete">
        <img onclick="favoredPhoto(${photo.id})" src="images/favorite.svg" class="favorite">
      </article>
    </section>
  `
  cardArea.innerHTML = card + cardArea.innerHTML;
  clearInputs();
}