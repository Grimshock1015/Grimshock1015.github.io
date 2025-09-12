/*  ******* Data types *******
    image objects must have at least the following attributes:
        - (String) imageId 
        - (String) title
        - (String) author
        - (String) url
        - (Date) date

    comment objects must have the following attributes
        - (String) commentId
        - (String) imageId
        - (String) author
        - (String) content
        - (Date) date

****************************** */

export function minimizeImageForm() {
    const form = document.querySelector('.image-form');
    const body = form.querySelector('.image-form-body');
    if (form.classList.contains("collapsed")) {
        form.classList.remove("collapsed"); // I.E currently collapsed, so expand it
        const bodyHeight = body.scrollHeight;
        body.style.height = bodyHeight + "px";
        body.style.opacity = 1;
        body.style.padding = "15px";
        setTimeout(() => {
            body.style.height = "auto"; // reset to auto after transition
        }, 700);
    }
    else {
        form.classList.add("collapsed"); // I.E currently expanded, so collapse it
        const bodyHeight = body.scrollHeight;
        body.style.height = bodyHeight + "px";
        requestAnimationFrame(() => {
            body.style.height = "0";
            body.style.opacity = 0;
            body.style.padding = "0 15px 0 15px";
        });
    }

}

export function getImages() {
    return JSON.parse(localStorage.getItem('images') || '[]');
}

function saveImages(images) {
    localStorage.setItem('images',JSON.stringify(images));
}

function generateID() {
    return '_' + Math.random().toString(36).slice(2, 9);
}

// add an image to the gallery
export function addImage(title, author, url) {
    let images = getImages();
    const imageID = generateID();
    const newImage = {
        imageId: imageID,
        title: title,
        author: author,
        url: url,
        date: new Date()
    };
    images.push(newImage);
    localStorage.setItem('images', JSON.stringify(images));
}

// delete an image from the gallery given its imageId
export function deleteImage(imageId) {
    let images = getImages();
    images = images.filter(image => image.imageId !== imageId);
    saveImages(images);
}

// add a comment to an image
export function addComment(imageId, author, content) {
    let comments = JSON.parse(localStorage.getItem('comments') || '[]');
    const commentId = generateID();
    const newComment = {
        commentId: commentId,
        imageId: imageId,
        author: author,
        content: content,
        date: new Date()
    }
    comments.push(newComment);
    localStorage.setItem('comments', JSON.stringify(comments));
}

// delete a comment to an image
export function deleteComment(commentId) {
    let comments = JSON.parse(localStorage.getItem('comments') || '[]');
    comments = comments.filter(comment => comment.commentId !== commentId);
    localStorage.setItem('comments', JSON.stringify(comments));
}
