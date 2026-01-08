class UIManager {
    constructor() {
        this.currentPage = 0;
        this.totalPages = 4; // 4 دکمه اصلی
        this.buttons = [];

        this.initUI();
    }

    initUI() {
        this.create3DButtons();
        this.setupEventListeners();
        this.updateStatus('آماده اسکن');
    }

    create3DButtons() {
        const buttonConfigs = [
            {
                id: 'btn-call-landline',
                icon: 'fas fa-phone-alt',
                text: 'تماس با دفتر',
                color: '#4CAF50',
                action: () => this.makeCall('02191552070')
            },
            {
                id: 'btn-call-mobile',
                icon: 'fas fa-mobile-alt',
                text: 'تماس با موبایل',
                color: '#2196F3',
                action: () => this.makeCall('09054422524')
            },
            {
                id: 'btn-website',
                icon: 'fas fa-globe',
                text: 'وب‌سایت شرکت',
                color: '#9C27B0',
                action: () => this.openWebsite()
            },
            {
                id: 'btn-digital-card',
                icon: 'fas fa-id-card',
                text: 'کارت دیجیتال',
                color: '#FF9800',
                action: () => this.openDigitalCard()
            }
        ];

        buttonConfigs.forEach((config, index) => {
            const button = this.create3DButton(config, index);
            this.buttons.push(button);
        });
    }

    create3DButton(config, index) {
        const button = document.createElement('a-entity');
        const angle = (index / this.totalPages) * Math.PI * 2;
        const radius = 0.8;

        button.setAttribute('geometry', {
            primitive: 'cylinder',
            radius: 0.15,
            height: 0.05
        });

        button.setAttribute('material', {
            color: config.color,
            metalness: 0.8,
            roughness: 0.2,
            shader: 'standard'
        });

        button.setAttribute('position', {
            x: Math.cos(angle) * radius,
            y: 0.1,
            z: Math.sin(angle) * radius
        });

        button.setAttribute('animation', {
            property: 'rotation',
            to: `0 ${360 + (index * 90)} 0`,
            loop: true,
            dur: 20000,
            easing: 'linear'
        });

        button.setAttribute('class', 'ar-button-3d');
        button.setAttribute('data-action', config.id);

        // اضافه کردن آیکون
        const icon = document.createElement('a-entity');
        icon.setAttribute('text', {
            value: config.icon,
            font: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/fonts/helvetiker_regular.typeface.json',
            align: 'center',
            color: '#FFFFFF',
            width: 0.5
        });
        icon.setAttribute('position', '0 0.04 0');
        button.appendChild(icon);

        // اضافه کردن متن
        const text = document.createElement('a-entity');
        text.setAttribute('text', {
            value: config.text,
            font: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/fonts/helvetiker_regular.typeface.json',
            align: 'center',
            color: '#FFFFFF',
            width: 0.8,
            height: 0.3
        });
        text.setAttribute('position', '0 -0.1 0');
        text.setAttribute('rotation', '0 0 0');
        button.appendChild(text);

        // رویداد کلیک
        button.addEventListener('click', config.action);

        // اضافه کردن به صحنه
        const arContent = document.getElementById('ar-content');
        if (arContent) {
            arContent.appendChild(button);
        }

        return button;
    }

    setupEventListeners() {
        // کنترل صدا
        const volumeSlider = document.getElementById('volume-slider');
        const volumeValue = document.getElementById('volume-value');

        if (volumeSlider && volumeValue) {
            volumeSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                volumeValue.textContent = `${value}%`;
                if (window.audioManager) {
                    window.audioManager.setVolume(value);
                }
            });
        }

        // دکمه‌های کنترل صدا
        document.getElementById('volume-up')?.addEventListener('click', () => {
            if (volumeSlider) {
                const current = parseInt(volumeSlider.value);
                const newValue = Math.min(100, current + 10);
                volumeSlider.value = newValue;
                volumeValue.textContent = `${newValue}%`;
                if (window.audioManager) {
                    window.audioManager.setVolume(newValue);
                }
            }
        });

        document.getElementById('volume-down')?.addEventListener('click', () => {
            if (volumeSlider) {
                const current = parseInt(volumeSlider.value);
                const newValue = Math.max(0, current - 10);
                volumeSlider.value = newValue;
                volumeValue.textContent = `${newValue}%`;
                if (window.audioManager) {
                    window.audioManager.setVolume(newValue);
                }
            }
        });

        // دکمه توضیحات صوتی
        document.getElementById('btn-voice')?.addEventListener('click', () => {
            if (window.audioManager) {
                window.audioManager.playVoiceDescription();
            }
        });

        // دکمه راهنما
        document.getElementById('btn-help')?.addEventListener('click', () => {
            document.querySelector('.instructions').classList.add('show');
        });

        // بستن راهنما
        document.getElementById('close-help')?.addEventListener('click', () => {
            document.querySelector('.instructions').classList.remove('show');
        });
    }

    makeCall(phoneNumber) {
        if (confirm(`آیا می‌خواهید با شماره ${phoneNumber} تماس بگیرید؟`)) {
            window.open(`tel:${phoneNumber}`);
        }
    }

    openWebsite() {
        window.open('https://kiyaholding.com', '_blank');
    }

    openDigitalCard() {
        window.open('https://kiyaholding.com/digital-card', '_blank');
    }

    updateStatus(status) {
        const statusText = document.getElementById('status-text');
        const indicator = document.querySelector('.status-indicator');

        if (statusText) {
            statusText.textContent = status;
        }

        if (indicator) {
            const colors = {
                'آماده اسکن': '#4CAF50',
                'در حال شناسایی': '#FFC107',
                'شناسایی شد': '#2196F3',
                'خطا': '#F44336'
            };

            indicator.style.backgroundColor = colors[status] || '#4CAF50';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'error' ? '#F44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 3000;
            animation: slideInRight 0.5s ease-out;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out forwards';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

if (typeof module !== 'undefined') {
    module.exports = UIManager;
}