// AI Social Hub - Main Application JavaScript
class AISocialHub {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'dashboard';
        this.trendingReels = [];
        this.posts = [];
        this.init();
    }

    init() {
        this.loadTheme();
        this.checkAuthStatus();
        this.bindEvents();
        this.loadContent();
    }

    // Theme Management
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const themeToggle = document.querySelector('.theme-toggle');
        
        if (savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️';
            themeToggle.title = 'Switch to Light Mode';
        } else {
            themeToggle.textContent = '🌙';
            themeToggle.title = 'Switch to Dark Mode';
        }
    }

    toggleTheme() {
        const body = document.body;
        const themeToggle = document.querySelector('.theme-toggle');
        
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            themeToggle.textContent = '🌙';
            themeToggle.title = 'Switch to Dark Mode';
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️';
            themeToggle.title = 'Switch to Light Mode';
            localStorage.setItem('theme', 'dark');
        }
    }

    // Authentication
    checkAuthStatus() {
        const userData = localStorage.getItem('userData');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.showDashboard();
        } else {
            this.showLandingPage();
        }
    }

    async login(formData) {
        try {
            // In production, this would be an API call
            const response = await this.mockApiCall('/api/auth/login', {
                method: 'POST',
                body: formData
            });

            if (response.success) {
                this.currentUser = response.user;
                localStorage.setItem('userData', JSON.stringify(response.user));
                this.showDashboard();
                this.showWelcomeModal(response.user.name);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('userData');
        sessionStorage.clear();
        this.showLandingPage();
    }

    // Page Navigation
    showLandingPage() {
        document.getElementById('landingPage').style.display = 'flex';
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('sidebar').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'none';
    }

    showLoginPage() {
        document.getElementById('landingPage').style.display = 'none';
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('sidebar').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('landingPage').style.display = 'none';
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('sidebar').style.display = 'flex';
        document.getElementById('logoutBtn').style.display = 'flex';
        this.loadDashboardContent();
    }

    backToLanding() {
        this.showLandingPage();
    }

    // Content Loading
    async loadContent() {
        try {
            // Load trending reels
            const reelsResponse = await this.mockApiCall('/api/reels/trending');
            if (reelsResponse.success) {
                this.trendingReels = reelsResponse.data;
            }

            // Load posts
            const postsResponse = await this.mockApiCall('/api/posts');
            if (postsResponse.success) {
                this.posts = postsResponse.data;
            }
        } catch (error) {
            console.error('Content loading error:', error);
        }
    }

    loadDashboardContent() {
        const contentGrid = document.getElementById('contentGrid');
        if (!contentGrid) return;

        // Combine posts and reels for display
        const allContent = [
            ...this.posts.map(post => ({ ...post, type: 'post' })),
            ...this.trendingReels.slice(0, 6).map(reel => ({ ...reel, type: 'reel' }))
        ];

        contentGrid.innerHTML = allContent.map(item => this.createContentCard(item)).join('');
    }

    createContentCard(item) {
        const isPost = item.type === 'post';
        const authorInitial = (item.author || item.creator || 'U').charAt(0).toUpperCase();
        
        return `
            <div class="content-card" onclick="app.openContent('${item.id}', '${item.type}')">
                <div class="card-header">
                    <div class="card-author">
                        <div class="author-avatar">${authorInitial}</div>
                        <div class="author-info">
                            <h4>${item.author || item.creator}</h4>
                            <span>${item.timestamp || item.time}</span>
                        </div>
                    </div>
                    <div class="card-category">${item.category}</div>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-description">${item.description || item.content}</p>
                    <div class="card-media">
                        ${isPost ? '📄' : '🎬'}
                    </div>
                    <div class="card-stats">
                        <div class="stat-item">
                            <span>👁️</span>
                            <span>${item.views || (item.likes + ' likes')}</span>
                        </div>
                        ${isPost ? `
                            <div class="stat-item">
                                <span>💬</span>
                                <span>${item.comments}</span>
                            </div>
                            <div class="stat-item">
                                <span>🔄</span>
                                <span>${item.shares}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // Search Functionality
    async performSearch() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const categoryFilter = document.getElementById('categoryFilter').value;
        const timeFilter = document.getElementById('timeFilter').value;
        
        if (!searchTerm.trim() && categoryFilter === 'all' && timeFilter === 'all') {
            this.hideSearchResults();
            return;
        }

        try {
            const response = await this.mockApiCall(`/api/reels/trending?search=${searchTerm}&category=${categoryFilter}&time=${timeFilter}`);
            if (response.success) {
                this.displaySearchResults(response.data, searchTerm);
            }
        } catch (error) {
            console.error('Search error:', error);
        }
    }

    displaySearchResults(results, searchTerm) {
        const resultsContainer = document.getElementById('resultsContainer');
        const searchResults = document.getElementById('searchResults');
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="result-item">
                    <div class="result-title">No results found</div>
                    <div class="result-description">Try different keywords or filters</div>
                </div>
            `;
        } else {
            resultsContainer.innerHTML = results.map(reel => `
                <div class="result-item" onclick="app.openContent('${reel.id}', 'reel')">
                    <div class="result-title">${reel.title} • ${reel.views} views</div>
                    <div class="result-description">${reel.description}</div>
                </div>
            `).join('');
        }
        
        searchResults.classList.add('active');
    }

    hideSearchResults() {
        document.getElementById('searchResults').classList.remove('active');
    }

    searchByTag(tag) {
        document.getElementById('searchInput').value = tag;
        
        // Update tag states
        document.querySelectorAll('.trending-tag').forEach(tagEl => {
            tagEl.classList.remove('active');
        });
        event.target.classList.add('active');
        
        this.performSearch();
    }

    filterByCategory() {
        this.performSearch();
    }

    filterByTime() {
        this.performSearch();
    }

    // Content Actions
    openContent(id, type) {
        alert(`Opening ${type}: ${id}\n\nThis would navigate to the ${type} page in a full implementation.`);
    }

    // Modal Management
    showWelcomeModal(userName) {
        const modal = document.getElementById('welcomeModal');
        const message = document.getElementById('welcomeMessage');
        
        message.textContent = `Welcome ${userName}! You've successfully joined our AI-powered social media community. Explore personalized content, connect with like-minded people, and discover trending topics tailored just for you.`;
        
        modal.style.display = 'flex';
        
        // Auto close after 5 seconds
        setTimeout(() => {
            this.closeWelcomeModal();
        }, 5000);
    }

    closeWelcomeModal() {
        document.getElementById('welcomeModal').style.display = 'none';
    }

    // Event Binding
    bindEvents() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(loginForm);
                const userData = Object.fromEntries(formData);
                this.login(userData);
            });
        }

        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });

            // Debounced search
            let searchTimeout;
            searchInput.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => this.performSearch(), 300);
            });
        }

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });
    }

    navigateToPage(page) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');
        
        this.currentPage = page;
        // In a full implementation, this would load different page content
        console.log(`Navigating to ${page}`);
    }

    // Mock API calls (replace with real API in production)
    async mockApiCall(endpoint, options = {}) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // Mock data based on endpoint
        if (endpoint === '/api/auth/login') {
            return {
                success: true,
                user: {
                    id: 1,
                    name: options.body.name || 'User',
                    email: options.body.email || 'user@example.com',
                    age: options.body.age || 25,
                    gender: options.body.gender || 'prefer-not-to-say'
                }
            };
        }

        if (endpoint === '/api/posts') {
            return {
                success: true,
                data: [
                    {
                        id: 1,
                        title: "AI in Music: How algorithms compose symphonies that rival human creativity!",
                        content: "Our latest neural network can generate classical music that's indistinguishable from pieces by Mozart and Beethoven. The future of music composition is here! #AIMusic #TechInnovation",
                        author: "AI Research Lab",
                        timestamp: "2 hours ago",
                        category: "Technology",
                        likes: 1250,
                        comments: 89,
                        shares: 156
                    },
                    {
                        id: 2,
                        title: "Digital Art Revolution",
                        content: "Exploring the intersection of AI and creativity. These AI-generated artworks are pushing the boundaries of what we consider art.",
                        author: "Creative Studio",
                        timestamp: "5 hours ago",
                        category: "Art",
                        likes: 892,
                        comments: 67,
                        shares: 234
                    }
                ]
            };
        }

        if (endpoint.startsWith('/api/reels/trending')) {
            const url = new URL(endpoint, 'http://localhost');
            const search = url.searchParams.get('search') || '';
            const category = url.searchParams.get('category') || 'all';
            const time = url.searchParams.get('time') || 'all';

            let reels = [
                { id: 1, title: "AI Art Creation Tutorial", category: "tech", description: "Learn how to create stunning AI artwork using latest tools", time: "today", views: "2.5M", creator: "AI Research Lab" },
                { id: 2, title: "Dance Challenge #AIVibes", category: "dance", description: "The hottest dance trend taking over social media", time: "today", views: "5.2M", creator: "DanceStudio Pro" },
                { id: 3, title: "Tech Tips: Coding Shortcuts", category: "tech", description: "10 coding shortcuts every developer should know", time: "week", views: "1.8M", creator: "CodeMaster" },
                { id: 4, title: "Music Remix: Electronic Beats", category: "music", description: "Amazing electronic remix of popular songs", time: "today", views: "3.1M", creator: "BeatMaker Studio" },
                { id: 5, title: "Comedy Skit: Office Life", category: "comedy", description: "Hilarious take on modern office culture", time: "week", views: "4.7M", creator: "Comedy Central" },
                { id: 6, title: "Life Hacks: Productivity Tips", category: "lifestyle", description: "Simple hacks to boost your daily productivity", time: "month", views: "2.9M", creator: "Productivity Guru" },
                { id: 7, title: "Art Speed Drawing", category: "art", description: "Mesmerizing digital art creation process", time: "today", views: "1.5M", creator: "Digital Artist" },
                { id: 8, title: "Educational: Space Facts", category: "education", description: "Mind-blowing facts about our universe", time: "week", views: "2.2M", creator: "Space Explorer" },
                { id: 9, title: "Sports Highlights: Football", category: "sports", description: "Best goals and moments from recent matches", time: "today", views: "6.8M", creator: "Sports Network" },
                { id: 10, title: "Music Cover: Acoustic Session", category: "music", description: "Beautiful acoustic covers of trending songs", time: "month", views: "1.9M", creator: "Acoustic Sessions" }
            ];

            // Apply filters
            if (category !== 'all') {
                reels = reels.filter(reel => reel.category === category);
            }
            if (time !== 'all') {
                reels = reels.filter(reel => reel.time === time);
            }
            if (search) {
                reels = reels.filter(reel => 
                    reel.title.toLowerCase().includes(search) ||
                    reel.description.toLowerCase().includes(search) ||
                    reel.creator.toLowerCase().includes(search)
                );
            }

            return {
                success: true,
                data: reels
            };
        }

        return { success: false, message: 'Endpoint not found' };
    }

    // Google Login (mock)
    loginWithGoogle() {
        const userData = {
            id: Date.now(),
            name: 'Google User',
            email: 'user@gmail.com',
            age: 25,
            gender: 'prefer-not-to-say'
        };
        
        this.currentUser = userData;
        localStorage.setItem('userData', JSON.stringify(userData));
        this.showDashboard();
        this.showWelcomeModal(userData.name);
    }
}

// Initialize the application
const app = new AISocialHub();

// Global functions for HTML onclick handlers
function toggleTheme() {
    app.toggleTheme();
}

function showLoginPage() {
    app.showLoginPage();
}

function backToLanding() {
    app.backToLanding();
}

function logout() {
    app.logout();
}

function performSearch() {
    app.performSearch();
}

function filterByCategory() {
    app.filterByCategory();
}

function filterByTime() {
    app.filterByTime();
}

function searchByTag(tag) {
    app.searchByTag(tag);
}

function hideSearchResults() {
    app.hideSearchResults();
}

function showDashboard() {
    app.showDashboard();
}

function closeWelcomeModal() {
    app.closeWelcomeModal();
}

function loginWithGoogle() {
    app.loginWithGoogle();
}
