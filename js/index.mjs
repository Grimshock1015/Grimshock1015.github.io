import {minimizeImageForm, addImage} from './api.mjs';

const form = document.querySelector('.image-form');
const toggleBtn = document.getElementById('toggle-btn');

toggleBtn.addEventListener('click', function(e) {
    e.preventDefault();
    minimizeImageForm();
});

const imageFormButton = document.getElementById('image-form-button');

imageFormButton.addEventListener('submit', function(e) {
    const form_card = document.querySelector('.form-card');
    e.preventDefault();
    const title = document.getElementById('image-title').value;
    const author = document.getElementById('image-author').value;
    const url = document.getElementById('image-url').value; 
    form_card.reset();
    addImage(title, author, url);
})