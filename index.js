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
        locationRating.id = `rating-${location.id}`;
        loadAvgRating(location, locationRating);
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
            topRating.id = 'top-rating';
            loadAvgRating(location, topRating);
            loadReviews(rightTopContainer, location);
            leftTopContainer.append(topImage)
            rightTopContainer.append(topLocation, topRating)
            renderReviewForm(rightTopContainer, location);
            topContainer.append(leftTopContainer, rightTopContainer)
            mainContainer.insertBefore(topContainer, mainContainer.firstChild)
        })
    })

}


function loadReviews(container, location) {
    fetch(`${url}/locations/${location.id}`)
    .then(resp => resp.json())
    .then(location => {
        const h5 = document.createElement('h5');
        h5.id = 'reviews-header';
        h5.textContent = 'Reviews:';
        container.append(h5);
        location.reviews.forEach(review => {
            renderReview(h5, review);
        })
    })
}

function renderReview(header, review) {
    const rating = document.createElement('div');
    const comment = document.createElement('div');
    rating.textContent = `${review.rating}/10`;
    comment.textContent = `"${review.content}"`;
    header.append(rating, comment);
}

function loadAvgRating(location, locationRating) {
    let avg = 0;
    fetch(`${url}/locations/${location.id}`)
    .then(resp => resp.json())
    .then(location => {
        let sum = 0;
        if(location.reviews.length > 0) {
            for(review of location.reviews) {
            sum += review.rating;
            }
            avg = Math.round((sum/location.reviews.length) * 10) / 10;
            locationRating.textContent = 'Rating: ' + avg + '/10';
        } else {
            locationRating.textContent = 'No Reviews. Add a Review!';
        }
    })
}

function renderReviewForm(container, location) {
    const form = document.createElement('form');
    form.id = 'review-form';

    const rating = document.createElement('input');
    rating.id = 'rating-input';
    rating.type = 'number';
    rating.min = 0;
    rating.max = 10;

    const comment = document.createElement('input');
    comment.id = 'comment-input';
    comment.placeholder = 'Enter a review!' 

    const submit = document.createElement('input');
    submit.type = 'submit';

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const newReview = {
            locationId: location.id,
            rating: parseInt(rating.value),
            content: comment.value
        }
        console.log(newReview)
        fetch(`${url}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newReview)
        }).then(resp => resp.json())
        .then(data => {
            const h5 = document.querySelector('#reviews-header');
            const topRating = document.querySelector('#top-rating');
            const bottomRating = document.querySelector(`#rating-${location.id}`);
            renderReview(h5, newReview);
            loadAvgRating(location, topRating);
            loadAvgRating(location, bottomRating);
        })

        form.reset();
    })

    form.append(rating, comment, submit);
    container.append(form);
}