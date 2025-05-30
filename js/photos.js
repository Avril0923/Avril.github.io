// Photos Page JavaScript for Avril's Fairytale Website

document.addEventListener('DOMContentLoaded', function() {
    // Load photos from API
    loadPhotos();
    
    // Setup lightbox functionality
    setupLightbox();
});

// Load photos from API
async function loadPhotos() {
    const galleryContainer = document.querySelector('.gallery-container');
    
    try {
        const response = await fetch('/api/photos');
        if (!response.ok) {
            throw new Error('Failed to load photos');
        }
        
        const photos = await response.json();
        
        if (photos.length === 0) {
            galleryContainer.innerHTML = '<p class="no-content">No photos have been added yet.</p>';
            return;
        }
        
        // Clear loading message
        galleryContainer.innerHTML = '';
        
        // Get unique years for timeline navigation
        const years = [...new Set(photos.map(photo => new Date(photo.date_taken).getFullYear()))].sort((a, b) => b - a);
        
        // Populate year selector
        const yearSelector = document.querySelector('.year-selector');
        years.forEach(year => {
            const yearBtn = document.createElement('button');
            yearBtn.className = 'year-btn';
            yearBtn.setAttribute('data-year', year);
            yearBtn.textContent = year;
            yearSelector.appendChild(yearBtn);
            
            // Add event listener
            yearBtn.addEventListener('click', function() {
                document.querySelectorAll('.year-btn').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                filterPhotosByYear(photos, this.getAttribute('data-year'));
            });
        });
        
        // Display all photos initially
        displayPhotos(photos);
        
        // Setup year filter functionality
        setupYearFilter(photos);
    } catch (error) {
        console.error('Error loading photos:', error);
        galleryContainer.innerHTML = '<p class="error-message">Failed to load photos. Please try again later.</p>';
    }
}

// Display photos in the gallery
function displayPhotos(photos) {
    const galleryContainer = document.querySelector('.gallery-container');
    galleryContainer.innerHTML = '';
    
    photos.forEach((photo, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-id', photo.id);
        galleryItem.setAttribute('data-index', index);
        
        const date = new Date(photo.date_taken);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        galleryItem.innerHTML = `
            <div class="gallery-image">
                <img src="/static/${photo.filename}" alt="${photo.title}">
            </div>
            <div class="gallery-info">
                <div class="gallery-title">${photo.title}</div>
                <div class="gallery-date">${formattedDate}</div>
            </div>
        `;
        
        // Add click event to open lightbox
        galleryItem.addEventListener('click', function() {
            openLightbox(photos, index);
        });
        
        galleryContainer.appendChild(galleryItem);
    });
}

// Filter photos by year
function filterPhotosByYear(photos, year) {
    if (year === 'all') {
        displayPhotos(photos);
        return;
    }
    
    const filteredPhotos = photos.filter(photo => {
        const photoYear = new Date(photo.date_taken).getFullYear().toString();
        return photoYear === year;
    });
    
    displayPhotos(filteredPhotos);
}

// Setup year filter functionality
function setupYearFilter(photos) {
    document.querySelectorAll('.year-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.year-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const year = this.getAttribute('data-year');
            filterPhotosByYear(photos, year);
        });
    });
}

// Setup lightbox functionality
function setupLightbox() {
    const lightbox = document.getElementById('photo-lightbox');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    
    // Close lightbox when close button is clicked
    closeBtn.addEventListener('click', function() {
        lightbox.classList.remove('active');
    });
    
    // Close lightbox when clicking outside the content
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
        }
    });
}

// Open lightbox with selected photo
function openLightbox(photos, index) {
    const lightbox = document.getElementById('photo-lightbox');
    const image = lightbox.querySelector('.lightbox-image');
    const title = lightbox.querySelector('.lightbox-title');
    const description = lightbox.querySelector('.lightbox-description');
    const date = lightbox.querySelector('.lightbox-date');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    // Set current photo
    const currentPhoto = photos[index];
    image.src = `/static/${currentPhoto.filename}`;
    image.alt = currentPhoto.title;
    title.textContent = currentPhoto.title;
    description.textContent = currentPhoto.description || '';
    
    const formattedDate = new Date(currentPhoto.date_taken).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    date.textContent = formattedDate;
    
    // Setup navigation buttons
    prevBtn.onclick = function(e) {
        e.stopPropagation();
        let prevIndex = index - 1;
        if (prevIndex < 0) prevIndex = photos.length - 1;
        openLightbox(photos, prevIndex);
    };
    
    nextBtn.onclick = function(e) {
        e.stopPropagation();
        let nextIndex = index + 1;
        if (nextIndex >= photos.length) nextIndex = 0;
        openLightbox(photos, nextIndex);
    };
    
    // Setup keyboard navigation
    document.onkeydown = function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    };
    
    // Show lightbox
    lightbox.classList.add('active');
}
