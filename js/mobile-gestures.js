/**
 * 移动端手势支持增强
 * 提供标签页左右滑动切换等手势操作
 */

class MobileGestureManager {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.isDragging = false;
        this.tabContainer = null;
        this.tabs = [];
        this.currentTabIndex = 0;
        this.threshold = 50; // 手势触发阈值（像素）
        
        if (this.isMobile) {
            this.init();
        }
    }
    
    init() {
        this.setupTabGestures();
        this.setupPullToRefresh();
        console.log('📱 移动端手势管理器初始化完成');
    }
    
    setupTabGestures() {
        this.tabContainer = document.querySelector('.tabs');
        this.tabs = Array.from(document.querySelectorAll('.tab-btn'));
        
        if (!this.tabContainer || this.tabs.length === 0) return;
        
        // 获取当前活跃标签的索引
        this.currentTabIndex = this.tabs.findIndex(tab => tab.classList.contains('active'));
        if (this.currentTabIndex === -1) this.currentTabIndex = 0;
        
        // 为主内容区域添加手势监听
        const contentArea = document.querySelector('.content');
        if (contentArea) {
            this.addGestureListeners(contentArea);
        }
    }
    
    addGestureListeners(element) {
        // 触摸开始
        element.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        
        // 触摸移动
        element.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        
        // 触摸结束
        element.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        
        // 触摸取消
        element.addEventListener('touchcancel', (e) => this.handleTouchCancel(e), { passive: false });
    }
    
    handleTouchStart(e) {
        // 检查是否应该处理手势（避免与其他交互冲突）
        if (!this.shouldHandleGesture(e.target)) return;
        
        const touch = e.touches[0];
        this.startX = touch.clientX;
        this.startY = touch.clientY;
        this.currentX = touch.clientX;
        this.currentY = touch.clientY;
        this.isDragging = false;
        
        // 添加视觉反馈样式
        document.body.classList.add('gesture-active');
    }
    
    handleTouchMove(e) {
        if (!this.startX || !this.startY) return;
        
        const touch = e.touches[0];
        this.currentX = touch.clientX;
        this.currentY = touch.clientY;
        
        const deltaX = this.currentX - this.startX;
        const deltaY = this.currentY - this.startY;
        
        // 检查是否是水平滑动（优先处理标签切换）
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
            this.isDragging = true;
            
            // 阻止默认滚动行为（仅在水平滑动时）
            e.preventDefault();
            
            // 添加滑动视觉提示
            this.showSwipeIndicator(deltaX);
        }
    }
    
    handleTouchEnd(e) {
        if (!this.startX || !this.startY) return;
        
        const deltaX = this.currentX - this.startX;
        const deltaY = this.currentY - this.startY;
        
        // 清理状态
        document.body.classList.remove('gesture-active');
        this.hideSwipeIndicator();
        
        // 处理水平滑动（标签切换）
        if (this.isDragging && Math.abs(deltaX) > this.threshold) {
            if (deltaX > 0) {
                // 向右滑动 - 切换到上一个标签
                this.switchToPreviousTab();
            } else {
                // 向左滑动 - 切换到下一个标签
                this.switchToNextTab();
            }
        }
        
        this.resetGestureState();
    }
    
    handleTouchCancel(e) {
        document.body.classList.remove('gesture-active');
        this.hideSwipeIndicator();
        this.resetGestureState();
    }
    
    resetGestureState() {
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.isDragging = false;
    }
    
    shouldHandleGesture(target) {
        // 避免在特定元素上触发手势
        const excludeSelectors = [
            'input', 'textarea', 'select', 'button',
            '.mobile-search-panel', '.detail-modal',
            '.dropdown-menu', '.pagination'
        ];
        
        return !excludeSelectors.some(selector => 
            target.closest && target.closest(selector)
        );
    }
    
    switchToPreviousTab() {
        if (this.currentTabIndex > 0) {
            this.currentTabIndex--;
            this.activateTab(this.currentTabIndex);
        }
    }
    
    switchToNextTab() {
        if (this.currentTabIndex < this.tabs.length - 1) {
            this.currentTabIndex++;
            this.activateTab(this.currentTabIndex);
        }
    }
    
    activateTab(index) {
        if (index < 0 || index >= this.tabs.length) return;
        
        const targetTab = this.tabs[index];
        if (targetTab) {
            // 触发点击事件来切换标签
            targetTab.click();
            
            // 添加手势切换的视觉反馈
            this.showTabSwitchFeedback(targetTab);
        }
    }
    
    showSwipeIndicator(deltaX) {
        // 创建或更新滑动指示器
        let indicator = document.querySelector('.swipe-indicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'swipe-indicator';
            document.body.appendChild(indicator);
        }
        
        // 设置指示器内容和位置
        const direction = deltaX > 0 ? '👈' : '👉';
        const nextTabName = this.getNextTabName(deltaX > 0 ? -1 : 1);
        
        indicator.innerHTML = `
            <div class="swipe-indicator-content">
                <span class="swipe-icon">${direction}</span>
                <span class="swipe-text">${nextTabName}</span>
            </div>
        `;
        
        indicator.classList.add('active');
        
        // 根据滑动距离调整透明度
        const opacity = Math.min(Math.abs(deltaX) / 100, 1);
        indicator.style.opacity = opacity;
    }
    
    hideSwipeIndicator() {
        const indicator = document.querySelector('.swipe-indicator');
        if (indicator) {
            indicator.classList.remove('active');
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 300);
        }
    }
    
    getNextTabName(direction) {
        const nextIndex = this.currentTabIndex + direction;
        if (nextIndex >= 0 && nextIndex < this.tabs.length) {
            const nextTab = this.tabs[nextIndex];
            return nextTab.textContent.split('(')[0].trim();
        }
        return '';
    }
    
    showTabSwitchFeedback(tab) {
        // 为切换的标签添加动画反馈
        tab.classList.add('gesture-activated');
        setTimeout(() => {
            tab.classList.remove('gesture-activated');
        }, 300);
    }
    
    setupPullToRefresh() {
        // 简单的下拉刷新实现
        let startY = 0;
        let isPulling = false;
        const pullThreshold = 80;
        
        const contentArea = document.querySelector('.content');
        if (!contentArea) return;
        
        contentArea.addEventListener('touchstart', (e) => {
            if (contentArea.scrollTop === 0) {
                startY = e.touches[0].clientY;
                isPulling = true;
            }
        }, { passive: true });
        
        contentArea.addEventListener('touchmove', (e) => {
            if (!isPulling || contentArea.scrollTop > 0) {
                isPulling = false;
                return;
            }
            
            const currentY = e.touches[0].clientY;
            const pullDistance = currentY - startY;
            
            if (pullDistance > 0 && pullDistance < pullThreshold * 2) {
                // 显示下拉提示
                this.showPullIndicator(pullDistance, pullThreshold);
            }
        }, { passive: true });
        
        contentArea.addEventListener('touchend', (e) => {
            if (!isPulling) return;
            
            const endY = e.changedTouches[0].clientY;
            const pullDistance = endY - startY;
            
            this.hidePullIndicator();
            
            if (pullDistance >= pullThreshold) {
                this.triggerRefresh();
            }
            
            isPulling = false;
            startY = 0;
        }, { passive: true });
    }
    
    showPullIndicator(distance, threshold) {
        let indicator = document.querySelector('.pull-indicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'pull-indicator';
            indicator.innerHTML = `
                <div class="pull-indicator-content">
                    <div class="pull-spinner"></div>
                    <span class="pull-text">下拉刷新</span>
                </div>
            `;
            document.body.appendChild(indicator);
        }
        
        const progress = Math.min(distance / threshold, 1);
        const text = progress >= 1 ? '释放刷新' : '下拉刷新';
        
        indicator.querySelector('.pull-text').textContent = text;
        indicator.style.opacity = progress;
        indicator.style.transform = `translateY(${Math.min(distance / 2, 40)}px)`;
        
        if (progress >= 1) {
            indicator.classList.add('ready');
        } else {
            indicator.classList.remove('ready');
        }
    }
    
    hidePullIndicator() {
        const indicator = document.querySelector('.pull-indicator');
        if (indicator) {
            indicator.style.opacity = '0';
            indicator.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 300);
        }
    }
    
    triggerRefresh() {
        // 触发刷新事件
        const event = new CustomEvent('mobileRefresh');
        document.dispatchEvent(event);
        
        // 显示刷新反馈
        this.showRefreshFeedback();
    }
    
    showRefreshFeedback() {
        const feedback = document.createElement('div');
        feedback.className = 'refresh-feedback';
        feedback.innerHTML = `
            <div class="refresh-content">
                <div class="refresh-spinner"></div>
                <span>正在刷新...</span>
            </div>
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.classList.add('active');
        }, 100);
        
        // 模拟刷新完成
        setTimeout(() => {
            feedback.classList.remove('active');
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 300);
        }, 1500);
    }
    
    destroy() {
        // 清理手势监听器
        const contentArea = document.querySelector('.content');
        if (contentArea) {
            contentArea.removeEventListener('touchstart', this.handleTouchStart);
            contentArea.removeEventListener('touchmove', this.handleTouchMove);
            contentArea.removeEventListener('touchend', this.handleTouchEnd);
            contentArea.removeEventListener('touchcancel', this.handleTouchCancel);
        }
        
        // 清理指示器
        this.hideSwipeIndicator();
        this.hidePullIndicator();
    }
}

// CSS样式注入（如果需要的话）
const gestureStyles = `
<style>
.gesture-active {
    user-select: none;
    -webkit-user-select: none;
}

.swipe-indicator {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px 20px;
    border-radius: 20px;
    z-index: 3000;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
}

.swipe-indicator-content {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
}

.swipe-icon {
    font-size: 18px;
}

.gesture-activated {
    transform: scale(0.95);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.pull-indicator {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 16px;
    border-radius: 16px;
    z-index: 3000;
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
}

.pull-indicator-content {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
}

.pull-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.pull-indicator.ready .pull-spinner {
    border-color: #4ade80;
    border-top-color: white;
}

.refresh-feedback {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.8);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 20px;
    border-radius: 16px;
    z-index: 3500;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
}

.refresh-feedback.active {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
}

.refresh-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    font-size: 14px;
}

.refresh-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
    .swipe-indicator,
    .pull-indicator,
    .refresh-feedback {
        display: block;
    }
}

@media (min-width: 769px) {
    .swipe-indicator,
    .pull-indicator,
    .refresh-feedback {
        display: none !important;
    }
}
</style>
`;

// 注入样式
if (typeof document !== 'undefined' && window.innerWidth <= 768) {
    document.head.insertAdjacentHTML('beforeend', gestureStyles);
}

// 全局实例
window.MobileGestureManager = MobileGestureManager;

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 768) {
        window.mobileGestures = new MobileGestureManager();
    }
});

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileGestureManager;
}