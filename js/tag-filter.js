/**
 * 平铺标签筛选器
 * 支持点击切换激活/失活状态，实现内容筛选
 */

class TagFilterManager {
    constructor() {
        this.categories = {
            books: ['文学', '技术', '心理学', '历史', '哲学', '经济', '实用', '其它'],
            movies: ['剧情', '喜剧', '动画', '科幻', '悬疑', '动作', '爱情', '其它'],
            music: ['流行', '民谣', '摇滚', '古风', '纯音乐', '其它']
        };
        
        this.categoryMapping = {
            books: {
                '文学': '文学',
                '技术': '技术', 
                '心理学': '心理学',
                '历史': '历史',
                '哲学': '哲学',
                '经济': '经济',
                '实用': '实用',
                '其它': ['其它', '其他']
            },
            movies: {
                '剧情': '剧情',
                '喜剧': '喜剧',
                '动画': '动画', 
                '科幻': '科幻',
                '悬疑': '悬疑',
                '动作': '动作',
                '爱情': '爱情',
                '其它': ['其它', '其他']
            },
            music: {
                '流行': '流行',
                '民谣': '民谣',
                '摇滚': '摇滚',
                '古风': '古风',
                '纯音乐': '纯音乐',
                '其它': ['其它', '其他']
            }
        };
        
        this.currentTab = 'books';
        this.activeStates = {
            books: new Set(this.categories.books), // 默认全部激活
            movies: new Set(this.categories.movies),
            music: new Set(this.categories.music)
        };
        
        this.filterTagsContainer = null;
        this.onFilterChange = null; // 筛选变化回调
    }
    
    init(containerId, onFilterChange = null) {
        this.filterTagsContainer = document.getElementById(containerId);
        this.onFilterChange = onFilterChange;
        
        if (!this.filterTagsContainer) {
            console.error('标签筛选容器未找到:', containerId);
            return;
        }
        
        // 初始化默认标签
        this.renderTags();
        
        console.log('🏷️ 标签筛选器初始化完成');
    }
    
    // 切换到指定tab
    switchTab(tabName) {
        if (!this.categories[tabName]) {
            console.error('未知的tab:', tabName);
            return;
        }
        
        this.currentTab = tabName;
        this.renderTags();
        
        console.log('🔄 标签筛选器切换到:', tabName);
    }
    
    // 渲染标签
    renderTags() {
        if (!this.filterTagsContainer) return;
        
        const categories = this.categories[this.currentTab];
        const activeSet = this.activeStates[this.currentTab];
        
        // 清空容器
        this.filterTagsContainer.innerHTML = '';
        
        // 创建全选/全不选控制按钮
        const controlButton = this.createControlButton();
        this.filterTagsContainer.appendChild(controlButton);
        
        // 创建普通标签
        categories.forEach((category, index) => {
            const tagElement = this.createTagElement(category, activeSet.has(category), index + 1);
            this.filterTagsContainer.appendChild(tagElement);
        });
    }
    
    // 创建控制按钮（全选/全不选）
    createControlButton() {
        const activeSet = this.activeStates[this.currentTab];
        const totalCount = this.categories[this.currentTab].length;
        const activeCount = activeSet.size;
        
        // 判断按钮文字
        const isAllActive = activeCount === totalCount;
        const buttonText = isAllActive ? '全不选' : '全选';
        const iconText = isAllActive ? '◉' : '○';
        
        const button = document.createElement('div');
        button.className = 'filter-control-btn';
        button.innerHTML = `${iconText} ${buttonText}`;
        button.style.animationDelay = '0s';
        
        // 点击事件
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleAllTags();
        });
        
        return button;
    }
    
    // 创建单个标签元素
    createTagElement(category, isActive, index) {
        const tag = document.createElement('div');
        tag.className = `filter-tag ${isActive ? 'active' : 'inactive'}`;
        tag.textContent = category;
        tag.dataset.category = category;
        tag.style.animationDelay = `${index * 0.05}s`;
        
        // 点击事件
        tag.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleTag(category);
        });
        
        return tag;
    }
    
    // 切换标签状态
    toggleTag(category) {
        const activeSet = this.activeStates[this.currentTab];
        const wasActive = activeSet.has(category);
        
        if (wasActive) {
            // 失活
            activeSet.delete(category);
        } else {
            // 激活
            activeSet.add(category);
        }
        
        // 更新UI
        this.updateTagVisual(category, !wasActive);
        
        // 如果SearchManager可用，直接触发搜索更新
        if (window.SearchManager && window.SearchManager.applyFilters) {
            window.SearchManager.applyFilters();
        } else if (this.onFilterChange) {
            // 回退到自定义回调
            this.onFilterChange(this.currentTab, Array.from(activeSet));
        }
        
        // 更新控制按钮状态
        this.updateControlButton();
        
        console.log(`🏷️ 标签 "${category}" ${wasActive ? '失活' : '激活'}`, Array.from(activeSet));
    }
    
    // 全选/全不选切换
    toggleAllTags() {
        const activeSet = this.activeStates[this.currentTab];
        const totalCount = this.categories[this.currentTab].length;
        const isAllActive = activeSet.size === totalCount;
        
        if (isAllActive) {
            // 全不选：清空所有激活状态
            activeSet.clear();
        } else {
            // 全选：激活所有标签
            this.categories[this.currentTab].forEach(category => {
                activeSet.add(category);
            });
        }
        
        // 重新渲染所有标签
        this.renderTags();
        
        // 触发筛选更新
        if (window.SearchManager && window.SearchManager.applyFilters) {
            window.SearchManager.applyFilters();
        } else if (this.onFilterChange) {
            this.onFilterChange(this.currentTab, Array.from(activeSet));
        }
        
        console.log(`🔄 ${isAllActive ? '全不选' : '全选'} 操作完成:`, Array.from(activeSet));
    }
    
    // 更新控制按钮显示状态
    updateControlButton() {
        const controlBtn = this.filterTagsContainer?.querySelector('.filter-control-btn');
        if (!controlBtn) return;
        
        const activeSet = this.activeStates[this.currentTab];
        const totalCount = this.categories[this.currentTab].length;
        const isAllActive = activeSet.size === totalCount;
        
        const buttonText = isAllActive ? '全不选' : '全选';
        const iconText = isAllActive ? '◉' : '○';
        controlBtn.innerHTML = `${iconText} ${buttonText}`;
    }
    
    // 更新标签视觉状态
    updateTagVisual(category, isActive) {
        const tagElement = this.filterTagsContainer.querySelector(`[data-category="${category}"]`);
        if (!tagElement) return;
        
        // 移除当前状态类
        tagElement.classList.remove('active', 'inactive');
        
        // 添加新状态类
        tagElement.classList.add(isActive ? 'active' : 'inactive');
        
        // 添加点击动画效果
        tagElement.style.transform = 'scale(0.95)';
        setTimeout(() => {
            tagElement.style.transform = '';
        }, 100);
    }
    
    // 获取当前激活的标签
    getActiveTags(tabName = null) {
        const tab = tabName || this.currentTab;
        return Array.from(this.activeStates[tab]);
    }
    
    // 重置所有标签为激活状态
    resetAllTags(tabName = null) {
        const tab = tabName || this.currentTab;
        this.activeStates[tab] = new Set(this.categories[tab]);
        
        if (tab === this.currentTab) {
            this.renderTags();
        }
        
        // 触发筛选变化回调
        if (this.onFilterChange) {
            this.onFilterChange(tab, Array.from(this.activeStates[tab]));
        }
        
        console.log('🔄 重置标签为全部激活:', tab);
    }
    
    // 检查项目是否匹配激活的标签
    matchesActiveTags(item, tabName = null) {
        const tab = tabName || this.currentTab;
        const activeTags = this.activeStates[tab];
        
        // 如果没有激活的标签，显示所有内容
        if (activeTags.size === 0) {
            return true;
        }
        
        // 获取项目的分类
        const itemCategory = this.getItemCategory(item, tab);
        
        // 检查是否匹配任一激活标签
        for (const activeTag of activeTags) {
            if (this.categoryMatches(itemCategory, activeTag, tab)) {
                return true;
            }
        }
        
        return false;
    }
    
    // 获取项目的分类
    getItemCategory(item, tab) {
        switch (tab) {
            case 'books':
                return item.category || item.genre || '其它';
            case 'movies':
                return item.category || '其它';
            case 'music':
                return item.category || item.genre || '其它';
            default:
                return '其它';
        }
    }
    
    // 检查分类是否匹配标签
    categoryMatches(itemCategory, activeTag, tab) {
        const mapping = this.categoryMapping[tab][activeTag];
        
        if (Array.isArray(mapping)) {
            // 多个可能的匹配值
            return mapping.includes(itemCategory);
        } else if (typeof mapping === 'string') {
            // 单个匹配值
            return itemCategory === mapping;
        }
        
        // 直接匹配
        return itemCategory === activeTag;
    }
    
    // 获取统计信息
    getStats() {
        const stats = {};
        for (const tab in this.activeStates) {
            stats[tab] = {
                total: this.categories[tab].length,
                active: this.activeStates[tab].size,
                inactive: this.categories[tab].length - this.activeStates[tab].size
            };
        }
        return stats;
    }
}

// 全局标签筛选管理器实例
window.TagFilterManager = window.TagFilterManager || new TagFilterManager();