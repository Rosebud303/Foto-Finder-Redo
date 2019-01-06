var cardArea = document.querySelector('.card-area');
var addButton = document.querySelector('.add-button');
var titleInput = document.querySelector('#title-input');
var captionInput = document.querySelector('#caption-input');
var chooseImage = document.querySelector('#choose-input');
var searchInput = document.querySelector('#search-input');
var reader = new FileReader();
var photoArray = [];

addButton.disabled = true;

addButton.addEventListener('click', createPhoto);
captionInput.addEventListener('keyup', enableAddButton);
titleInput.addEventListener('keyup', enableAddButton);
searchInput.addEventListener('keyup', searchCards);

window.onload = loadFromLocalStorage();

function loadFromLocalStorage () {
  var doesHavePhotos = localStorage.getItem('photos');
  if(doesHavePhotos){
    JSON.parse(localStorage.getItem('photos')).forEach(function(photo){
      appendPhoto(photo);
      photoArray.push(photo);
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
  const newPhoto = new Photo (Date.now(), titleInput.value, captionInput.value, false);
  photoArray.push(newPhoto);
  newPhoto.saveToStorage(photoArray);
  appendPhoto(newPhoto);
}

function appendPhoto (photo) {
  var card = 
  `
    <section class="full-card" data-id="${photo.id}">
      <p class="card-title">${photo.title}</p>
      <p class="card-img">${photo.file}</p>
      <p class="card-caption">${photo.caption}</p>
      <article class="fav-del-area">
        <img src="#" class="delete">
        <img src="#" class="favorite">
      </article>
    </section>
  `
  cardArea.innerHTML = card + cardArea.innerHTML;
  clearInputs();
}