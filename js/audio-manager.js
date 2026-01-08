class AudioManager {
    constructor() {
        this.audioContext = null;
        this.backgroundMusic = null;
        this.voiceIntro = null;
        this.isInitialized = false;
        this.backgroundPlaying = false;
        this.currentVolume = 0.25; // 25%
        
        this.init();
    }
    
    async init() {
        try {
            // ایجاد AudioContext
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // بارگذاری موسیقی پس‌زمینه
            this.backgroundMusic = new Audio('assets/audio/bg-music.mp3');
            this.backgroundMusic.loop = true;
            this.backgroundMusic.volume = this.currentVolume;
            this.backgroundMusic.preload = 'auto';
            
            // بارگذاری توضیحات صوتی
            this.voiceIntro = new Audio('assets/audio/voice-intro.mp3');
            this.voiceIntro.volume = 0.8;
            this.voiceIntro.preload = 'auto';
            
            this.isInitialized = true;
            console.log('✅ AudioManager initialized successfully');
            
        } catch (error) {
            console.error('❌ Audio initialization error:', error);
        }
    }
    
    playBackgroundMusic() {
        if (!this.isInitialized || !this.backgroundMusic) return;
        
        if (!this.backgroundPlaying) {
            this.backgroundMusic.play()
                .then(() => {
                    this.backgroundPlaying = true;
                    console.log('🎵 Background music started');
                })
                .catch(error => {
                    console.warn('Autoplay prevented:', error);
                    this.showAudioPermissionRequest();
                });
        }
    }
    
    stopBackgroundMusic() {
        if (this.backgroundMusic && this.backgroundPlaying) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            this.backgroundPlaying = false;
        }
    }
    
    playVoiceIntro() {
        if (!this.isInitialized || !this.voiceIntro) return;
        
        // اگر در حال پخش هست، متوقفش کن
        this.voiceIntro.pause();
        this.voiceIntro.currentTime = 0;
        
        // پخش کن
        this.voiceIntro.play()
            .then(() => {
                console.log('🎤 Voice intro playing');
            })
            .catch(error => {
                console.error('Error playing voice:', error);
            });
    }
    
    setVolume(percent) {
        const volume = Math.max(0, Math.min(1, percent / 100));
        this.currentVolume = volume;
        
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = volume;
        }
        
        if (this.voiceIntro) {
            this.voiceIntro.volume = Math.min(0.8, volume * 2);
        }
        
        console.log(`Volume set to: ${Math.round(volume * 100)}%`);
        return Math.round(volume * 100);
    }
    
    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
    
    showAudioPermissionRequest() {
        const overlay = document.createElement('div');
        overlay.className = 'audio-permission-overlay';
        overlay.innerHTML = `
            <div class="permission-box">
                <h3><i class="fas fa-volume-up"></i> نیاز به اجازه صدا</h3>
                <p>برای تجربه کامل واقعیت افزوده، نیاز به اجازه پخش صدا داریم.</p>
                <p>لطفاً بر روی دکمه زیر کلیک کنید.</p>
                <button id="allow-audio-btn" class="btn-primary">
                    <i class="fas fa-check"></i> فعال‌سازی صدا
                </button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        document.getElementById('allow-audio-btn').addEventListener('click', () => {
            this.resumeAudioContext();
            this.playBackgroundMusic();
            overlay.remove();
        });
        
        // استایل overlay
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        document.querySelector('.permission-box').style.cssText = `
            background: linear-gradient(135deg, #1a2b5f, #2c3e8c);
            padding: 30px;
            border-radius: 20px;
            border: 3px solid #c7a962;
            text-align: center;
            max-width: 400px;
            margin: 20px;
        `;
    }
}

// ایجاد instance گلوبال
window.audioManager = new AudioManager();
