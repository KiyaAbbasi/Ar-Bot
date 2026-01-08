class ARSystem {
    constructor() {
        this.markerFound = false;
        this.currentMarker = null;
        this.scene = null;

        this.initAR();
    }

    initAR() {
        this.scene = document.querySelector('a-scene');

        if (!this.scene) {
            console.error('Scene not found!');
            return;
        }

        // رویدادهای مارکر
        this.scene.addEventListener('markerFound', (event) => {
            this.onMarkerFound(event);
        });

        this.scene.addEventListener('markerLost', (event) => {
            this.onMarkerLost(event);
        });

        // بررسی پشتیبانی مرورگر
        this.checkBrowserSupport();
    }

    onMarkerFound(event) {
        this.markerFound = true;
        this.currentMarker = event.target;

        console.log('Marker found:', this.currentMarker.id);

        // به‌روزرسانی وضعیت UI
        if (window.uiManager) {
            window.uiManager.updateStatus('شناسایی شد');
            window.uiManager.showNotification('کارت ویزیت شناسایی شد!', 'success');
        }

        // پخش خودکار موسیقی
        if (window.audioManager && window.CONFIG.audio.autoPlay) {
            setTimeout(() => {
                window.audioManager.playBackgroundMusic();
            }, 500);
        }

        // اضافه کردن افکت‌های ویژه
        this.addSpecialEffects();
    }

    onMarkerLost(event) {
        this.markerFound = false;
        this.currentMarker = null;

        console.log('Marker lost');

        // به‌روزرسانی وضعیت UI
        if (window.uiManager) {
            window.uiManager.updateStatus('آماده اسکن');
        }
    }

    addSpecialEffects() {
        if (!this.currentMarker) return;

        // ایجاد افکت ذرات
        const particles = document.createElement('a-entity');
        particles.setAttribute('particle-system', {
            preset: 'snow',
            color: '#c7a962',
            particleCount: 100,
            maxAge: 2
        });
        particles.setAttribute('position', '0 0.5 0');

        // ایجاد نور نقطه‌ای
        const pointLight = document.createElement('a-entity');
        pointLight.setAttribute('light', {
            type: 'point',
            color: '#c7a962',
            intensity: 0.8,
            distance: 3
        });
        pointLight.setAttribute('position', '0 0.5 0');
        pointLight.setAttribute('animation', {
            property: 'position',
            to: '0 1 0',
            dir: 'alternate',
            loop: true,
            dur: 2000
        });

        this.currentMarker.appendChild(particles);
        this.currentMarker.appendChild(pointLight);

        // حذف افکت‌ها پس از 5 ثانیه
        setTimeout(() => {
            if (particles.parentNode) {
                particles.parentNode.removeChild(particles);
            }
            if (pointLight.parentNode) {
                pointLight.parentNode.removeChild(pointLight);
            }
        }, 5000);
    }

    checkBrowserSupport() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);

        if (!isIOS && !isAndroid) {
            console.warn('توصیه می‌شود از گوشی موبایل برای تجربه بهتر استفاده کنید');
        }

        // بررسی WebGL
        if (!this.isWebGLAvailable()) {
            this.showWebGLError();
        }
    }

    isWebGLAvailable() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext &&
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    showWebGLError() {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 4000;
            text-align: center;
            padding: 20px;
        `;

        errorDiv.innerHTML = `
            <div style="max-width: 500px; background: #1a2b5f; padding: 30px; border-radius: 20px; border: 2px solid #c7a962;">
                <h2 style="color: #c7a962; margin-bottom: 20px;">⚠️ مرورگر شما از WebGL پشتیبانی نمی‌کند</h2>
                <p style="margin-bottom: 15px;">برای مشاهده محتوای AR نیاز به WebGL دارید.</p>
                <p style="margin-bottom: 25px;">لطفاً از آخرین نسخه یکی از مرورگرهای زیر استفاده کنید:</p>
                <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 25px;">
                    <div style="background: #4285F4; padding: 10px 20px; border-radius: 10px;">Chrome</div>
                    <div style="background: #FF9500; padding: 10px 20px; border-radius: 10px;">Safari</div>
                    <div style="background: #007AFF; padding: 10px 20px; border-radius: 10px;">Firefox</div>
                </div>
                <button onclick="location.reload()" style="
                    background: linear-gradient(135deg, #c7a962, #e6b450);
                    color: #1a2b5f;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 15px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    cursor: pointer;
                ">بارگذاری مجدد</button>
            </div>
        `;

        document.body.appendChild(errorDiv);
    }

    // برای استفاده در فایل اصلی
    static getInstance() {
        if (!ARSystem.instance) {
            ARSystem.instance = new ARSystem();
        }
        return ARSystem.instance;
    }
}

if (typeof module !== 'undefined') {
    module.exports = ARSystem;
}