/**
 * Maketh Vision — Core Application Logic
 * Handles Authentication, Story Management, and UI interactions
 * Powered by Supabase
 */

// 1. Initialize Supabase
const SUPABASE_URL = 'https://pairbjcztchlwpenzxbi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhaXJiamN6dGNobHdwZW56eGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NDAxNTgsImV4cCI6MjA5MzMxNjE1OH0.FqfvjpUzuOeRnVRba3GKPqtjtdr0kV4Si_uYt1Jh4Gg';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Global State
let currentUser = null;
let currentProfile = null;
let categories = [];
let allStories = [];
let filteredStories = [];
let currentPage = 'home';

// 3. UI Selectors
const elements = {
    // Nav & Auth
    authArea: document.getElementById('auth-area'),
    userArea: document.getElementById('user-area'),
    loginBtn: document.getElementById('login-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    userMenuBtn: document.getElementById('user-menu-btn'),
    userDropdown: document.getElementById('user-dropdown'),
    userInitial: document.getElementById('user-initial'),
    dropdownUsername: document.getElementById('dropdown-username'),
    dropdownEmail: document.getElementById('dropdown-email'),

    // Modals
    authModal: document.getElementById('auth-modal'),
    modalClose: document.getElementById('modal-close'),
    authTabs: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    loginForm: document.getElementById('login-form'),
    registerForm: document.getElementById('register-form'),
    otpForm: document.getElementById('otp-form'),
    sendOtpBtn: document.getElementById('send-otp-btn'),
    otpStep1: document.getElementById('otp-step-1'),
    otpStep2: document.getElementById('otp-step-2'),
    authMessage: document.getElementById('auth-message'),

    // Pages
    pages: document.querySelectorAll('.page'),
    navLinks: document.querySelectorAll('.nav-link, [data-page]'),
    
    // Grids & Containers
    categoriesGrid: document.getElementById('categories-grid'),
    featuredStories: document.getElementById('featured-stories'),
    allStoriesGrid: document.getElementById('all-stories'),
    categoryFilter: document.getElementById('category-filter'),
    storyDetail: document.getElementById('story-detail'),
    
    // Upload
    uploadForm: document.getElementById('upload-form'),
    uploadGate: document.getElementById('upload-gate'),
    uploadLimit: document.getElementById('upload-limit'),
    uploadCounter: document.getElementById('upload-counter'),
    thumbDrop: document.getElementById('thumb-drop'),
    thumbInput: document.getElementById('thumb-input'),
    fileDrop: document.getElementById('file-drop'),
    fileInput: document.getElementById('file-input'),
    thumbPreview: document.getElementById('thumb-preview-area'),
    filePreview: document.getElementById('file-preview-area'),
    uploadProgressWrap: document.getElementById('upload-progress-wrap'),
    uploadProgress: document.getElementById('upload-progress'),
    progressText: document.getElementById('progress-text'),

    // Search
    searchToggle: document.getElementById('search-toggle'),
    searchOverlay: document.getElementById('search-overlay'),
    searchInput: document.getElementById('search-input'),
    searchClose: document.getElementById('search-close'),

    // Profile
    profileUsername: document.getElementById('profile-username'),
    profileEmail: document.getElementById('profile-email'),
    profileJoined: document.getElementById('profile-joined'),
    profileAvatar: document.getElementById('profile-avatar'),
    myStoriesGrid: document.getElementById('my-stories'),
    likedStoriesGrid: document.getElementById('liked-stories'),
    savedStoriesGrid: document.getElementById('saved-stories'),

    // Toast
    toastContainer: document.getElementById('toast-container')
};

// 4. Initialization
async function init() {
    setupEventListeners();
    await checkSession();
    await fetchCategories();
    await fetchStories();
    renderCategories();
    renderStories();
    handleDeepLinking();
}

// 5. Auth Logic
async function checkSession() {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (session) {
        currentUser = session.user;
        await fetchProfile();
        updateUIForAuth(true);
    } else {
        updateUIForAuth(false);
    }
}

async function fetchProfile() {
    if (!currentUser) return;
    const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
    
    if (data) {
        currentProfile = data;
        updateProfileUI();
    }
}

function updateUIForAuth(isAuthenticated) {
    if (isAuthenticated) {
        elements.authArea.classList.add('hidden');
        elements.userArea.classList.remove('hidden');
        elements.userInitial.textContent = currentProfile?.username?.[0].toUpperCase() || currentUser.email[0].toUpperCase();
        elements.dropdownUsername.textContent = currentProfile?.username || 'User';
        elements.dropdownEmail.textContent = currentUser.email;
        elements.uploadGate.classList.add('hidden');
        elements.uploadForm.classList.remove('hidden');
    } else {
        elements.authArea.classList.remove('hidden');
        elements.userArea.classList.add('hidden');
        elements.uploadGate.classList.remove('hidden');
        elements.uploadForm.classList.add('hidden');
    }
}

// 6. Data Fetching
async function fetchCategories() {
    const { data, error } = await supabaseClient.from('categories').select('*').order('name');
    if (data) {
        categories = data;
        // Populate category select in upload form
        const catSelect = document.getElementById('story-category');
        if (catSelect) {
            catSelect.innerHTML = '<option value="">Select a category</option>' + 
                categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        }
    }
}

async function fetchStories() {
    const { data, error } = await supabaseClient
        .from('stories')
        .select('*, categories(name, icon)')
        .order('created_at', { ascending: false });
    if (data) {
        allStories = data;
        filteredStories = [...allStories];
    }
}

// 7. Rendering
function renderCategories() {
    if (!elements.categoriesGrid) return;
    elements.categoriesGrid.innerHTML = categories.map(cat => `
        <div class="category-card" data-slug="${cat.slug}">
            <div class="category-icon">${cat.icon || '📚'}</div>
            <h3 class="category-name">${cat.name}</h3>
        </div>
    `).join('');

    // Render filter bar in All Stories page
    if (elements.categoryFilter) {
        elements.categoryFilter.innerHTML = `
            <button class="filter-chip active" data-id="all">All</button>
            ${categories.map(cat => `<button class="filter-chip" data-id="${cat.id}">${cat.name}</button>`).join('')}
        `;
    }
}

function renderStories() {
    if (elements.featuredStories) {
        const latest = allStories.slice(0, 4);
        elements.featuredStories.innerHTML = latest.map(s => createStoryCard(s)).join('');
        document.getElementById('featured-empty').classList.toggle('hidden', latest.length > 0);
    }

    if (elements.allStoriesGrid) {
        elements.allStoriesGrid.innerHTML = filteredStories.map(s => createStoryCard(s)).join('');
        document.getElementById('stories-empty').classList.toggle('hidden', filteredStories.length > 0);
    }

    if (currentUser && elements.myStoriesGrid) {
        const myStories = allStories.filter(s => s.user_id === currentUser.id);
        elements.myStoriesGrid.innerHTML = myStories.map(s => createStoryCard(s, true)).join('');
        document.getElementById('my-stories-empty').classList.toggle('hidden', myStories.length > 0);
        elements.uploadCounter.textContent = `Stories: ${myStories.length} / 12`;
        if (myStories.length >= 12) {
            elements.uploadForm.classList.add('hidden');
            elements.uploadLimit.classList.remove('hidden');
        }
    }
}

function createStoryCard(story, isProfileView = false) {
    const category = story.categories?.name || 'Uncategorized';
    return `
        <div class="story-card" data-id="${story.id}">
            <div class="story-thumb">
                <img src="${story.thumbnail_url}" alt="${story.title}" loading="lazy">
                <div class="story-badge">${category}</div>
            </div>
            <div class="story-info">
                <h3 class="story-title">${story.title}</h3>
                <p class="story-meta">
                    <span>👁️ ${story.views_count}</span>
                    <span>❤️ ${story.likes_count}</span>
                    <span>📄 ${story.file_type.toUpperCase()}</span>
                </p>
                ${isProfileView ? `
                    <div class="story-actions">
                        <button class="btn btn-ghost btn-sm delete-story" data-id="${story.id}">🗑️ Delete</button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// 8. Navigation Logic
function navigateTo(pageId) {
    elements.pages.forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`page-${pageId}`);
    if (target) {
        target.classList.add('active');
        currentPage = pageId;
        window.scrollTo(0, 0);
        
        // Update Nav Links
        elements.navLinks.forEach(link => {
            if (link.dataset.page === pageId) link.classList.add('active');
            else link.classList.remove('active');
        });

        // Specific Page logic
        if (pageId === 'profile') renderStories();
    }
}

// 9. Event Listeners
function setupEventListeners() {
    // Nav clicks
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page) navigateTo(page);
        });
    });

    // Logo click
    document.getElementById('logo-btn').addEventListener('click', () => navigateTo('home'));

    // Auth Modals
    elements.loginBtn?.addEventListener('click', () => {
        elements.authModal.classList.remove('hidden');
        switchAuthTab('login');
    });

    elements.modalClose?.addEventListener('click', () => {
        elements.authModal.classList.add('hidden');
    });

    elements.authTabs.forEach(tab => {
        tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab));
    });

    // Form Submissions
    elements.loginForm?.addEventListener('submit', handleLogin);
    elements.registerForm?.addEventListener('submit', handleRegister);
    elements.otpForm?.addEventListener('submit', handleVerifyOTP);
    elements.sendOtpBtn?.addEventListener('click', handleSendOTP);

    // User Menu
    elements.userMenuBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.userDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
        elements.userDropdown?.classList.add('hidden');
    });

    elements.logoutBtn?.addEventListener('click', handleLogout);

    // Search
    elements.searchToggle?.addEventListener('click', () => elements.searchOverlay.classList.remove('hidden'));
    elements.searchClose?.addEventListener('click', () => elements.searchOverlay.classList.add('hidden'));
    elements.searchInput?.addEventListener('input', handleSearch);

    // Story Detail Clicks
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.story-card');
        if (card && !e.target.classList.contains('delete-story')) {
            showStoryDetail(card.dataset.id);
        }
        
        if (e.target.classList.contains('delete-story')) {
            handleDeleteStory(e.target.dataset.id);
        }
    });

    document.getElementById('back-to-stories')?.addEventListener('click', () => navigateTo('stories'));

    // Upload File Handling
    elements.thumbDrop?.addEventListener('click', () => elements.thumbInput.click());
    elements.fileDrop?.addEventListener('click', () => elements.fileInput.click());
    
    elements.thumbInput?.addEventListener('change', (e) => handleFileSelection(e, 'thumb'));
    elements.fileInput?.addEventListener('change', (e) => handleFileSelection(e, 'file'));

    elements.uploadForm?.addEventListener('submit', handleUpload);

    // Category Filters
    elements.categoryFilter?.addEventListener('click', (e) => {
        const chip = e.target.closest('.filter-chip');
        if (!chip) return;
        
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        
        const catId = chip.dataset.id;
        if (catId === 'all') filteredStories = [...allStories];
        else filteredStories = allStories.filter(s => s.category_id == catId);
        
        renderStories();
    });
}

// 10. Auth Handlers
function switchAuthTab(tabName) {
    elements.authTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
    elements.tabContents.forEach(c => c.classList.toggle('active', c.id === `tab-${tabName}`));
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) showAuthMessage(error.message, 'error');
    else {
        showAuthMessage('Sign in successful!', 'success');
        setTimeout(() => {
            elements.authModal.classList.add('hidden');
            location.reload();
        }, 1000);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    
    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { username } }
    });

    if (error) showAuthMessage(error.message, 'error');
    else {
        showAuthMessage('Check your email for confirmation!', 'success');
    }
}

async function handleLogout() {
    await supabaseClient.auth.signOut();
    location.reload();
}

function showAuthMessage(msg, type) {
    elements.authMessage.textContent = msg;
    elements.authMessage.className = `auth-message ${type}`;
    elements.authMessage.classList.remove('hidden');
}

// 11. Upload Handlers
function handleFileSelection(e, type) {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'thumb') {
        if (!file.type.startsWith('image/')) return showToast('Please select an image', 'error');
        const reader = new FileReader();
        reader.onload = (e) => {
            elements.thumbPreview.innerHTML = `<img src="${e.target.result}" style="max-height: 150px; border-radius: 8px;">`;
        };
        reader.readAsDataURL(file);
    } else {
        elements.filePreview.innerHTML = `<div class="file-info">📄 ${file.name} (${(file.size/1024/1024).toFixed(2)}MB)</div>`;
    }
}

async function handleUpload(e) {
    e.preventDefault();
    if (!currentUser) return showToast('Please sign in first', 'error');

    const title = document.getElementById('story-title').value;
    const categoryId = document.getElementById('story-category').value;
    const desc = document.getElementById('story-desc').value;
    const thumbFile = elements.thumbInput.files[0];
    const storyFile = elements.fileInput.files[0];

    if (!thumbFile || !storyFile) return showToast('Please select both files', 'error');

    try {
        elements.uploadProgressWrap.classList.remove('hidden');
        updateProgress(10, 'Uploading thumbnail...');

        // 1. Upload Thumbnail
        const thumbExt = thumbFile.name.split('.').pop();
        const thumbPath = `${currentUser.id}/${Date.now()}_thumb.${thumbExt}`;
        const { data: thumbData, error: thumbErr } = await supabaseClient.storage
            .from('thumbnails')
            .upload(thumbPath, thumbFile);
        if (thumbErr) throw thumbErr;

        updateProgress(40, 'Uploading story file...');

        // 2. Upload Story File
        const fileExt = storyFile.name.split('.').pop();
        const storyPath = `${currentUser.id}/${Date.now()}_story.${fileExt}`;
        const { data: storyData, error: storyErr } = await supabaseClient.storage
            .from('stories')
            .upload(storyPath, storyFile);
        if (storyErr) throw storyErr;

        updateProgress(70, 'Finalizing story details...');

        // 3. Save to Database
        const thumbUrl = `${SUPABASE_URL}/storage/v1/object/public/thumbnails/${thumbPath}`;
        const storyUrl = `${SUPABASE_URL}/storage/v1/object/public/stories/${storyPath}`;

        const { error: dbErr } = await supabaseClient.from('stories').insert({
            user_id: currentUser.id,
            title,
            description: desc,
            category_id: categoryId,
            thumbnail_url: thumbUrl,
            file_url: storyUrl,
            file_type: fileExt,
            file_name: storyFile.name,
            file_size: storyFile.size
        });

        if (dbErr) throw dbErr;

        updateProgress(100, 'Success!');
        showToast('Story published successfully!', 'success');
        setTimeout(() => location.reload(), 1500);

    } catch (err) {
        console.error(err);
        showToast(err.message, 'error');
        elements.uploadProgressWrap.classList.add('hidden');
    }
}

function updateProgress(val, text) {
    elements.uploadProgress.style.width = `${val}%`;
    elements.progressText.textContent = text;
}

// 12. Helper Functions
function showToast(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = msg;
    elements.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

function handleSearch(e) {
    const term = e.target.value.toLowerCase();
    filteredStories = allStories.filter(s => s.title.toLowerCase().includes(term));
    renderStories();
}

async function showStoryDetail(id) {
    const story = allStories.find(s => s.id === id);
    if (!story) return;

    // Increment view count
    await supabaseClient.rpc('increment_view_count', { story_uuid: id });

    navigateTo('detail');
    elements.storyDetail.innerHTML = `
        <div class="detail-container">
            <div class="detail-hero">
                <img src="${story.thumbnail_url}" alt="${story.title}">
                <div class="detail-overlay"></div>
                <div class="detail-content">
                    <span class="detail-cat">${story.categories?.name || 'Story'}</span>
                    <h1>${story.title}</h1>
                    <p class="detail-stats">👁️ ${story.views_count + 1} Views • ❤️ ${story.likes_count} Likes</p>
                </div>
            </div>
            <div class="detail-body glass-card">
                <h3>About this story</h3>
                <p>${story.description || 'No description provided.'}</p>
                <div class="detail-actions">
                    <a href="${story.file_url}" target="_blank" class="btn btn-primary">📖 Read Story</a>
                    <button class="btn btn-outline like-btn" data-id="${story.id}">❤️ Like</button>
                    <button class="btn btn-outline save-btn" data-id="${story.id}">🔖 Save</button>
                </div>
            </div>
        </div>
    `;
}

async function handleDeleteStory(id) {
    if (!confirm('Are you sure you want to delete this story?')) return;
    
    const { error } = await supabaseClient.from('stories').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else {
        showToast('Story deleted', 'success');
        location.reload();
    }
}

function handleDeepLinking() {
    const hash = window.location.hash.substring(1);
    if (hash && ['home', 'stories', 'upload', 'profile'].includes(hash)) {
        navigateTo(hash);
    }
}

// Start the app
init();
