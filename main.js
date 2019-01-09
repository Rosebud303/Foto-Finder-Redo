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
cardArea.addEventListener('focusout', updateText);

window.onload = loadFromLocalStorage();

function loadFromLocalStorage () {
  var doesHavePhotos = localStorage.getItem('photos').length;
  if(doesHavePhotos){
    JSON.parse(localStorage.getItem('photos')).forEach(function(photo){
      var photo = new Photo(photo.id, photo.title, photo.caption, photo.file, photo.favorite)
      appendPhoto(photo);
      photoArray.push(photo);
      favoriteSaver(photo);
    });
  }
  checkCardArea();
}

function checkCardArea () {
  if(!photoArray.length){
    cardArea.innerHTML = 'Add a photo...'
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
  checkCardArea();
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

function favoredPhoto (photoFav,e) {
  let favPhoto = photoArray.find(function(photo) {
    return photoFav === photo.id
  });
  favPhoto.favorite = !favPhoto.favorite;
  if(favPhoto.favorite){
    e.target.attributes.src.textContent = 'images/favorite-active.svg';
  } else {
    e.target.attributes.src.textContent = 'images/favorite.svg';
  }
  favPhoto.saveToStorage(photoArray);
  favoriteIncrement(favPhoto);
}

function showFavorites (event) {
  event.preventDefault();
  cardArea.innerHTML = '';
  let filteredFavs = photoArray.filter(photoFav => photoFav.favorite === true);
  filteredFavs.forEach(function(filteredPhoto) {
    appendPhoto(filteredPhoto);
  });
  enableAddButton();
}

function findObj (objId) {
  for(var i = 0; i < objId.length; i++) {
    if (objId == photoArray[i].id)
      return photoArray[i];
  }
}

function updateText(event) {
  event.preventDefault();
  var photoId = event.target.parentElement.dataset.id;;
  var photoObj = findObj(photoId);
  if(event.target.classList.contains('card-title')) {
    photoObj.updatePhoto(event.target.innerText, 'card-title');
  } else {
    photoObj.updatePhoto(event.target.innerText, 'card-caption');
  }
    photoObj.saveToStorage(photoArray);
}

function appendPhoto (photo) {
  var card = 
  `
    <section class="full-card" data-id="${photo.id}">
      <p contenteditable="true" class="card-title">${photo.title}</p>
      <img class="card-img" src="${photo.file}"/>
      <p contenteditable="true" class="card-caption">${photo.caption}</p>
      <article class="fav-del-area">
        <img onclick="deleteCard(${photo.id})" src="images/delete.svg" class="delete">
        <img onclick="favoredPhoto(${photo.id},event)" src=${photo.favorite ? "images/favorite-active.svg" : 'images/favorite.svg'} class="favorite">
      </article>
    </section>
  `
  cardArea.innerHTML = card + cardArea.innerHTML;
  clearInputs();
}