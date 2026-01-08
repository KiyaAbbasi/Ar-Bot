class ARManager {
    constructor() {
        this.scene = null;
        this.markerFound = false;
        this.marker = null;
        this.isARReady = false;
        
        this.init();
    }
    
    init() {
        // منتظر بارگذاری A-Frame بمان
        window.addEventListener('load', () => {
            this.setupARScene();
        });
    }
    
    setupARScene() {
        this.scene = document.querySelector('a-scene');
        
        if (!this.scene) {
            console.error('Scene not found!');
            return;
        }
        
        // وقتی AR آماده شد
        this.scene.addEventListener('loaded', () => {
            this.isARReady = true;
            console.log('✅ AR scene loaded');
            this.setupEventListeners();
            this.checkWebGLSupport();
        });
        
        // خطای AR
        this.scene.addEventListener('arjs-video-loaded', () => {
            console.log('📹 AR video stream started');
        });
    }
    
    setupEventListeners() {
        // رویدادهای مارکر
        this.scene.addEventListener('markerFound', (event) => {
            this.onMarkerFound(event);
        });
        
        this.scene.addEventListener('markerLost', (event) => {
            this.onMarkerLost(event);
        });
        
        // کلیک روی دکمه‌های AR
        const arButtons = document.querySelectorAll('.ar-button, #voice-button');
        arButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                this.onButtonClick(event);
            });
        });
    }
    
    onMarkerFound(event) {
        this.markerFound = true;
        this.marker = event.target;
        
        console.log('🎯 Marker found!');
        
        // به‌روزرسانی وضعیت
        this.updateStatus('کارت شناسایی شد', '#4CAF50');
        
        // پخش موسیقی
        if (window.audioManager) {
            setTimeout(() => {
                window.audioManager.playBackgroundMusic();
            }, 500);
        }
        
        // اضافه کردن افکت‌ها
        this.addMarkerEffects();
        
        // به‌روزرسانی UI
        if (window.updateUIOnMarkerFound) {
            window.updateUIOnMarkerFound();
        }
    }
    
    onMarkerLost(event) {
        this.markerFound = false;
        this.marker = null;
        
        console.log('❌ Marker lost');
        
        // به‌روزرسانی وضعیت
        this.updateStatus('در جستجوی کارت...', '#FF5722');
        
        // متوقف کردن موسیقی
        if (window.audioManager) {
            window.audioManager.stopBackgroundMusic();
        }
    }
    
    onButtonClick(event) {
        const button = event.currentTarget;
        const action = button.getAttribute('data-action');
        
        console.log(`Button clicked: ${action}`);
        
        // افکت کلیک
        this.addClickEffect(button);
        
        // اجرای اکشن
        this.executeAction(action);
    }
    
    executeAction(action) {
        switch(action) {
            case 'call-landline':
                this.makeCall('02191552070');
                break;
                
            case 'call-mobile':
                this.makeCall('09054422524');
                break;
                
            case 'website':
                window.open('https://kiyaholding.com', '_blank');
                break;
                
            case 'digital-card':
                window.open('https://kiyaholding.com/digital-card', '_blank');
                break;
                
            case 'voice':
                if (window.audioManager) {
                    window.audioManager.playVoiceIntro();
                }
                break;
                
            default:
                console.warn(`Unknown action: ${action}`);
        }
    }
    
    makeCall(phoneNumber) {
        if (confirm(`آیا می‌خواهید با شماره ${phoneNumber} تماس بگیرید؟`)) {
            window.open(`tel:${phoneNumber}`);
        }
    }
    
    updateStatus(text, color = '#4CAF50') {
        const statusText = document.getElementById('status-text');
        const statusDot = document.querySelector('.status-dot');
        
        if (statusText) {
            statusText.textContent = text;
            statusText.style.color = color;
        }
        
        if (statusDot) {
            statusDot.style.backgroundColor = color;
        }
    }
    
    addMarkerEffects() {
        if (!this.marker) return;
        
        // افکت ذرات
        const particles = document.createElement('a-entity');
        particles.setAttribute('particle-system', {
            preset: 'snow',
            color: '#c7a962',
            particleCount: 50,
            velocityValue: '0 0.5 0',
            accelerationValue: '0 0.2 0'
        });
        particles.setAttribute('position', '0 0.5 0');
        
        // نور
        const light = document.createElement('a-entity');
        light.setAttribute('light', {
            type: 'point',
            color: '#c7a962',
            intensity: 0.5,
            distance: 2
        });
        light.setAttribute('position', '0 0.5 0');
        
        this.marker.appendChild(particles);
        this.marker.appendChild(light);
        
        // حذف افکت‌ها بعد از ۳ ثانیه
        setTimeout(() => {
            if (particles.parentNode) particles.parentNode.removeChild(particles);
            if (light.parentNode) light.parentNode.removeChild(light);
        }, 3000);
    }
    
    addClickEffect(element) {
        // افکت پالس
        const pulse = document.createElement('a-entity');
        pulse.setAttribute('geometry', {
            primitive: 'ring',
            radiusInner: 0.15,
            radiusOuter: 0.2
        });
        pulse.setAttribute('material', {
            color: '#FFFFFF',
            opacity: 0.7,
            transparent: true
        });
        pulse.setAttribute('position', element.getAttribute('position'));
        
        // انیمیشن
        pulse.setAttribute('animation', {
            property: 'scale',
            to: '2 2 2',
            dur: 500,
            easing: 'easeOutQuad'
        });
        
        pulse.setAttribute('animation__opacity', {
            property: 'material.opacity',
            to: 0,
            dur: 500,
            easing: 'easeOutQuad'
        });
        
        this.marker.appendChild(pulse);
        
        // حذف بعد از انیمیشن
        setTimeout(() => {
            if (pulse.parentNode) pulse.parentNode.removeChild(pulse);
        }, 600);
    }
    
    checkWebGLSupport() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            this.showWebGLError();
        }
    }
    
    showWebGLError() {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'webgl-error show';
        errorDiv.innerHTML = `
            <div>
                <h2><i class="fas fa-exclamation-triangle"></i> مرورگر شما از WebGL پشتیبانی نمی‌کند</h2>
                <p>برای مشاهده محتوای AR نیاز به WebGL دارید.</p>
                <p>لطفاً از آخرین نسخه Chrome یا Safari استفاده کنید.</p>
                <button onclick="location.reload()" class="btn-primary">
                    <i class="fas fa-redo"></i> بارگذاری مجدد
                </button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
    }
}

// ایجاد instance گلوبال
window.arManager = new ARManager();
