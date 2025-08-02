// 自动背景管理器 - 基于时间戳自动选择背景
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
    
    // 应用背景到页面
    applyBackground() {
        const pageType = this.currentPage;
        const selectedBg = this.selectBackgroundByTimestamp(pageType);
        const backgroundPath = this.getBackgroundPath(selectedBg);
        
        // 应用背景
        document.body.style.backgroundImage = `url('${backgroundPath}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundRepeat = 'no-repeat';
        
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
            bgManager.applyBackground();
            
            // 将管理器实例挂载到全局，便于调试
            window.backgroundManager = bgManager;
        });
    } else {
        const bgManager = new BackgroundManager();
        bgManager.preloadBackgrounds();
        bgManager.applyBackground();
        
        window.backgroundManager = bgManager;
    }
}

// 自动初始化（基于时间戳自动选择背景）
if (typeof window !== 'undefined') {
    initDynamicBackground();
}

// 导出模块（如果需要）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BackgroundManager, initDynamicBackground };
}