class Photo {
  constructor (id, title, caption, file, favorite) {
    this.id = id;
    this.title = title;
    this.caption = caption;
    this.file = file;
    this.favorite = favorite;
  }
  saveToStorage (photos) {
  if(photos.length){
    localStorage.setItem('photos', JSON.stringify(photos))
  } else{
    localStorage.setItem('photos', '');
  }
  }

  deleteFromStorage (photos, id){
    var index = photos.findIndex(function(photo){
      return id === photo.id;
    });
    photos.splice(index,1);
    this.saveToStorage(photos);
  }

  updatePhoto () {
    
  }
}