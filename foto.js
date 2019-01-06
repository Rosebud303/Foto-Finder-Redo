class Photo {
  constructor (id, title, caption, favorite) {
    this.id = id;
    this.title = title;
    this.caption = caption;
    // this.file = file;
    this.favorite = favorite;
  }
  saveToStorage (photos) {
    localStorage.setItem('photos', JSON.stringify(photos));
  }
  deleteFromStorage () {

  }
  updatePhoto () {
    
  }
}