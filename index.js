const url = 'http://localhost:3000'

fetch (url + '/locations') 
    .then((response) => response.json())
    .then((data) => renderImages(data))

const mainContainer = document.querySelector('#main-container')

function renderImages(locations) {
    locations.forEach(location => {
        
        const imageContainer = document.createElement('div');
        imageContainer.className = `location-container`;
        const locationImage = document.createElement('img');
        locationImage.id = 'image-container-image'
        locationImage.src = location.img;
        const imageName = document.createElement('h2');
        imageName.textContent = location.name;
        const imageLocation = document.createElement('h4');
        imageLocation.textContent = location.city;
        const locationRating = document.createElement('h5');
        locationRating.className = 'location-rating';
        locationRating.id = `rating-${location.id}`;
        loadAvgRating(location, locationRating);
        imageContainer.append(locationImage, imageName, imageLocation, locationRating);
        mainContainer.append(imageContainer);

        imageContainer.addEventListener('click', function(e){
            const removeFromContainer = document.querySelector('#top-container');
            if(removeFromContainer !== null) {
                while(removeFromContainer.firstChild) {
                    removeFromContainer.removeChild(removeFromContainer.firstChild);
                }
            }
            window.scrollTo(top);
            const topContainer = document.createElement('div');
            topContainer.id = 'top-container';
            const leftTopContainer = document.createElement('div');
            leftTopContainer.id = 'left-top-container';
            const rightTopContainer = document.createElement('div');
            rightTopContainer.id = 'right-top-container';
            const topImage = document.createElement('img');
            topImage.id = 'top-container-image';
            topImage.src = location.img;
            const topLocationName = document.createElement('h2')
            topLocationName.textContent = location.name;
            const topLocation = document.createElement('h4');
            topLocation.textContent = location.city;
            const topRating = document.createElement('h5');
            topRating.id = 'top-rating';
            loadAvgRating(location, topRating);
            loadReviews(rightTopContainer, location);
            leftTopContainer.append(topImage)
            rightTopContainer.append(topLocationName, topLocation, topRating)
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
        const h4 = document.createElement('h4');
        h4.id = 'reviews-header';
        h4.textContent = 'Reviews:';
        container.append(h4);
        location.reviews.forEach(review => {
            renderReview(h4, review);
        })
    })
}

function renderReview(header, review) {
    const reviewContainer = document.createElement('div');
    const rating = document.createElement('h5');
    const comment = document.createElement('h5');
    rating.textContent = `${review.rating}/10`;
    comment.textContent = `"${review.content}"`;
    reviewContainer.append(rating, comment);
    header.append(reviewContainer);
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

const addLocationForm = document.querySelector('#add-location-form');

addLocationForm.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.querySelector('#name-input').value;
    const city = document.querySelector('#city-input').value;
    const img = document.querySelector('#img-input').value;

    const newLocation = {
        name,
        city,
        img
    }

    fetch(`${url}/locations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newLocation)
    }).then(resp => resp.json())
    .then(location => renderImages([location]))

    addLocationForm.reset();
})
