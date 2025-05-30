// Main JavaScript for Avril's Fairytale Website

// Fairy dust cursor effect
document.addEventListener('DOMContentLoaded', function() {
    const fairyCursor = document.querySelector('.fairy-cursor');
    
    document.addEventListener('mousemove', function(e) {
        fairyCursor.style.left = e.clientX + 'px';
        fairyCursor.style.top = e.clientY + 'px';
        
        // Create fairy dust particles on mouse movement
        if (Math.random() > 0.9) {
            createFairyDustParticle(e.clientX, e.clientY);
        }
    });
    
    // Hide cursor when mouse leaves window
    document.addEventListener('mouseout', function() {
        fairyCursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseover', function() {
        fairyCursor.style.opacity = '1';
    });
    
    // Carousel functionality
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Handle index wrapping
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        slides[index].classList.add('active');
        currentSlide = index;
    }
    
    // Initialize carousel
    showSlide(0);
    
    // Set up carousel controls
    prevButton.addEventListener('click', () => {
        showSlide(currentSlide - 1);
    });
    
    nextButton.addEventListener('click', () => {
        showSlide(currentSlide + 1);
    });
    
    // Auto-advance carousel
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
    
    // Fetch latest content from API
    fetchLatestContent();
});

// Create fairy dust particles
function createFairyDustParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'fairy-dust-particle';
    
    // Random size
    const size = Math.random() * 8 + 2;
    
    // Random color
    const colors = ['#FFD1DC', '#E6E6FA', '#87CEEB', '#FFDF00'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Style the particle
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.position = 'fixed';
    particle.style.borderRadius = '50%';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9998';
    particle.style.opacity = '0.8';
    particle.style.boxShadow = `0 0 ${size}px ${color}`;
    
    // Add to body
    document.body.appendChild(particle);
    
    // Animate and remove
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed - 2; // Slight upward bias
    
    let opacity = 0.8;
    let posX = x;
    let posY = y;
    
    const animate = () => {
        posX += dx;
        posY += dy;
        opacity -= 0.01;
        
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.opacity = opacity;
        
        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();
        }
    };
    
    requestAnimationFrame(animate);
}

// Fetch latest content from API
async function fetchLatestContent() {
    try {
        // Fetch latest photos for carousel
        const photosResponse = await fetch('/api/photos');
        if (photosResponse.ok) {
            const photos = await photosResponse.json();
            updateCarousel(photos);
        }
        
        // Fetch latest updates for the updates section
        const updatesContainer = document.querySelector('.updates-container');
        if (updatesContainer) {
            // Clear placeholder content
            updatesContainer.innerHTML = '';
            
            // Get latest photos, artwork, and awards
            const [photos, artworks, awards] = await Promise.all([
                fetch('/api/photos').then(res => res.json()),
                fetch('/api/artworks').then(res => res.json()),
                fetch('/api/awards').then(res => res.json())
            ]);
            
            // Combine and sort by date
            const allItems = [
                ...photos.map(p => ({...p, type: 'photo', date: new Date(p.date_added)})),
                ...artworks.map(a => ({...a, type: 'artwork', date: new Date(a.date_added)})),
                ...awards.map(a => ({...a, type: 'award', date: new Date(a.date_added)}))
            ].sort((a, b) => b.date - a.date).slice(0, 4);
            
            // Create update cards
            allItems.forEach(item => {
                const card = createUpdateCard(item);
                updatesContainer.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error fetching content:', error);
    }
}

// Update carousel with actual photos
function updateCarousel(photos) {
    const carouselContainer = document.querySelector('.carousel-container');
    if (!carouselContainer || photos.length === 0) return;
    
    // Clear existing slides
    carouselContainer.innerHTML = '';
    
    // Get featured photos first, or use the most recent ones
    const displayPhotos = photos.filter(p => p.featured).length > 0 
        ? photos.filter(p => p.featured).slice(0, 5)
        : photos.slice(0, 5);
    
    // Create slides
    displayPhotos.forEach((photo, index) => {
        const slide = document.createElement('div');
        slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
        
        const img = document.createElement('img');
        img.src = `/static/${photo.filename}`;
        img.alt = photo.title;
        
        slide.appendChild(img);
        carouselContainer.appendChild(slide);
    });
}

// Create update card for latest updates section
function createUpdateCard(item) {
    const card = document.createElement('div');
    card.className = 'update-card';
    
    const imageDiv = document.createElement('div');
    imageDiv.className = 'update-image';
    
    const img = document.createElement('img');
    img.src = `/static/${item.filename}`;
    img.alt = item.title;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'update-content';
    
    const title = document.createElement('h3');
    let typeText = '';
    let linkUrl = '';
    
    switch(item.type) {
        case 'photo':
            typeText = 'New Photo';
            linkUrl = `/photos#${item.id}`;
            break;
        case 'artwork':
            typeText = 'New Artwork';
            linkUrl = `/artwork#${item.id}`;
            break;
        case 'award':
            typeText = 'New Achievement';
            linkUrl = `/awards#${item.id}`;
            break;
    }
    
    title.textContent = `${typeText}: ${item.title}`;
    
    const desc = document.createElement('p');
    desc.textContent = item.description || 'Click to view more details';
    
    const date = document.createElement('span');
    date.className = 'update-date';
    date.textContent = new Date(item.date).toLocaleDateString();
    
    // Assemble the card
    imageDiv.appendChild(img);
    contentDiv.appendChild(title);
    contentDiv.appendChild(desc);
    contentDiv.appendChild(date);
    
    card.appendChild(imageDiv);
    card.appendChild(contentDiv);
    
    // Make the whole card clickable
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
        window.location.href = linkUrl;
    });
    
    return card;
}
