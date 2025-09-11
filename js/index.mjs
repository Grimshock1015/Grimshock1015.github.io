import {minimizeImageForm, addImage, getImages, deleteImage} from './api.mjs';

const toggleBtn = document.getElementById('toggle-btn');
const imgTitle = document.getElementById('display-title');
const imgAuthor = document.getElementById('display-author');
const imgElement = document.getElementById('display-image');
const imageForm = document.getElementById('image-form');
const deleteBtn = document.getElementById('delete-btn');
const nextImageBtn = document.getElementById('next-image-btn');
const prevImageBtn = document.getElementById('prev-image-btn');

toggleBtn.addEventListener('click', function(e) {
    e.preventDefault();
    minimizeImageForm();
});

imageForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('image-title').value;
    const author = document.getElementById('image-author').value;
    const url = document.getElementById('image-url').value; 
    addImage(title, author, url);
    showImages(getImages());
    imageForm.reset();
})

let currentIndex = 0;

function showImages(Images) {
    if (Images.length === 0) {
        imgTitle.textContent = 'No Image Available';
        imgAuthor.textContent = '';
        imgElement.style.display = 'none';
        deleteBtn.style.display = 'none';
        return;
    }

    const imageTitle = Images[currentIndex].title;
    const imageAuthor = Images[currentIndex].author;
    const imageURL = Images[currentIndex].url;

    imgTitle.textContent = imageTitle;
    imgAuthor.textContent = `By: ${imageAuthor}`;
    imgElement.style.display = 'block';
    imgElement.src = imageURL;
    deleteBtn.style.display = 'inline-block';

}

deleteBtn.addEventListener('click', function(e) {
    e.preventDefault();
    let images = getImages();
    if (images.length === 0) {
        return; // No images to delete
    }
    const imageIdToDelete = images[currentIndex].imageId;
    deleteImage(imageIdToDelete);
    images = getImages();
    if (images.length === 0) {
        currentIndex = 0; // If empty, reset to 0
    }
    else if (currentIndex >= images.length) {
        currentIndex = images.length - 1; // Move to the last image if we deleted the last one
    }
    showImages(images);
});

nextImageBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const images = getImages();
    if (images.length === 0) {
        return; // No images
    }
    currentIndex = (currentIndex + 1) % images.length; // Make sure it is positive by adding the length, and cycles
    showImages(images);
});

prevImageBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const images = getImages();
    if (images.length === 0) {
        return; // No images
    }
    currentIndex = (currentIndex - 1 + images.length) % images.length; // Make sure it is positive by adding the length and cycles
    showImages(images);
    console.log('currentIndex:', currentIndex, 'url:', images[currentIndex].url);
});

showImages(getImages());