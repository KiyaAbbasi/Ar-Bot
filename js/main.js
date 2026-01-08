// main.js - فایل اصلی کنترل برنامه

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Kia Holding AR Business Card - Starting...');
    
    // مقداردهی اولیه
    initApp();
    
    // رویدادها
    setupEventListeners();
    
    // بررسی دستگاه
    checkDeviceSupport();
});

function initApp() {
    // مخفی کردن صفحه AR در ابتدا
    document.getElementById('ar-screen').classList.remove('active');
    document.getElementById('intro-screen').classList.add('active');
    
    // تنظیم مقدار اولیه اسلایدر صدا
    const volumeSlider = document.getElementById('volume-slider');
    const volumeText = document.getElementById('volume-text');
    
    if (volumeSlider && volumeText) {
        volumeSlider.value = 25;
        volumeText.textContent = 'حجم: 25%';
    }
    
    // نمایش نسخه
    console.log('App initialized - Version 2.0');
}

function setupEventListeners() {
    // دکمه شروع AR
    const startBtn = document.getElementById('start-ar');
    if (startBtn) {
        startBtn.addEventListener('click', startARExperience);
    }
    
    // دکمه بازگشت
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', goBackToIntro);
    }
    
    // کنترل‌های صدا
    setupVolumeControls();
}

function startARExperience() {
    console.log('🎬 Starting AR experience...');
    
    // رفتن به صفحه AR
    document.getElementById('intro-screen').classList.remove('active');
    document.getElementById('ar-screen').classList.add('active');
    
    // تلاش برای پخش موسیقی
    setTimeout(() => {
        if (window.audioManager) {
            window.audioManager.resumeAudioContext();
        }
    }, 1000);
    
    // اطلاع به کاربر
    if (window.arManager) {
        window.arManager.updateStatus('دوربین فعال شد', '#2196F3');
    }
}

function goBackToIntro() {
    console.log('↩️ Going back to intro...');
    
    // برگشت به صفحه معرفی
    document.getElementById('ar-screen').classList.remove('active');
    document.getElementById('intro-screen').classList.add('active');
    
    // توقف موسیقی
    if (window.audioManager) {
        window.audioManager.stopBackgroundMusic();
    }
}

function setupVolumeControls() {
    const volumeSlider = document.getElementById('volume-slider');
    const volumeUp = document.getElementById('volume-up');
    const volumeDown = document.getElementById('volume-down');
    const volumeText = document.getElementById('volume-text');
    
    if (!volumeSlider || !volumeUp || !volumeDown || !volumeText) return;
    
    // اسلایدر
    volumeSlider.addEventListener('input', function() {
        const value = this.value;
        volumeText.textContent = `حجم: ${value}%`;
        
        if (window.audioManager) {
            window.audioManager.setVolume(value);
        }
    });
    
    // دکمه افزایش
    volumeUp.addEventListener('click', function() {
        const current = parseInt(volumeSlider.value);
        const newValue = Math.min(100, current + 10);
        volumeSlider.value = newValue;
        volumeText.textContent = `حجم: ${newValue}%`;
        
        if (window.audioManager) {
            window.audioManager.setVolume(newValue);
        }
    });
    
    // دکمه کاهش
    volumeDown.addEventListener('click', function() {
        const current = parseInt(volumeSlider.value);
        const newValue = Math.max(0, current - 10);
        volumeSlider.value = newValue;
        volumeText.textContent = `حجم: ${newValue}%`;
        
        if (window.audioManager) {
            window.audioManager.setVolume(newValue);
        }
    });
}

function checkDeviceSupport() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    if (!isMobile && !isChrome && !isSafari) {
        console.warn('⚠️ For best experience, use Chrome or Safari on mobile');
    }
}

// توابع کمکی
window.updateUIOnMarkerFound = function() {
    // می‌تواند برای به‌روزرسانی UI اضافی استفاده شود
    console.log('UI updated for marker found');
};

// هندل خطاها
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    
    // نمایش خطا به کاربر
    const statusText = document.getElementById('status-text');
    if (statusText) {
        statusText.textContent = 'خطا در بارگذاری';
        statusText.style.color = '#F44336';
    }
});
