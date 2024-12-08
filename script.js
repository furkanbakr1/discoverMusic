// ================ 1. MÜZİK ÇALAR SINIFI ================
class AudioPlayer {
    constructor() {
        this.audio = new Audio();
        this.queue = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.volume = 1.0;
        this.isShuffled = false;
        this.repeatMode = 'none'; // none, one, all
        
        this.initializeElements();
        this.initializeEventListeners();
    }

    initializeElements() {
        this.playButton = document.getElementById('play');
        this.progressBar = document.querySelector('.progress');
        this.currentTimeEl = document.querySelector('.current-time');
        this.durationEl = document.querySelector('.duration');
        this.volumeSlider = document.querySelector('.volume-slider');
    }

    initializeEventListeners() {
        this.audio.addEventListener('ended', () => this.handleSongEnd());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        
        this.playButton?.addEventListener('click', () => this.togglePlay());
        this.volumeSlider?.addEventListener('input', (e) => this.setVolume(e.target.value));
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.audio.play();
        this.isPlaying = true;
        this.playButton.textContent = '⏸';
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.playButton.textContent = '▶';
    }

    updateProgress() {
        if (!this.progressBar) return;
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressBar.style.width = `${progress}%`;
        this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
    }

    updateDuration() {
        if (!this.durationEl) return;
        this.durationEl.textContent = this.formatTime(this.audio.duration);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    setVolume(value) {
        this.volume = value;
        this.audio.volume = value;
    }

    handleSongEnd() {
        switch(this.repeatMode) {
            case 'one': this.audio.play(); break;
            case 'all': this.playNext(); break;
            default:
                if (this.currentIndex < this.queue.length - 1) {
                    this.playNext();
                }
        }
    }
}

// ================ 2. KİMLİK DOĞRULAMA VE FORM İŞLEMLERİ ================
class AuthManager {
    constructor() {
        this.initializeFormListeners();
    }

    initializeFormListeners() {
        document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signupForm')?.addEventListener('submit', (e) => this.handleSignup(e));
        
        // Sosyal medya butonları
        document.querySelectorAll('.social-login .btn, .social-signup .btn').forEach(button => {
            button.addEventListener('click', (e) => this.handleSocialAuth(e));
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!this.validateForm('loginForm')) return;
        
        try {
            showLoading();
            // API isteği burada yapılacak
            console.log('Login denemesi:', { email, password });
            await this.loginUser({ email, password });
        } catch (error) {
            console.error('Login hatası:', error);
        } finally {
            hideLoading();
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        
        if (!this.validateForm('signupForm')) return;
        
        try {
            showLoading();
            // API isteği burada yapılacak
            console.log('Kayıt denemesi:', { name, email, password });
            await this.registerUser({ name, email, password });
        } catch (error) {
            console.error('Kayıt hatası:', error);
        } finally {
            hideLoading();
        }
    }

    handleSocialAuth(e) {
        const button = e.currentTarget;
        if (button.querySelector('.fa-facebook')) {
            this.loginWithFacebook();
        } else if (button.querySelector('.fa-twitter')) {
            this.loginWithTwitter();
        } else if (button.querySelector('.fa-google')) {
            this.loginWithGoogle();
        }
    }

    // Sosyal medya login metodları
    loginWithFacebook() {
        console.log('Facebook ile giriş denemesi');
    }

    loginWithTwitter() {
        console.log('Twitter ile giriş denemesi');
    }

    loginWithGoogle() {
        console.log('Google ile giriş denemesi');
    }
}

// ================ 3. ÇALMA LİSTESİ YÖNETİMİ ================
class PlaylistManager {
    constructor() {
        this.playlists = JSON.parse(localStorage.getItem('playlists')) || [];
        this.initializeSortable();
    }

    createPlaylist(name) {
        const playlist = {
            id: Date.now(),
            name,
            songs: []
        };
        this.playlists.push(playlist);
        this.savePlaylists();
        return playlist;
    }

    addToPlaylist(playlistId, song) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        if (playlist && !playlist.songs.find(s => s.id === song.id)) {
            playlist.songs.push(song);
            this.savePlaylists();
        }
    }

    removeFromPlaylist(playlistId, songId) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        if (playlist) {
            playlist.songs = playlist.songs.filter(s => s.id !== songId);
            this.savePlaylists();
        }
    }

    savePlaylists() {
        localStorage.setItem('playlists', JSON.stringify(this.playlists));
    }

    initializeSortable() {
        // Drag and drop işlemleri burada
    }
}

// ================ 4. ARAMA VE FİLTRELEME ================
class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.searchSuggestions = document.getElementById('searchSuggestions');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.searchInput?.addEventListener('input', (e) => {
            this.debounce(() => this.handleSearch(e.target.value), 300)();
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.searchSuggestions.style.display = 'none';
            }
        });
    }

    async handleSearch(query) {
        if (query.length < 2) {
            this.searchSuggestions.style.display = 'none';
            return;
        }

        try {
            const results = await this.fetchSearchResults(query);
            this.displayResults(results);
        } catch (error) {
            console.error('Arama hatası:', error);
        }
    }

    async fetchSearchResults(query) {
        // Örnek veri - gerçek uygulamada API'den gelecek
        return musicDatabase.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            (item.artist && item.artist.toLowerCase().includes(query.toLowerCase()))
        );
    }

    displayResults(results) {
        if (results.length === 0) {
            this.searchSuggestions.style.display = 'none';
            return;
        }

        this.searchSuggestions.innerHTML = results.map(item => `
            <div class="suggestion-item" data-type="${item.type}" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="suggestion-info">
                    <div class="suggestion-name">${item.name}</div>
                    ${item.artist ? `<div class="suggestion-artist">${item.artist}</div>` : ''}
                    <div class="suggestion-type">${this.getTypeLabel(item.type)}</div>
                </div>
            </div>
        `).join('');

        this.searchSuggestions.style.display = 'block';
    }

    getTypeLabel(type) {
        const types = {
            'artist': 'Sanatçı',
            'song': 'Şarkı',
            'album': 'Albüm',
            'playlist': 'Çalma Listesi'
        };
        return types[type] || type;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}

// ================ 5. YARDIMCI FONKSİYONLAR ================
function showLoading() {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.remove();
    }
}

function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'Bu alan zorunludur');
            isValid = false;
        } else {
            clearError(input);
        }
    });

    return isValid;
}

function showError(input, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
    input.classList.add('error');
}

function clearError(input) {
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    input.classList.remove('error');
}

// ================ 6. UYGULAMA BAŞLATMA ================
document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = new AudioPlayer();
    const authManager = new AuthManager();
    const playlistManager = new PlaylistManager();
    const searchManager = new SearchManager();

    // Tema kontrolü
    document.getElementById('themeToggle')?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Hamburger menü kontrolü
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
});
