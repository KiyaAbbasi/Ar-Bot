// main.js - نسخه اصلاح شده
document.addEventListener('DOMContentLoaded', function () {
    console.log('کیا هولدینگ - AR Business Card Initializing...');

    // کمی تاخیر برای اطمینان از لود شدن A-Frame
    setTimeout(function () {
        if (typeof AFRAME === 'undefined') {
            console.error('A-Frame not loaded!');
            return;
        }

        // مقداردهی مدیران
        try {
            // اول AudioManager
            if (typeof AudioManager !== 'undefined') {
                window.audioManager = new AudioManager();
                console.log('✅ AudioManager initialized');
            }

            // بعد UIManager
            if (typeof UIManager !== 'undefined') {
                window.uiManager = new UIManager();
                console.log('✅ UIManager initialized');
            }

            // بعد ARSystem
            if (typeof ARSystem !== 'undefined') {
                window.arSystem = new ARSystem();
                console.log('✅ ARSystem initialized');
            }

            // شروع موسیقی
            if (window.audioManager && CONFIG.audio.autoPlay) {
                setTimeout(function () {
                    window.audioManager.setVolume(CONFIG.audio.backgroundVolume * 100);
                    window.audioManager.playBackgroundMusic();
                }, 1000);
            }

            console.log('✅ همه چیز آماده است!');
            document.getElementById('status-text').textContent = 'آماده اسکن';

        } catch (error) {
            console.error('خطا در مقداردهی:', error);
            document.getElementById('status-text').textContent = 'خطا در بارگذاری';
        }
    }, 1000);
});