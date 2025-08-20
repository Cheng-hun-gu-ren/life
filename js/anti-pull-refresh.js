/**
 * 防止移动端误触下拉刷新的增强脚本
 * 专门针对 iOS Safari 和 Chrome 移动版优化
 */

class AntiPullRefreshManager {
    constructor() {
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        this.preventRefresh = true;
        
        if (this.isMobile) {
            this.init();
        }
    }
    
    init() {
        console.log('🚫 启动防误触下拉刷新保护');
        
        // 立即应用preventive措施
        this.applyPreventiveMeasures();
        
        // 监听DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupProtection());
        } else {
            this.setupProtection();
        }
        
        // 页面显示时重新激活保护
        window.addEventListener('pageshow', () => this.reactivateProtection());
        
        // 处理页面隐藏/显示
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.reactivateProtection();
            }
        });
    }
    
    applyPreventiveMeasures() {
        // 设置viewport阻止缩放和弹性滚动
        this.updateViewportMeta();
        
        // 立即应用body样式
        document.documentElement.style.overscrollBehavior = 'none';
        document.documentElement.style.webkitOverscrollBehavior = 'none';
        document.body.style.overscrollBehaviorY = 'none';
        document.body.style.webkitOverscrollBehaviorY = 'none';
        
        // iOS特殊处理
        if (this.isIOS) {
            document.body.style.touchAction = 'pan-x pan-y';
            document.body.style.webkitTouchAction = 'pan-x pan-y';
        }
    }
    
    updateViewportMeta() {
        let viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            const content = viewport.getAttribute('content');
            if (!content.includes('user-scalable=no')) {
                viewport.setAttribute('content', content + ', user-scalable=no');
            }
        }
    }
    
    setupProtection() {
        // 全局事件监听
        this.setupGlobalListeners();
        
        // 针对特定容器的保护
        this.setupContainerProtection();
        
        console.log('✅ 防误触下拉刷新保护已激活');
    }
    
    setupGlobalListeners() {
        // 阻止window级别的touchmove
        window.addEventListener('touchmove', this.preventPullToRefresh.bind(this), { 
            passive: false, 
            capture: true 
        });
        
        // 阻止document级别的touchmove
        document.addEventListener('touchmove', this.preventPullToRefresh.bind(this), { 
            passive: false, 
            capture: true 
        });
        
        // 针对body的特殊处理
        document.body.addEventListener('touchstart', this.handleTouchStart.bind(this), { 
            passive: false 
        });
        
        document.body.addEventListener('touchmove', this.handleTouchMove.bind(this), { 
            passive: false 
        });
    }
    
    setupContainerProtection() {
        const selectors = [
            '.main-container',
            '.content', 
            '.section',
            '.books-grid',
            '.movies-grid', 
            '.music-grid',
            '.tab-content'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                this.protectElement(element);
            });
        });
    }
    
    protectElement(element) {
        // 应用CSS属性
        element.style.overscrollBehaviorY = 'contain';
        element.style.webkitOverscrollBehaviorY = 'contain';
        element.style.touchAction = 'pan-y';
        element.style.webkitTouchAction = 'pan-y';
        
        // 添加事件监听
        element.addEventListener('touchmove', this.preventPullToRefresh.bind(this), { 
            passive: false 
        });
    }
    
    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
        this.isAtTop = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0) <= 1;
    }
    
    handleTouchMove(e) {
        if (!this.touchStartY) return;
        
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - this.touchStartY;
        
        // 如果在页面顶部并且向下拉
        if (this.isAtTop && deltaY > 0) {
            // 增加触发阈值，允许更多正常滑动
            if (deltaY > 30) {  // 从5增加到30，给滑动条更多空间
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            }
        }
    }
    
    preventPullToRefresh(e) {
        // 检查滚动位置
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        
        // 如果在页面顶部
        if (scrollTop <= 1) {
            const touch = e.touches[0];
            if (touch && this.touchStartY) {
                const deltaY = touch.clientY - this.touchStartY;
                
                // 只阻止明显的下拉刷新动作，允许正常的滑动
                if (deltaY > 30) {  // 增加阈值，给正常滑动更多空间
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    return false;
                }
            }
        }
    }
    
    reactivateProtection() {
        // 重新应用保护措施
        setTimeout(() => {
            this.applyPreventiveMeasures();
            this.setupContainerProtection();
        }, 100);
    }
    
    destroy() {
        // 移除所有事件监听器
        window.removeEventListener('touchmove', this.preventPullToRefresh);
        document.removeEventListener('touchmove', this.preventPullToRefresh);
        document.body.removeEventListener('touchstart', this.handleTouchStart);
        document.body.removeEventListener('touchmove', this.handleTouchMove);
        
        console.log('🔄 防误触下拉刷新保护已停用');
    }
}

// 立即创建实例（在DOM加载前就开始保护）
if (typeof window !== 'undefined') {
    window.antiPullRefresh = new AntiPullRefreshManager();
}

// 确保在各种情况下都能工作
(function() {
    // 如果页面已经加载
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        if (!window.antiPullRefresh) {
            window.antiPullRefresh = new AntiPullRefreshManager();
        }
    }
    
    // 如果还在加载
    document.addEventListener('DOMContentLoaded', function() {
        if (!window.antiPullRefresh) {
            window.antiPullRefresh = new AntiPullRefreshManager();
        }
    });
})();