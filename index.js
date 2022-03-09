const url = 'http://localhost:3000'

fetch (url + '/locations') 
    .then((response) => response.json())
    .then((data) => renderImages(data))

const mainContainer = document.querySelector('#main-container')

function renderImages(locations) {
    locations.forEach(location => {
        
        const imageContainer = document.createElement('div');
        imageContainer.id = `location-${location.id}`;
        const locationImage = document.createElement('img');
        locationImage.id = 'image-container-image'
        locationImage.src = location.img;
        const imageLocation = document.createElement('h2');
        imageLocation.textContent = location.city;
        const locationRating = document.createElement('h3');
        locationRating.textContent = 'Rating: ' + location.rating + '/10';
        imageContainer.append(locationImage, imageLocation, locationRating);
        mainContainer.append(imageContainer);

        imageContainer.addEventListener('click', function(e){
            const removeFromContainer = document.querySelector('#top-container');
            if(removeFromContainer !== null) {
                while(removeFromContainer.firstChild) {
                    removeFromContainer.removeChild(removeFromContainer.firstChild);
                }
            }
            const topContainer = document.createElement('div');
            topContainer.id = 'top-container';
            const leftTopContainer = document.createElement('div');
            leftTopContainer.id = 'left-top-container';
            const rightTopContainer = document.createElement('div');
            rightTopContainer.id = 'right-top-container';
            const topImage = document.createElement('img');
            topImage.id = 'top-container-image';
            topImage.src = location.img;
            const topLocation = document.createElement('h2');
            topLocation.textContent = location.city;
            const topRating = document.createElement('h3');
            topRating.textContent = 'Rating: ' + location.rating + '/10';
            loadComments(rightTopContainer, location);
            leftTopContainer.append(topImage)
            rightTopContainer.append(topLocation, topRating)
            topContainer.append(leftTopContainer, rightTopContainer)
            mainContainer.insertBefore(topContainer, mainContainer.firstChild)
        })
    })

}


function loadComments(container, location) {
    fetch(`${url}/locations/${location.id}`)
    .then(resp => resp.json())
    .then(location => {
        const ul = document.createElement('ul');
        ul.textContent = 'Comments:';
        container.append(ul);
        location.comments.forEach(comment => {
            renderComment(ul, comment);
        })
    })
}

function renderComment(ul, comment) {
    const commentToAppend = document.createElement('li');
    commentToAppend.textContent = `"${comment.content}"`;
    ul.append(commentToAppend);
}