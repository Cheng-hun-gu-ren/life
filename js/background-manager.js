// 自动背景管理器 - 基于时间戳自动选择背景，带淡入淡出效果
class BackgroundManager {
    constructor() {
        this.backgrounds = {
            'main': ['main-bg.jpg', 'main-bg-2.jpg', 'main-bg-3.jpg'],
            'about': ['about-bg.jpg', 'about-bg-2.jpg', 'about-bg-3.jpg'],
            'interests': ['interests-bg.jpg', 'interests-bg-2.jpg', 'interests-bg-3.jpg'],
            'journey': ['journey-bg.jpg', 'journey-bg-2.jpg', 'journey-bg-3.jpg'],
            'contact': ['contact-bg.jpg', 'contact-bg-2.jpg', 'contact-bg-3.jpg']
        };
        
        this.sessionTimestamp = this.getSessionTimestamp();
        this.currentPage = this.getCurrentPage();
        this.backgroundElement = null;
        this.overlayElement = null;
    }
    
    // 获取或创建会话时间戳（仅在会话开始时创建一次）
    getSessionTimestamp() {
        let timestamp = sessionStorage.getItem('backgroundTimestamp');
        if (!timestamp) {
            // 当用户首次进入时，记录时间戳
            timestamp = Date.now();
            sessionStorage.setItem('backgroundTimestamp', timestamp);
            console.log('新会话创建，时间戳:', timestamp);
        }
        return parseInt(timestamp);
    }
    
    // 识别当前页面
    getCurrentPage() {
        const path = window.location.pathname;
        
        if (path.includes('/about/')) return 'about';
        if (path.includes('/interests/')) return 'interests';
        if (path.includes('/journey/')) return 'journey';
        if (path.includes('/contact/')) return 'contact';
        if (path.includes('main.html') || path === '/') return 'main';
        
        // 默认返回main
        return 'main';
    }
    
    // 基于时间戳选择背景（除三取余）
    selectBackgroundByTimestamp(pageType) {
        const backgrounds = this.backgrounds[pageType] || this.backgrounds['main'];
        // 使用时间戳除以背景数量取余，确定使用哪个背景
        const index = this.sessionTimestamp % backgrounds.length;
        return backgrounds[index];
    }
    
    // 获取背景图片路径
    getBackgroundPath(filename, pageType = null) {
        const page = pageType || this.currentPage;
        
        // 根据页面确定路径前缀
        if (page === 'main') {
            return `images/backgrounds/${filename}`;
        } else {
            return `../../images/backgrounds/${filename}`;
        }
    }
    
    // 创建背景元素
    createBackgroundElements() {
        // 创建背景图片层
        this.backgroundElement = document.createElement('div');
        this.backgroundElement.className = 'page-background';
        this.backgroundElement.id = 'page-background';
        
        // 创建覆盖层
        this.overlayElement = document.createElement('div');
        this.overlayElement.className = 'page-overlay';
        this.overlayElement.id = 'page-overlay';
        
        // 添加到页面
        document.body.prepend(this.overlayElement);
        document.body.prepend(this.backgroundElement);
        
        // 添加CSS样式
        this.addBackgroundStyles();
    }
    
    // 添加背景样式
    addBackgroundStyles() {
        const styleId = 'background-manager-styles';
        if (document.getElementById(styleId)) return;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .page-background {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-size: cover;
                background-position: center;
                background-attachment: fixed;
                background-repeat: no-repeat;
                z-index: -2;
                opacity: 0;
                transition: opacity 0.8s ease-in-out;
            }
            
            .page-background.fade-in {
                opacity: 1;
            }
            
            .page-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.3);
                z-index: -1;
                opacity: 0;
                transition: opacity 0.8s ease-in-out;
            }
            
            .page-overlay.fade-in {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 应用背景到页面
    applyBackground() {
        // 创建背景元素（如果还没有）
        if (!this.backgroundElement) {
            this.createBackgroundElements();
        }
        
        const pageType = this.currentPage;
        const selectedBg = this.selectBackgroundByTimestamp(pageType);
        const backgroundPath = this.getBackgroundPath(selectedBg);
        
        // 设置背景图片
        this.backgroundElement.style.backgroundImage = `url('${backgroundPath}')`;
        
        // 预加载图片，然后淡入
        const img = new Image();
        img.onload = () => {
            // 图片加载完成后，开始淡入效果
            setTimeout(() => {
                this.backgroundElement.classList.add('fade-in');
                this.overlayElement.classList.add('fade-in');
            }, 100);
        };
        img.src = backgroundPath;
        
        // 存储当前选择的背景（用于调试）
        sessionStorage.setItem(`background_${pageType}`, selectedBg);
        
        console.log(`背景已应用: ${backgroundPath} (时间戳: ${this.sessionTimestamp}, 索引: ${this.sessionTimestamp % this.backgrounds[pageType].length})`);
        
        return {
            page: pageType,
            background: selectedBg,
            path: backgroundPath,
            timestamp: this.sessionTimestamp,
            index: this.sessionTimestamp % this.backgrounds[pageType].length
        };
    }
    
    // 淡出背景（页面切换时使用）
    fadeOut() {
        if (this.backgroundElement) {
            this.backgroundElement.classList.remove('fade-in');
        }
        if (this.overlayElement) {
            this.overlayElement.classList.remove('fade-in');
        }
    }
    
    // 预加载背景图片
    preloadBackgrounds(pageType = null) {
        const page = pageType || this.currentPage;
        const backgrounds = this.backgrounds[page] || this.backgrounds['main'];
        
        backgrounds.forEach(bg => {
            const img = new Image();
            img.src = this.getBackgroundPath(bg, page);
        });
    }
    
    // 获取背景信息（用于调试）
    getBackgroundInfo() {
        return {
            currentPage: this.currentPage,
            sessionTimestamp: this.sessionTimestamp,
            availableBackgrounds: this.backgrounds[this.currentPage] || this.backgrounds['main'],
            selectedBackground: this.selectBackgroundByTimestamp(this.currentPage),
            selectedIndex: this.sessionTimestamp % (this.backgrounds[this.currentPage] || this.backgrounds['main']).length
        };
    }
}

// 全局初始化函数
function initDynamicBackground() {
    // 确保DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const bgManager = new BackgroundManager();
            bgManager.preloadBackgrounds();
            
            // 延迟应用背景，确保页面完全加载
            setTimeout(() => {
                bgManager.applyBackground();
            }, 200);
            
            // 将管理器实例挂载到全局，便于调试
            window.backgroundManager = bgManager;
        });
    } else {
        const bgManager = new BackgroundManager();
        bgManager.preloadBackgrounds();
        
        setTimeout(() => {
            bgManager.applyBackground();
        }, 200);
        
        window.backgroundManager = bgManager;
    }
}

// 页面切换时的背景淡出处理
window.addEventListener('beforeunload', function() {
    if (window.backgroundManager) {
        window.backgroundManager.fadeOut();
    }
});

// 处理页面链接点击的平滑过渡
document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href]');
    if (link && link.href && !link.target && !link.href.startsWith('http')) {
        // 如果是内部链接，先淡出背景
        if (window.backgroundManager) {
            window.backgroundManager.fadeOut();
        }
    }
});

// 自动初始化（基于时间戳自动选择背景）
if (typeof window !== 'undefined') {
    initDynamicBackground();
}

// 导出模块（如果需要）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BackgroundManager, initDynamicBackground };
}