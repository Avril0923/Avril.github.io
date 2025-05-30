// Admin Panel JavaScript for Avril's Fairytale Website

document.addEventListener('DOMContentLoaded', function() {
    // Check login status
    checkLoginStatus();
    
    // Navigation
    setupNavigation();
    
    // Form handlers
    setupFormHandlers();
    
    // Quick action buttons
    setupQuickActions();
    
    // Load dashboard data
    loadDashboardData();
});

// Check if user is logged in
function checkLoginStatus() {
    // For demo purposes, show login modal by default
    // In production, this would check for a valid session
    const loginModal = document.getElementById('login-modal');
    loginModal.classList.add('active');
    
    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Send login request to API
        fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Login failed: ' + data.error);
            } else {
                // Hide login modal and load admin panel
                loginModal.classList.remove('active');
                loadAllSections();
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        });
    });
    
    // Handle logout
    document.getElementById('logout-btn').addEventListener('click', function() {
        fetch('/api/admin/logout', {
            method: 'POST'
        })
        .then(() => {
            // Redirect to home page
            window.location.href = '/';
        });
    });
}

// Setup navigation between sections
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    const sectionTitle = document.getElementById('section-title');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId) {
                    section.classList.add('active');
                    sectionTitle.textContent = this.textContent;
                }
            });
        });
    });
}

// Setup form handlers
function setupFormHandlers() {
    // Photo form
    setupSectionForm('photo');
    
    // Artwork form
    setupSectionForm('artwork');
    
    // Award form
    setupSectionForm('award');
    
    // Diary form
    setupSectionForm('diary');
    
    // Password change form
    document.getElementById('password-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        
        fetch('/api/admin/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Password change failed: ' + data.error);
            } else {
                alert('Password changed successfully!');
                document.getElementById('password-form').reset();
            }
        })
        .catch(error => {
            console.error('Password change error:', error);
            alert('Password change failed. Please try again.');
        });
    });
}

// Setup form for a specific section (photos, artwork, awards, diary)
function setupSectionForm(section) {
    const addBtn = document.getElementById(`add-${section}-section-btn`);
    const cancelBtn = document.getElementById(`cancel-${section}-btn`);
    const form = document.getElementById(`${section}-form`);
    const formContainer = document.getElementById(`${section}-upload-form`);
    const formTitle = document.getElementById(`${section}-form-title`);
    const fileInput = document.getElementById(`${section}-file`);
    const preview = document.getElementById(`${section}-preview`);
    
    // Show form when add button is clicked
    addBtn.addEventListener('click', function() {
        formTitle.textContent = `Add New ${section.charAt(0).toUpperCase() + section.slice(1)}`;
        form.reset();
        document.getElementById(`${section}-id`).value = '';
        if (preview) preview.innerHTML = '';
        formContainer.style.display = 'block';
        
        // Set default date to today
        const dateInput = document.getElementById(`${section}-date`);
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    });
    
    // Hide form when cancel button is clicked
    cancelBtn.addEventListener('click', function() {
        formContainer.style.display = 'none';
    });
    
    // Preview image when file is selected
    if (fileInput && preview) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    preview.innerHTML = '';
                    
                    if (this.files[0].type.includes('image')) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        preview.appendChild(img);
                    } else if (this.files[0].type === 'application/pdf') {
                        const div = document.createElement('div');
                        div.textContent = 'PDF Document';
                        div.style.padding = '1rem';
                        div.style.textAlign = 'center';
                        preview.appendChild(div);
                    }
                }.bind(this);
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        const id = document.getElementById(`${section}-id`).value;
        
        // Add form fields to FormData
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            if (field.type === 'file') {
                if (field.files.length > 0) {
                    formData.append('file', field.files[0]);
                }
            } else if (field.type === 'checkbox') {
                formData.append(field.id.replace(`${section}-`, ''), field.checked);
            } else if (field.id !== `${section}-id`) {
                formData.append(field.id.replace(`${section}-`, ''), field.value);
            }
        });
        
        // Determine API endpoint and method
        let url = `/api/${section}s`;
        let method = 'POST';
        
        if (id) {
            url = `/api/${section}s/${id}`;
            method = 'PUT';
        }
        
        // Send request to API
        fetch(url, {
            method: method,
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(`Error: ${data.error}`);
            } else {
                alert(`${section.charAt(0).toUpperCase() + section.slice(1)} saved successfully!`);
                formContainer.style.display = 'none';
                loadSectionData(section);
                loadDashboardData();
            }
        })
        .catch(error => {
            console.error(`${section} save error:`, error);
            alert(`Failed to save ${section}. Please try again.`);
        });
    });
}

// Setup quick action buttons
function setupQuickActions() {
    document.getElementById('add-photo-btn').addEventListener('click', function() {
        document.querySelector('.nav-link[data-section="photos"]').click();
        document.getElementById('add-photo-section-btn').click();
    });
    
    document.getElementById('add-artwork-btn').addEventListener('click', function() {
        document.querySelector('.nav-link[data-section="artwork"]').click();
        document.getElementById('add-artwork-section-btn').click();
    });
    
    document.getElementById('add-award-btn').addEventListener('click', function() {
        document.querySelector('.nav-link[data-section="awards"]').click();
        document.getElementById('add-award-section-btn').click();
    });
    
    document.getElementById('add-diary-btn').addEventListener('click', function() {
        document.querySelector('.nav-link[data-section="diary"]').click();
        document.getElementById('add-diary-section-btn').click();
    });
}

// Load dashboard data
function loadDashboardData() {
    fetch('/api/admin/status')
        .then(response => response.json())
        .then(data => {
            document.getElementById('photo-count').textContent = data.photos;
            document.getElementById('artwork-count').textContent = data.artworks;
            document.getElementById('award-count').textContent = data.awards;
            document.getElementById('diary-count').textContent = data.diary_entries;
            
            loadRecentUpdates();
        })
        .catch(error => {
            console.error('Dashboard data error:', error);
        });
}

// Load recent updates for dashboard
function loadRecentUpdates() {
    const updatesList = document.getElementById('recent-updates-list');
    updatesList.innerHTML = '<p class="loading-message">Loading recent updates...</p>';
    
    Promise.all([
        fetch('/api/photos').then(res => res.json()),
        fetch('/api/artworks').then(res => res.json()),
        fetch('/api/awards').then(res => res.json()),
        fetch('/api/diary-entries').then(res => res.json())
    ])
    .then(([photos, artworks, awards, diaryEntries]) => {
        // Combine and sort by date
        const allItems = [
            ...photos.map(p => ({...p, type: 'photo', date: new Date(p.date_added)})),
            ...artworks.map(a => ({...a, type: 'artwork', date: new Date(a.date_added)})),
            ...awards.map(a => ({...a, type: 'award', date: new Date(a.date_added)})),
            ...diaryEntries.map(d => ({...d, type: 'diary', date: new Date(d.date_added)}))
        ].sort((a, b) => b.date - a.date).slice(0, 5);
        
        updatesList.innerHTML = '';
        
        if (allItems.length === 0) {
            updatesList.innerHTML = '<p>No items added yet.</p>';
            return;
        }
        
        allItems.forEach(item => {
            const updateItem = document.createElement('div');
            updateItem.className = 'update-item';
            
            let typeText = '';
            let editUrl = '';
            
            switch(item.type) {
                case 'photo':
                    typeText = 'Photo';
                    editUrl = '#photos';
                    break;
                case 'artwork':
                    typeText = 'Artwork';
                    editUrl = '#artwork';
                    break;
                case 'award':
                    typeText = 'Award';
                    editUrl = '#awards';
                    break;
                case 'diary':
                    typeText = 'Diary Entry';
                    editUrl = '#diary';
                    break;
            }
            
            updateItem.innerHTML = `
                <div class="update-item-icon" style="background-image: url('/static/${item.filename || 'img/placeholder.jpg'}')"></div>
                <div class="update-item-content">
                    <div class="update-item-title">${typeText}: ${item.title}</div>
                    <div class="update-item-date">Added on ${new Date(item.date).toLocaleDateString()}</div>
                </div>
                <div class="update-item-actions">
                    <button class="btn btn-outline btn-icon edit-item" data-type="${item.type}" data-id="${item.id}">✏️</button>
                </div>
            `;
            
            updatesList.appendChild(updateItem);
        });
        
        // Add event listeners to edit buttons
        document.querySelectorAll('.edit-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                const id = this.getAttribute('data-id');
                
                // Navigate to appropriate section
                document.querySelector(`.nav-link[data-section="${type === 'photo' ? 'photos' : type === 'diary' ? 'diary' : type}"]`).click();
                
                // Load item for editing
                editItem(type, id);
            });
        });
    })
    .catch(error => {
        console.error('Recent updates error:', error);
        updatesList.innerHTML = '<p>Failed to load recent updates.</p>';
    });
}

// Load all section data
function loadAllSections() {
    loadSectionData('photo');
    loadSectionData('artwork');
    loadSectionData('award');
    loadSectionData('diary');
}

// Load data for a specific section
function loadSectionData(section) {
    const pluralSection = section === 'diary' ? 'diary-entries' : `${section}s`;
    const container = document.getElementById(`admin-${section === 'diary' ? 'diary-entries' : pluralSection}`);
    
    container.innerHTML = `<p class="loading-message">Loading ${pluralSection}...</p>`;
    
    fetch(`/api/${pluralSection}`)
        .then(response => response.json())
        .then(items => {
            container.innerHTML = '';
            
            if (items.length === 0) {
                container.innerHTML = `<p>No ${pluralSection} added yet.</p>`;
                return;
            }
            
            items.forEach(item => {
                const itemElement = createItemElement(section, item);
                container.appendChild(itemElement);
            });
            
            // If this is the diary section, populate theme filter
            if (section === 'diary') {
                populateThemeFilter(items);
            }
        })
        .catch(error => {
            console.error(`${section} data error:`, error);
            container.innerHTML = `<p>Failed to load ${pluralSection}.</p>`;
        });
}

// Create element for a gallery item
function createItemElement(section, item) {
    const element = document.createElement('div');
    element.className = 'gallery-item';
    
    let imageHtml = '';
    if (item.filename) {
        imageHtml = `
            <div class="gallery-item-image">
                <img src="/static/${item.filename}" alt="${item.title}">
            </div>
        `;
    }
    
    let dateField = '';
    switch(section) {
        case 'photo':
            dateField = 'date_taken';
            break;
        case 'artwork':
            dateField = 'date_created';
            break;
        case 'award':
            dateField = 'date_received';
            break;
        case 'diary':
            dateField = 'date_created';
            break;
    }
    
    let additionalInfo = '';
    if (section === 'diary') {
        additionalInfo = `<div class="gallery-item-theme">Theme: ${item.theme}</div>`;
    } else if (section === 'artwork' && item.medium) {
        additionalInfo = `<div class="gallery-item-medium">Medium: ${item.medium}</div>`;
    } else if (section === 'award' && item.issuer) {
        additionalInfo = `<div class="gallery-item-issuer">Issuer: ${item.issuer}</div>`;
    }
    
    element.innerHTML = `
        ${imageHtml}
        <div class="gallery-item-content">
            <div class="gallery-item-title">${item.title}</div>
            <div class="gallery-item-date">${new Date(item[dateField]).toLocaleDateString()}</div>
            ${additionalInfo}
            <div class="gallery-item-actions">
                <button class="btn btn-outline btn-icon edit-btn" data-id="${item.id}">✏️</button>
                <button class="btn btn-danger btn-icon delete-btn" data-id="${item.id}">🗑️</button>
            </div>
        </div>
    `;
    
    // Add event listeners
    element.querySelector('.edit-btn').addEventListener('click', function() {
        editItem(section, this.getAttribute('data-id'));
    });
    
    element.querySelector('.delete-btn').addEventListener('click', function() {
        deleteItem(section, this.getAttribute('data-id'));
    });
    
    return element;
}

// Edit an item
function editItem(section, id) {
    const pluralSection = section === 'diary' ? 'diary-entries' : `${section}s`;
    const formContainer = document.getElementById(`${section}-upload-form`);
    const form = document.getElementById(`${section}-form`);
    const formTitle = document.getElementById(`${section}-form-title`);
    const preview = document.getElementById(`${section}-preview`);
    
    fetch(`/api/${pluralSection}/${id}`)
        .then(response => response.json())
        .then(item => {
            // Set form title
            formTitle.textContent = `Edit ${section.charAt(0).toUpperCase() + section.slice(1)}`;
            
            // Set hidden ID field
            document.getElementById(`${section}-id`).value = item.id;
            
            // Fill form fields
            document.getElementById(`${section}-title`).value = item.title;
            
            if (document.getElementById(`${section}-description`)) {
                document.getElementById(`${section}-description`).value = item.description || '';
            }
            
            if (document.getElementById(`${section}-content`)) {
                document.getElementById(`${section}-content`).value = item.content || '';
            }
            
            // Handle date fields
            let dateField = '';
            switch(section) {
                case 'photo':
                    dateField = 'date_taken';
                    break;
                case 'artwork':
                    dateField = 'date_created';
                    break;
                case 'award':
                    dateField = 'date_received';
                    break;
                case 'diary':
                    dateField = 'date_created';
                    break;
            }
            
            if (document.getElementById(`${section}-date`)) {
                document.getElementById(`${section}-date`).value = item[dateField].split('T')[0];
            }
            
            // Handle section-specific fields
            if (section === 'photo' && document.getElementById('photo-featured')) {
                document.getElementById('photo-featured').checked = item.featured;
            }
            
            if (section === 'artwork' && document.getElementById('artwork-medium')) {
                document.getElementById('artwork-medium').value = item.medium || '';
            }
            
            if (section === 'award' && document.getElementById('award-issuer')) {
                document.getElementById('award-issuer').value = item.issuer || '';
            }
            
            if (section === 'diary' && document.getElementById('diary-theme')) {
                document.getElementById('diary-theme').value = item.theme || '';
            }
            
            // Show image preview if available
            if (preview && item.filename) {
                preview.innerHTML = '';
                
                if (item.filename.endsWith('.pdf')) {
                    const div = document.createElement('div');
                    div.textContent = 'PDF Document';
                    div.style.padding = '1rem';
                    div.style.textAlign = 'center';
                    preview.appendChild(div);
                } else {
                    const img = document.createElement('img');
                    img.src = `/static/${item.filename}`;
                    preview.appendChild(img);
                }
            }
            
            // Show form
            formContainer.style.display = 'block';
        })
        .catch(error => {
            console.error(`Edit ${section} error:`, error);
            alert(`Failed to load ${section} for editing.`);
        });
}

// Delete an item
function deleteItem(section, id) {
    const pluralSection = section === 'diary' ? 'diary-entries' : `${section}s`;
    const confirmModal = document.getElementById('confirm-modal');
    const confirmMessage = document.getElementById('confirm-message');
    const confirmBtn = document.getElementById('confirm-action-btn');
    const cancelBtn = document.getElementById('cancel-confirm-btn');
    
    // Set confirmation message
    confirmMessage.textContent = `Are you sure you want to delete this ${section}? This action cannot be undone.`;
    
    // Show confirmation modal
    confirmModal.classList.add('active');
    
    // Handle confirmation
    const confirmHandler = function() {
        fetch(`/api/${pluralSection}/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(`Error: ${data.error}`);
            } else {
                alert(`${section.charAt(0).toUpperCase() + section.slice(1)} deleted successfully!`);
                loadSectionData(section);
                loadDashboardData();
            }
            
            // Hide modal
            confirmModal.classList.remove('active');
            
            // Remove event listeners
            confirmBtn.removeEventListener('click', confirmHandler);
            cancelBtn.removeEventListener('click', cancelHandler);
        })
        .catch(error => {
            console.error(`Delete ${section} error:`, error);
            alert(`Failed to delete ${section}. Please try again.`);
            
            // Hide modal
            confirmModal.classList.remove('active');
            
            // Remove event listeners
            confirmBtn.removeEventListener('click', confirmHandler);
            cancelBtn.removeEventListener('click', cancelHandler);
        });
    };
    
    // Handle cancellation
    const cancelHandler = function() {
        confirmModal.classList.remove('active');
        
        // Remove event listeners
        confirmBtn.removeEventListener('click', confirmHandler);
        cancelBtn.removeEventListener('click', cancelHandler);
    };
    
    // Add event listeners
    confirmBtn.addEventListener('click', confirmHandler);
    cancelBtn.addEventListener('click', cancelHandler);
}

// Populate theme filter for diary entries
function populateThemeFilter(diaryEntries) {
    const themeFilter = document.getElementById('theme-filter');
    const themeList = document.getElementById('theme-list');
    
    // Get unique themes
    const themes = [...new Set(diaryEntries.map(entry => entry.theme))];
    
    // Clear existing options (except "All Themes")
    themeFilter.innerHTML = '<option value="">All Themes</option>';
    themeList.innerHTML = '';
    
    // Add theme options
    themes.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme;
        option.textContent = theme;
        themeFilter.appendChild(option);
        
        const dataOption = document.createElement('option');
        dataOption.value = theme;
        themeList.appendChild(dataOption);
    });
    
    // Add filter event listener
    themeFilter.addEventListener('change', function() {
        const selectedTheme = this.value;
        const diaryContainer = document.getElementById('admin-diary-entries');
        
        if (selectedTheme === '') {
            // Show all entries
            diaryContainer.querySelectorAll('.gallery-item').forEach(item => {
                item.style.display = 'block';
            });
        } else {
            // Filter entries by theme
            diaryContainer.querySelectorAll('.gallery-item').forEach(item => {
                const itemTheme = item.querySelector('.gallery-item-theme').textContent.replace('Theme: ', '');
                item.style.display = itemTheme === selectedTheme ? 'block' : 'none';
            });
        }
    });
}
