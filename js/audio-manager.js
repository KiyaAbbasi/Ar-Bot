class AudioManager {
    constructor() {
        this.audioContext = null;
        this.backgroundMusic = null;
        this.voiceDescription = null;
        this.volume = 0.25;
        this.isBackgroundPlaying = false;

        this.initAudio();
    }

    async initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // بارگذاری موسیقی پس‌زمینه
            this.backgroundMusic = new Audio('assets/audio/bg-music.mp3');
            this.backgroundMusic.loop = true;
            this.backgroundMusic.volume = this.volume;

            // بارگذاری توضیحات صوتی
            this.voiceDescription = new Audio('assets/audio/voice-description.mp3');
            this.voiceDescription.volume = 0.8;

            console.log('AudioManager initialized successfully');
        } catch (error) {
            console.error('Error initializing AudioManager:', error);
        }
    }

    playBackgroundMusic() {
        if (this.backgroundMusic && !this.isBackgroundPlaying) {
            this.backgroundMusic.play()
                .then(() => {
                    this.isBackgroundPlaying = true;
                    console.log('Background music started at volume:', this.volume);
                })
                .catch(error => {
                    console.warn('Autoplay prevented, user interaction required:', error);
                    this.requestUserInteraction();
                });
        }
    }

    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            this.isBackgroundPlaying = false;
        }
    }

    playVoiceDescription() {
        if (this.voiceDescription) {
            this.voiceDescription.currentTime = 0;
            this.voiceDescription.play()
                .then(() => {
                    console.log('Voice description playing');
                })
                .catch(error => {
                    console.error('Error playing voice:', error);
                });
        }
    }

    setVolume(newVolume) {
        this.volume = Math.max(0, Math.min(1, newVolume / 100));

        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.volume;
        }

        if (this.voiceDescription) {
            this.voiceDescription.volume = Math.min(0.8, this.volume * 2);
        }

        console.log('Volume set to:', this.volume);
        return this.volume * 100;
    }

    requestUserInteraction() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 3000;
            color: white;
            text-align: center;
            padding: 20px;
        `;

        overlay.innerHTML = `
            <div style="max-width: 400px; background: #1a2b5f; padding: 30px; border-radius: 20px; border: 2px solid #c7a962;">
                <h3 style="color: #c7a962; margin-bottom: 20px;">لطفا برای پخش صدا تعامل کنید</h3>
                <p style="margin-bottom: 25px;">برای تجربه کامل واقعیت افزوده، نیاز به اجازه پخش صدا داریم.</p>
                <button id="allow-audio" style="
                    background: linear-gradient(135deg, #c7a962, #e6b450);
                    color: #1a2b5f;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 15px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    cursor: pointer;
                ">فعال‌سازی صدا</button>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById('allow-audio').addEventListener('click', () => {
            this.audioContext.resume().then(() => {
                this.playBackgroundMusic();
                overlay.remove();
            });
        });
    }
}

// Export برای استفاده در سایر فایل‌ها
if (typeof module !== 'undefined') {
    module.exports = AudioManager;
}