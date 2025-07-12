// Dashboard functionality
let currentSection = 'overview';
let currentUser = null;
let userItems = [];
let userExchanges = [];
let userFavorites = [];
let conversations = [];

// Sample user items data
const sampleUserItems = [
    {
        id: 'user1',
        title: "Vintage Leather Jacket",
        description: "Classic brown leather jacket, well-maintained",
        category: "tops",
        size: "M",
        condition: "Excellent",
        status: "available",
        images: ["jacket1.jpg"],
        views: 45,
        likes: 12,
        createdAt: "2024-01-15"
    },
    {
        id: 'user2',
        title: "Designer Handbag",
        description: "Authentic designer handbag in perfect condition",
        category: "accessories",
        size: "One Size",
        condition: "Like New",
        status: "pending",
        images: ["bag1.jpg"],
        views: 89,
        likes: 23,
        createdAt: "2024-01-10"
    },
    {
        id: 'user3',
        title: "Summer Dress",
        description: "Floral print summer dress, perfect for warm weather",
        category: "dresses",
        size: "S",
        condition: "Very Good",
        status: "exchanged",
        images: ["dress1.jpg"],
        views: 67,
        likes: 18,
        createdAt: "2024-01-05"
    }
];

// Sample exchanges data
const sampleExchanges = [
    {
        id: 'ex1',
        myItem: "Designer Handbag",
        theirItem: "Vintage Scarf",
        otherUser: "Emma K.",
        status: "completed",
        date: "2024-01-20",
        images: ["bag1.jpg", "scarf1.jpg"]
    },
    {
        id: 'ex2',
        myItem: "Summer Dress",
        theirItem: "Casual Sneakers",
        otherUser: "Sarah M.",
        status: "pending",
        date: "2024-01-18",
        images: ["dress1.jpg", "sneakers1.jpg"]
    }
];

// Sample conversations data
const sampleConversations = [
    {
        id: 'conv1',
        name: "Emma K.",
        lastMessage: "Great! Let's meet tomorrow at 2 PM",
        time: "2 hours ago",
        unread: 2,
        avatar: "E"
    },
    {
        id: 'conv2',
        name: "Sarah M.",
        lastMessage: "Is the dress still available?",
        time: "1 day ago",
        unread: 0,
        avatar: "S"
    },
    {
        id: 'conv3',
        name: "Mike R.",
        lastMessage: "Thanks for the exchange!",
        time: "3 days ago",
        unread: 1,
        avatar: "M"
    }
];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser) {
        window.location.href = 'index.html';
        return;
    }

    currentUser = JSON.parse(savedUser);
    userItems = JSON.parse(localStorage.getItem('userItems')) || sampleUserItems;
    userExchanges = JSON.parse(localStorage.getItem('userExchanges')) || sampleExchanges;
    userFavorites = JSON.parse(localStorage.getItem('userFavorites')) || [];
    conversations = JSON.parse(localStorage.getItem('conversations')) || sampleConversations;

    setupDashboardEventListeners();
    updateUserInfo();
    showSection('overview');
}

function setupDashboardEventListeners() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Add item form
    const addItemForm = document.getElementById('addItemForm');
    if (addItemForm) {
        addItemForm.addEventListener('submit', handleAddItem);
    }

    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    // File upload
    const fileInput = document.getElementById('itemPhotos');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
}

function updateUserInfo() {
    if (!currentUser) return;

    // Update user name in various places
    const userNameElements = document.querySelectorAll('#userName, #welcomeName');
    userNameElements.forEach(element => {
        if (element) {
            element.textContent = currentUser.name.split(' ')[0]; // First name only
        }
    });

    // Update user location
    const userLocationElement = document.getElementById('userLocation');
    if (userLocationElement) {
        userLocationElement.textContent = currentUser.location;
    }

    // Update profile form
    updateProfileForm();
}

function updateProfileForm() {
    if (!currentUser) return;

    const nameInput = document.getElementById('profileName');
    const emailInput = document.getElementById('profileEmail');
    const locationInput = document.getElementById('profileLocation');

    if (nameInput) nameInput.value = currentUser.name;
    if (emailInput) emailInput.value = currentUser.email;
    if (locationInput) locationInput.value = currentUser.location;
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all sidebar links
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }

    // Add active class to corresponding sidebar link
    const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    currentSection = sectionId;

    // Load section-specific content
    switch (sectionId) {
        case 'overview':
            loadOverviewData();
            break;
        case 'my-items':
            loadMyItems();
            break;
        case 'exchanges':
            loadExchanges();
            break;
        case 'favorites':
            loadFavorites();
            break;
        case 'messages':
            loadMessages();
            break;
        case 'settings':
            // Settings are already loaded
            break;
    }
}

function loadOverviewData() {
    // Update stats
    document.getElementById('totalItems').textContent = userItems.length;
    document.getElementById('totalExchanges').textContent = userExchanges.filter(ex => ex.status === 'completed').length;
    document.getElementById('totalViews').textContent = userItems.reduce((total, item) => total + (item.views || 0), 0);
    document.getElementById('userRating').textContent = '4.8'; // Static for demo

    // Load recent activity
    loadRecentActivity();
}

function loadRecentActivity() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;

    const activities = [
        {
            icon: 'fas fa-heart',
            title: 'Your item received a like',
            description: 'Someone liked your "Vintage Leather Jacket"',
            time: '2 hours ago'
        },
        {
            icon: 'fas fa-comment',
            title: 'New message received',
            description: 'Emma K. sent you a message about an exchange',
            time: '4 hours ago'
        },
        {
            icon: 'fas fa-exchange-alt',
            title: 'Exchange completed',
            description: 'Successfully exchanged your "Summer Dress"',
            time: '1 day ago'
        },
        {
            icon: 'fas fa-plus',
            title: 'New item listed',
            description: 'You listed "Designer Handbag" for exchange',
            time: '2 days ago'
        }
    ];

    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
            </div>
            <div class="activity-time">${activity.time}</div>
        </div>
    `).join('');
}

function loadMyItems() {
    const myItemsGrid = document.getElementById('myItemsGrid');
    if (!myItemsGrid) return;

    myItemsGrid.innerHTML = userItems.map(item => `
        <div class="my-item-card">
            <div class="my-item-image">
                <div class="item-status ${item.status}">${formatStatus(item.status)}</div>
                <div class="item-actions">
                    <button class="action-btn" onclick="editItem('${item.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="deleteItem('${item.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="my-item-info">
                <h3 class="my-item-title">${item.title}</h3>
                <p class="my-item-description">${item.description}</p>
                <div class="my-item-meta">
                    <span>Size: ${item.size}</span>
                    <span>${item.condition}</span>
                </div>
                <div class="item-stats">
                    <span><i class="fas fa-eye"></i> ${item.views || 0} views</span>
                    <span><i class="fas fa-heart"></i> ${item.likes || 0} likes</span>
                    <span>Listed ${formatDate(item.createdAt)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function loadExchanges() {
    const exchangesList = document.getElementById('exchangesList');
    if (!exchangesList) return;

    exchangesList.innerHTML = userExchanges.map(exchange => `
        <div class="exchange-item">
            <div class="exchange-images">
                <div class="exchange-image"></div>
                <div class="exchange-image"></div>
            </div>
            <div class="exchange-details">
                <h3 class="exchange-title">${exchange.myItem} ↔ ${exchange.theirItem}</h3>
                <p class="exchange-subtitle">Exchange with ${exchange.otherUser}</p>
                <div class="exchange-meta">
                    <span>Date: ${formatDate(exchange.date)}</span>
                </div>
            </div>
            <div class="exchange-status ${exchange.status}">${formatStatus(exchange.status)}</div>
        </div>
    `).join('');
}

function loadFavorites() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    if (!favoritesGrid) return;

    // For demo, show some sample favorites
    const sampleFavorites = [
        {
            id: 'fav1',
            title: "Vintage Band T-Shirt",
            description: "Rare vintage band t-shirt in excellent condition",
            user: "Alex T.",
            image: "tshirt1.jpg"
        },
        {
            id: 'fav2',
            title: "Designer Jeans",
            description: "High-end designer jeans, barely worn",
            user: "Sarah M.",
            image: "jeans1.jpg"
        }
    ];

    favoritesGrid.innerHTML = `
        <div class="items-grid">
            ${sampleFavorites.map(item => `
                <div class="item-card" onclick="window.location.href='item-detail.html?id=${item.id}'">
                    <div class="item-image">
                        <div class="item-badge">Liked</div>
                    </div>
                    <div class="item-info">
                        <h3 class="item-title">${item.title}</h3>
                        <p class="item-description">${item.description}</p>
                        <div class="item-meta">
                            <span>By ${item.user}</span>
                            <span><i class="fas fa-heart" style="color: #e74c3c;"></i></span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function loadMessages() {
    const conversationsList = document.getElementById('conversationsList');
    if (!conversationsList) return;

    conversationsList.innerHTML = conversations.map(conversation => `
        <div class="conversation-item" onclick="openConversation('${conversation.id}')">
            <div class="conversation-avatar">${conversation.avatar}</div>
            <div class="conversation-details">
                <h3 class="conversation-name">${conversation.name}</h3>
                <p class="conversation-preview">${conversation.lastMessage}</p>
                <span class="conversation-time">${conversation.time}</span>
            </div>
            ${conversation.unread > 0 ? `<div class="unread-badge">${conversation.unread}</div>` : ''}
        </div>
    `).join('');
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

function editProfile() {
    showSection('settings');
    window.ReWear.closeModal('userDropdown');
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userItems');
    localStorage.removeItem('userExchanges');
    localStorage.removeItem('userFavorites');
    localStorage.removeItem('conversations');
    window.location.href = 'index.html';
}

function filterMyItems(status) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Filter items
    let filteredItems = userItems;
    if (status !== 'all') {
        filteredItems = userItems.filter(item => item.status === status);
    }

    // Update display
    const myItemsGrid = document.getElementById('myItemsGrid');
    if (myItemsGrid) {
        myItemsGrid.innerHTML = filteredItems.map(item => `
            <div class="my-item-card">
                <div class="my-item-image">
                    <div class="item-status ${item.status}">${formatStatus(item.status)}</div>
                    <div class="item-actions">
                        <button class="action-btn" onclick="editItem('${item.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn" onclick="deleteItem('${item.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="my-item-info">
                    <h3 class="my-item-title">${item.title}</h3>
                    <p class="my-item-description">${item.description}</p>
                    <div class="my-item-meta">
                        <span>Size: ${item.size}</span>
                        <span>${item.condition}</span>
                    </div>
                    <div class="item-stats">
                        <span><i class="fas fa-eye"></i> ${item.views || 0} views</span>
                        <span><i class="fas fa-heart"></i> ${item.likes || 0} likes</span>
                        <span>Listed ${formatDate(item.createdAt)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function handleAddItem(e) {
    e.preventDefault();

    const title = document.getElementById('itemTitle').value;
    const category = document.getElementById('itemCategory').value;
    const size = document.getElementById('itemSize').value;
    const condition = document.getElementById('itemCondition').value;
    const description = document.getElementById('itemDescription').value;
    const exchangePreferences = document.getElementById('exchangePreferences').value;

    if (!title || !category || !size || !condition || !description) {
        window.ReWear.showErrorMessage('Please fill in all required fields');
        return;
    }

    const newItem = {
        id: 'user' + Date.now(),
        title,
        category,
        size,
        condition,
        description,
        exchangePreferences,
        status: 'available',
        images: [],
        views: 0,
        likes: 0,
        createdAt: new Date().toISOString().split('T')[0]
    };

    userItems.unshift(newItem);
    localStorage.setItem('userItems', JSON.stringify(userItems));

    window.ReWear.closeModal('addItemModal');
    window.ReWear.showSuccessMessage('Item listed successfully!');

    // Reset form
    document.getElementById('addItemForm').reset();

    // Refresh current section if it's my-items
    if (currentSection === 'my-items') {
        loadMyItems();
    } else {
        loadOverviewData();
    }
}

function handleProfileUpdate(e) {
    e.preventDefault();

    const name = document.getElementById('profileName').value;
    const email = document.getElementById('profileEmail').value;
    const location = document.getElementById('profileLocation').value;
    const bio = document.getElementById('profileBio').value;

    if (!name || !email || !location) {
        window.ReWear.showErrorMessage('Please fill in all required fields');
        return;
    }

    // Update current user
    currentUser.name = name;
    currentUser.email = email;
    currentUser.location = location;
    currentUser.bio = bio;

    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Update UI
    updateUserInfo();

    window.ReWear.showSuccessMessage('Profile updated successfully!');
}

function handleFileUpload(e) {
    const files = e.target.files;
    if (files.length > 0) {
        window.ReWear.showSuccessMessage(`${files.length} file(s) selected`);
    }
}

function editItem(itemId) {
    const item = userItems.find(item => item.id === itemId);
    if (!item) return;

    // Pre-fill the add item form with existing data
    document.getElementById('itemTitle').value = item.title;
    document.getElementById('itemCategory').value = item.category;
    document.getElementById('itemSize').value = item.size;
    document.getElementById('itemCondition').value = item.condition;
    document.getElementById('itemDescription').value = item.description;
    document.getElementById('exchangePreferences').value = item.exchangePreferences || '';

    // Change form submission to update instead of add
    const form = document.getElementById('addItemForm');
    form.setAttribute('data-editing', itemId);

    window.ReWear.openModal('addItemModal');
}

function deleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        userItems = userItems.filter(item => item.id !== itemId);
        localStorage.setItem('userItems', JSON.stringify(userItems));
        
        window.ReWear.showSuccessMessage('Item deleted successfully');
        
        if (currentSection === 'my-items') {
            loadMyItems();
        } else {
            loadOverviewData();
        }
    }
}

function openConversation(conversationId) {
    // For demo purposes, just show a message
    window.ReWear.showSuccessMessage('Opening conversation... (Feature coming soon!)');
}

// Utility functions
function formatStatus(status) {
    const statusMap = {
        available: 'Available',
        pending: 'Pending',
        exchanged: 'Exchanged',
        completed: 'Completed',
        cancelled: 'Cancelled'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userDropdown');
    
    if (userMenu && dropdown && !userMenu.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

// Make functions available globally
window.showSection = showSection;
window.toggleUserMenu = toggleUserMenu;
window.editProfile = editProfile;
window.logout = logout;
window.filterMyItems = filterMyItems;
window.editItem = editItem;
window.deleteItem = deleteItem;
window.openConversation = openConversation;