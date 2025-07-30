// 背景图片系统 - 带淡入淡出效果
class BackgroundController {
    constructor() {
        this.currentBackground = null;
        this.init();
    }
    
    init() {
        this.createBackgroundElements();
        this.setPageBackground();
    }
    
    // 创建背景元素
    createBackgroundElements() {
        // 创建背景图片层
        const background = document.createElement('div');
        background.className = 'page-background';
        background.id = 'page-background';
        
        // 创建覆盖层
        const overlay = document.createElement('div');
        overlay.className = 'page-overlay';
        overlay.id = 'page-overlay';
        
        // 添加到页面
        document.body.prepend(overlay);
        document.body.prepend(background);
    }
    
    // 根据当前页面设置背景图片
    setPageBackground() {
        const background = document.getElementById('page-background');
        const path = window.location.pathname;
        
        let newBackgroundClass = 'bg-main'; // 默认
        
        if (path.includes('main.html') || path.endsWith('/')) {
            newBackgroundClass = 'bg-main';
        } else if (path.includes('about')) {
            newBackgroundClass = 'bg-about';
        } else if (path.includes('interests')) {
            newBackgroundClass = 'bg-interests';
        } else if (path.includes('journey')) {
            newBackgroundClass = 'bg-journey';
        } else if (path.includes('contact')) {
            newBackgroundClass = 'bg-contact';
        }
        
        // 如果背景相同，直接淡入
        if (this.currentBackground === newBackgroundClass) {
            background.classList.add('fade-in');
            return;
        }
        
        // 如果是首次设置或背景改变
        if (this.currentBackground) {
            // 先淡出当前背景
            background.classList.remove('fade-in');
            
            // 等待淡出完成后更换背景并淡入
            setTimeout(() => {
                this.switchBackground(background, newBackgroundClass);
            }, 400); // 等待一半淡出时间
        } else {
            // 首次加载，直接设置背景
            this.switchBackground(background, newBackgroundClass);
        }
    }
    
    // 切换背景图片
    switchBackground(background, newBackgroundClass) {
        // 移除所有背景类
        background.classList.remove('bg-main', 'bg-about', 'bg-interests', 'bg-journey', 'bg-contact');
        
        // 添加新背景类
        background.classList.add(newBackgroundClass);
        this.currentBackground = newBackgroundClass;
        
        // 延迟一小段时间后淡入，确保新背景图片已加载
        setTimeout(() => {
            background.classList.add('fade-in');
        }, 50);
    }
    
    // 页面卸载时淡出背景
    fadeOut() {
        const background = document.getElementById('page-background');
        if (background) {
            background.classList.remove('fade-in');
        }
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化，确保页面加载完成
    setTimeout(() => {
        window.backgroundController = new BackgroundController();
        console.log('背景系统已初始化');
    }, 300);
});

// 页面切换时的背景淡出处理
window.addEventListener('beforeunload', function() {
    if (window.backgroundController) {
        window.backgroundController.fadeOut();
    }
});

// 处理页面链接点击的平滑过渡
document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href]');
    if (link && link.href && !link.target && !link.href.startsWith('http')) {
        // 如果是内部链接，先淡出背景
        if (window.backgroundController) {
            window.backgroundController.fadeOut();
        }
    }
});