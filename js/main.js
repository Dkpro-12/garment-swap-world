// Sample data for items
const itemsData = [
    {
        id: 1,
        title: "Vintage Denim Jacket",
        description: "Classic blue denim jacket in excellent condition",
        category: "tops",
        size: "M",
        condition: "Excellent",
        location: "New York, NY",
        user: "Sarah M.",
        image: "item1.jpg",
        badge: "Trending"
    },
    {
        id: 2,
        title: "Designer Evening Dress",
        description: "Black cocktail dress, worn once",
        category: "dresses",
        size: "S",
        condition: "Like New",
        location: "Los Angeles, CA",
        user: "Emma K.",
        image: "item2.jpg",
        badge: "Popular"
    },
    {
        id: 3,
        title: "Leather Ankle Boots",
        description: "Brown leather boots, perfect for fall",
        category: "accessories",
        size: "8",
        condition: "Good",
        location: "Chicago, IL",
        user: "Mike R.",
        image: "item3.jpg",
        badge: "New"
    },
    {
        id: 4,
        title: "Casual Cotton Sweater",
        description: "Cozy knit sweater in cream color",
        category: "tops",
        size: "L",
        condition: "Very Good",
        location: "Austin, TX",
        user: "Lisa H.",
        image: "item4.jpg",
        badge: "Featured"
    },
    {
        id: 5,
        title: "High-Waisted Jeans",
        description: "Dark wash skinny jeans, barely worn",
        category: "bottoms",
        size: "29",
        condition: "Excellent",
        location: "Miami, FL",
        user: "Alex T.",
        image: "item5.jpg",
        badge: "Hot"
    },
    {
        id: 6,
        title: "Silk Scarf Collection",
        description: "Set of 3 silk scarves in various patterns",
        category: "accessories",
        size: "One Size",
        condition: "Excellent",
        location: "Seattle, WA",
        user: "Grace W.",
        image: "item6.jpg",
        badge: "Bundle"
    }
];

// Current user state (for demo purposes)
let currentUser = null;
let currentFilter = 'all';

// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const itemsGrid = document.getElementById('items-grid');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadFeaturedItems();
    checkUserSession();
}

function setupEventListeners() {
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function switchModal(currentModalId, targetModalId) {
    closeModal(currentModalId);
    setTimeout(() => {
        openModal(targetModalId);
    }, 300);
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Simulate login process
    if (email && password) {
        currentUser = {
            id: 1,
            name: "John Doe",
            email: email,
            location: "New York, NY"
        };

        // Store user session
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Close modal and redirect
        closeModal('loginModal');
        showSuccessMessage('Login successful! Redirecting to dashboard...');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        showErrorMessage('Please fill in all fields');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const location = document.getElementById('registerLocation').value;

    // Simulate registration process
    if (name && email && password && location) {
        currentUser = {
            id: Date.now(),
            name: name,
            email: email,
            location: location
        };

        // Store user session
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Close modal and redirect
        closeModal('registerModal');
        showSuccessMessage('Account created successfully! Redirecting to dashboard...');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        showErrorMessage('Please fill in all fields');
    }
}

function checkUserSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateNavigationForLoggedInUser();
    }
}

function updateNavigationForLoggedInUser() {
    const navButtons = document.querySelector('.nav-buttons');
    if (navButtons && currentUser) {
        navButtons.innerHTML = `
            <button class="btn btn-outline" onclick="window.location.href='dashboard.html'">Dashboard</button>
            <button class="btn btn-primary" onclick="logout()">Logout</button>
        `;
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.reload();
}

function loadFeaturedItems() {
    if (!itemsGrid) return;
    
    // Show first 6 items for featured section
    const featuredItems = itemsData.slice(0, 6);
    displayItems(featuredItems);
}

function displayItems(items) {
    if (!itemsGrid) return;

    itemsGrid.innerHTML = '';
    
    items.forEach(item => {
        const itemCard = createItemCard(item);
        itemsGrid.appendChild(itemCard);
    });
}

function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.onclick = () => openItemDetail(item.id);
    
    card.innerHTML = `
        <div class="item-image">
            <div class="item-badge">${item.badge}</div>
        </div>
        <div class="item-info">
            <h3 class="item-title">${item.title}</h3>
            <p class="item-description">${item.description}</p>
            <div class="item-meta">
                <span>Size: ${item.size}</span>
                <span>${item.condition}</span>
            </div>
            <div class="item-meta">
                <span>${item.user}</span>
                <span>${item.location}</span>
            </div>
        </div>
    `;
    
    return card;
}

function filterItems(category) {
    currentFilter = category;
    
    // Update active category button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter and display items
    let filteredItems = itemsData;
    if (category !== 'all') {
        filteredItems = itemsData.filter(item => item.category === category);
    }
    
    displayItems(filteredItems);
}

function openItemDetail(itemId) {
    // Store the item ID and redirect to item detail page
    localStorage.setItem('selectedItemId', itemId);
    window.location.href = 'item-detail.html';
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function showSuccessMessage(message) {
    showToast(message, 'success');
}

function showErrorMessage(message) {
    showToast(message, 'error');
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Set background color based on type
    if (type === 'success') {
        toast.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    } else if (type === 'error') {
        toast.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
    } else {
        toast.style.background = 'linear-gradient(135deg, #2196F3, #1976D2)';
    }
    
    // Add to page
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Animation utilities
function animateOnScroll() {
    const elements = document.querySelectorAll('.step, .item-card, .hero-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', animateOnScroll);

// Search functionality
function searchItems(query) {
    const filteredItems = itemsData.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );
    
    displayItems(filteredItems);
}

// Export functions for use in other pages
window.ReWear = {
    itemsData,
    currentUser,
    getCurrentUser: () => currentUser,
    setCurrentUser: (user) => { currentUser = user; },
    showSuccessMessage,
    showErrorMessage,
    openModal,
    closeModal,
    logout,
    searchItems,
    displayItems,
    createItemCard
};