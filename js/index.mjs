import {minimizeImageForm, addImage, getImages, deleteImage, addComment, deleteComment} from './api.mjs';

const toggleBtn = document.getElementById('toggle-btn');
const imgTitle = document.getElementById('display-title');
const imgAuthor = document.getElementById('display-author');
const imgElement = document.getElementById('display-image');
const imageForm = document.getElementById('image-form');
const deleteBtn = document.getElementById('delete-btn');
const nextImageBtn = document.getElementById('next-image-btn');
const prevImageBtn = document.getElementById('prev-image-btn');
const commentForm = document.getElementById('comment-form');
const commentsSection = document.getElementById('comment-section');


toggleBtn.addEventListener('click', function(e) {
    e.preventDefault();
    minimizeImageForm();
});

imageForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('image-title').value.trim();
    const author = document.getElementById('image-author').value.trim();
    const url = document.getElementById('image-url').value.trim(); 
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
        nextImageBtn.style.display = 'none';
        prevImageBtn.style.display = 'none';
        commentsSection.style.display = 'none';
        commentForm.style.display = 'none';
        return;
    }

    // https://stackoverflow.com/questions/16125215/hide-conditionally-button-with-css-or-javascript

    const imageTitle = Images[currentIndex].title;
    const imageAuthor = Images[currentIndex].author;
    const imageURL = Images[currentIndex].url;

    imgTitle.textContent = imageTitle;
    imgAuthor.textContent = `By: ${imageAuthor}`;
    imgElement.style.display = 'block';
    imgElement.src = imageURL;
    commentsSection.style.display = 'block';
    deleteBtn.style.display = 'inline-block';
    nextImageBtn.style.display = 'inline-block';
    prevImageBtn.style.display = 'inline-block';
    commentForm.style.display = 'block';

    currentPage = 1; // Reset to first page of comments when image changes
    showComments(Images[currentIndex].imageId, currentPage);

}

deleteBtn.addEventListener('click', function(e) {
    e.preventDefault();
    let images = getImages();
    if (images.length === 0) {
        return; // No images to delete
    }
    const imageIdToDelete = images[currentIndex].imageId;
    let comments = JSON.parse(localStorage.getItem('comments') || '[]');
    comments = comments.filter(comment => comment.imageId !== imageIdToDelete); // Remove comments associated with the image
    localStorage.setItem('comments', JSON.stringify(comments));
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
});


let currentPage = 1;
const commentsPerPage = 10;

function showComments(imageId, page) {
    const commentsSection = document.getElementById('display-comments');
    commentsSection.innerHTML = ''; // Clear comments

    let comments = JSON.parse(localStorage.getItem('comments') || '[]');
    comments = comments.filter(comment => comment.imageId === imageId); // Only keep comments for this image

    if (comments.length === 0) {
        const commentContainerDiv = document.createElement('div');
        commentContainerDiv.className = 'comment-large-container';
        const noCommentsMsg = document.createElement('p');
        noCommentsMsg.className = 'comment-author';
        noCommentsMsg.textContent = 'No comments yet.';
        commentContainerDiv.appendChild(noCommentsMsg);
        commentsSection.appendChild(commentContainerDiv);
        return;
    }

    comments.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
    }); //https://stackoverflow.com/questions/10123953/how-to-sort-an-object-array-by-date-property

    const totalPages = Math.ceil(comments.length / commentsPerPage); // Gets total no. of pages possible
    currentPage = Math.min(Math.max(1, page), totalPages); // Ensure the range
    
    const start = (currentPage - 1) * commentsPerPage;  // Increses by 10
    const end = start + commentsPerPage;
    const commentsToShow = comments.slice(start, end);  // Does not contain end index

    for (const comment of commentsToShow) {
        const commentContainerDiv = document.createElement('div');
        commentContainerDiv.className = 'comment-large-container';

        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment-box';
        commentDiv.innerHTML = `
        <p class="comment-author">${comment.author}</p>
        <p class="comment-date">${new Date(comment.date).toLocaleDateString()}</p>
        <p class="comment-content">${comment.content}</p>`;

        const deleteCommentBtn = document.createElement('button');
        deleteCommentBtn.textContent = 'X';

        deleteCommentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            deleteComment(comment.commentId);
            showComments(imageId, currentPage);
        });

        

        commentContainerDiv.appendChild(commentDiv);
        commentContainerDiv.appendChild(deleteCommentBtn);
        commentsSection.appendChild(commentContainerDiv);


    }

    const changepageDiv = document.createElement('div');
    changepageDiv.className = 'change-comment-row';

    const prevCommentPageBtn = document.createElement('button');
    prevCommentPageBtn.className = 'change-comment-row-prev';
    prevCommentPageBtn.textContent = 'Prev';
    if (currentPage === 1) {
        prevCommentPageBtn.disabled = true; // Disable if on first page
    }
    prevCommentPageBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentPage > 1){
            currentPage--;
            showComments(imageId, currentPage);
        }
    });

    const nextCommentPageBtn = document.createElement('button');
    nextCommentPageBtn.className = 'change-comment-row-next';
    nextCommentPageBtn.textContent = 'Next';
    if (currentPage === totalPages) {
        nextCommentPageBtn.disabled = true; // Disable if on last page
    }
    nextCommentPageBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentPage < totalPages){
            currentPage++;
            showComments(imageId, currentPage);
        }
    });
    changepageDiv.appendChild(prevCommentPageBtn);
    changepageDiv.appendChild(nextCommentPageBtn);
    commentsSection.appendChild(changepageDiv);
}


commentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const author = document.getElementById('comment-author-input').value.trim();
    const comment = document.getElementById('comment-input').value.trim();
    const images = getImages();
    if (images.length === 0) {
        return; // No images to comment on
    }
    const imageId = images[currentIndex].imageId;
    addComment(imageId, author, comment);
    commentForm.reset();
    currentPage = 1; // Reset to first comment page
    showComments(imageId, currentPage);
});

showImages(getImages());
