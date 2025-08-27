/**
 * 移动端UX交互管理器
 * 负责移动端专用功能的交互逻辑
 */

class MobileUXManager {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.searchPanel = null;
        this.searchFab = null;
        this.profileToggle = null;
        this.loadMoreButtons = {};
        this.currentPage = { books: 1, movies: 1, music: 1 };
        this.pageSize = 8;
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        // 无论是否移动端都初始化，让CSS来控制显示隐藏
        this.initElements();
        this.bindEvents();
        
        // 移动端现在使用分页导航，不需要setupLoadMore
        // if (this.isMobile) {
        //     this.setupLoadMore();
        // }
        
        this.handleResize();
        
        console.log('🔸 移动端UX管理器初始化完成', { isMobile: this.isMobile, mode: 'pagination' });
    }
    
    initElements() {
        this.searchFab = document.getElementById('mobileSearchFab');
        this.searchPanel = document.getElementById('mobileSearchPanel');
        this.searchClose = document.getElementById('mobileSearchClose');
        this.profileToggle = document.getElementById('mobileProfileToggle');
        this.profileExpandable = document.getElementById('profileDetailsExpandable');
        this.profileToggleIcon = this.profileToggle?.querySelector('.mobile-profile-toggle-icon');
        
        // 搜索相关元素
        this.mobileSearchInput = document.getElementById('mobileSearchInput');
        this.mobileSearchBtn = document.getElementById('mobileSearchBtn');
        this.mobileSortSelect = document.getElementById('mobileSortSelect');
        this.mobileStatusFilter = document.getElementById('mobileStatusFilter');
        this.mobileCategoryFilter = document.getElementById('mobileCategoryFilter');
        this.mobileResetBtn = document.getElementById('mobileResetFilters');
        this.mobileApplyBtn = document.getElementById('mobileApplyFilters');
        
        // 加载更多按钮
        this.loadMoreButtons = {
            books: document.getElementById('booksLoadMore'),
            movies: document.getElementById('moviesLoadMore'),
            music: document.getElementById('musicLoadMore')
        };
    }
    
    bindEvents() {
        // 搜索面板控制
        this.searchFab?.addEventListener('click', () => this.openSearchPanel());
        this.searchClose?.addEventListener('click', () => this.closeSearchPanel());
        this.searchPanel?.addEventListener('click', (e) => {
            if (e.target === this.searchPanel) {
                this.closeSearchPanel();
            }
        });
        
        // 侧边栏折叠控制
        this.profileToggle?.addEventListener('click', () => this.toggleProfile());
        
        // 搜索功能
        this.mobileSearchBtn?.addEventListener('click', () => this.performSearch());
        this.mobileSearchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
        
        // 筛选功能
        this.mobileResetBtn?.addEventListener('click', () => this.resetFilters());
        this.mobileApplyBtn?.addEventListener('click', () => this.applyFilters());
        
        // 加载更多按钮
        Object.keys(this.loadMoreButtons).forEach(type => {
            const btn = this.loadMoreButtons[type]?.querySelector('.load-more-btn');
            btn?.addEventListener('click', () => this.loadMore(type));
        });
        
        // 键盘支持
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.searchPanel?.classList.contains('active')) {
                this.closeSearchPanel();
            }
        });
        
        // 窗口调整事件
        window.addEventListener('resize', () => this.handleResize());
    }
    
    setupLoadMore() {
        // 移动端现在使用分页导航，不再使用加载更多按钮
        // 但保留代码结构以防需要切换回加载更多模式
        console.log('🔸 移动端使用分页导航模式，跳过加载更多设置');
        return;
        
        // 检测当前活跃的tab并显示对应的加载更多按钮
        const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab;
        this.showLoadMoreButton(activeTab);
        
        // 监听tab切换
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabType = btn.dataset.tab;
                setTimeout(() => this.showLoadMoreButton(tabType), 100);
            });
        });
    }
    
    showLoadMoreButton(type) {
        if (!this.isMobile || !type) return;
        
        // 隐藏所有加载更多按钮
        Object.values(this.loadMoreButtons).forEach(btn => {
            if (btn) btn.style.display = 'none';
        });
        
        // 显示当前类型的按钮
        const currentBtn = this.loadMoreButtons[type];
        if (currentBtn) {
            currentBtn.style.display = 'block';
            this.updateLoadMoreButton(type);
        }
    }
    
    updateLoadMoreButton(type) {
        const btn = this.loadMoreButtons[type]?.querySelector('.load-more-btn');
        const text = btn?.querySelector('.load-more-text');
        
        if (!btn || !text) return;
        
        // 检查是否还有更多数据
        const hasMore = this.checkHasMoreData(type);
        
        if (hasMore) {
            btn.disabled = false;
            text.textContent = `加载更多${this.getTypeDisplayName(type)}`;
        } else {
            btn.disabled = true;
            text.textContent = `已显示全部${this.getTypeDisplayName(type)}`;
        }
    }
    
    checkHasMoreData(type) {
        // 这里需要与主数据管理器集成，检查是否还有更多数据
        // 暂时返回true，实际实现需要根据数据总量判断
        const totalData = this.getTotalDataCount(type);
        const currentDisplayed = this.currentPage[type] * this.pageSize;
        return currentDisplayed < totalData;
    }
    
    getTotalDataCount(type) {
        // 获取对应类型的总数据量
        const containers = {
            books: document.getElementById('books-container'),
            movies: document.getElementById('movies-container'),
            music: document.getElementById('music-container')
        };
        
        const container = containers[type];
        return container ? container.children.length : 0;
    }
    
    getTypeDisplayName(type) {
        const names = {
            books: '书籍',
            movies: '电影',
            music: '音乐'
        };
        return names[type] || type;
    }
    
    async loadMore(type) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        const btn = this.loadMoreButtons[type]?.querySelector('.load-more-btn');
        const text = btn?.querySelector('.load-more-text');
        const spinner = btn?.querySelector('.load-more-spinner');
        
        // 显示加载状态
        if (btn && text && spinner) {
            btn.disabled = true;
            text.style.display = 'none';
            spinner.style.display = 'block';
        }
        
        try {
            // 增加页码
            this.currentPage[type]++;
            
            // 模拟异步加载（实际应该调用数据加载函数）
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // 这里应该调用实际的数据加载函数
            await this.loadMoreData(type);
            
            // 更新按钮状态
            this.updateLoadMoreButton(type);
            
        } catch (error) {
            console.error(`加载更多${type}数据失败:`, error);
            // 恢复页码
            this.currentPage[type]--;
        } finally {
            // 恢复按钮状态
            if (btn && text && spinner) {
                btn.disabled = false;
                text.style.display = 'block';
                spinner.style.display = 'none';
            }
            
            this.isLoading = false;
        }
    }
    
    async loadMoreData(type) {
        // 这里应该与主数据管理器集成
        // 暂时模拟实现
        console.log(`加载更多${type}数据，页码:`, this.currentPage[type]);
        
        // 实际实现应该：
        // 1. 调用API或数据管理器获取下一页数据
        // 2. 将新数据追加到现有容器中
        // 3. 更新计数器和状态
        
        // 触发自定义事件，让其他模块处理数据加载
        const event = new CustomEvent('mobileLoadMore', {
            detail: { type, page: this.currentPage[type], pageSize: this.pageSize }
        });
        document.dispatchEvent(event);
    }
    
    openSearchPanel() {
        if (!this.searchPanel) return;
        
        this.searchPanel.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // 聚焦搜索输入框
        setTimeout(() => {
            this.mobileSearchInput?.focus();
        }, 300);
        
        // 同步PC端的搜索状态到移动端
        this.syncSearchState();
    }
    
    closeSearchPanel() {
        if (!this.searchPanel) return;
        
        this.searchPanel.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    toggleProfile() {
        if (!this.profileExpandable || !this.profileToggleIcon) return;
        
        const isExpanded = this.profileExpandable.classList.contains('expanded');
        
        if (isExpanded) {
            this.profileExpandable.classList.remove('expanded');
            this.profileToggleIcon.classList.remove('expanded');
        } else {
            this.profileExpandable.classList.add('expanded');
            this.profileToggleIcon.classList.add('expanded');
        }
    }
    
    syncSearchState() {
        // 同步PC端搜索状态到移动端
        const pcSearchInput = document.getElementById('searchInput');
        const pcSortSelect = document.getElementById('sortSelect');
        
        if (pcSearchInput && this.mobileSearchInput) {
            this.mobileSearchInput.value = pcSearchInput.value;
        }
        
        // 同步筛选器状态
        this.syncFilterOptions();
    }
    
    syncFilterOptions() {
        // 根据当前活跃的tab更新筛选器选项
        const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab;
        
        if (activeTab) {
            this.updateMobileFilterOptions(activeTab);
        }
    }
    
    updateMobileFilterOptions(tabType) {
        // 更新状态筛选器选项
        const statusOptions = this.getStatusOptions(tabType);
        this.updateSelectOptions(this.mobileStatusFilter, statusOptions);
        
        // 更新分类筛选器选项
        const categoryOptions = this.getCategoryOptions(tabType);
        this.updateSelectOptions(this.mobileCategoryFilter, categoryOptions);
    }
    
    getStatusOptions(type) {
        const options = {
            books: [
                { value: 'all', text: '全部状态' },
                { value: 'reading', text: '正在阅读' },
                { value: 'finished', text: '已完成' },
                { value: 'paused', text: '暂停阅读' }
            ],
            movies: [
                { value: 'all', text: '全部状态' },
                { value: 'watched', text: '已观看' },
                { value: 'planned', text: '计划观看' }
            ],
            music: [
                { value: 'all', text: '全部状态' },
                { value: 'current', text: '当前收藏' },
                { value: 'archived', text: '已归档' }
            ]
        };
        
        return options[type] || options.books;
    }
    
    getCategoryOptions(type) {
        const options = {
            books: [
                { value: 'all', text: '全部分类' },
                { value: 'fiction', text: '小说' },
                { value: 'non-fiction', text: '非小说' },
                { value: 'technical', text: '技术' }
            ],
            movies: [
                { value: 'all', text: '全部分类' },
                { value: 'drama', text: '剧情' },
                { value: 'action', text: '动作' },
                { value: 'comedy', text: '喜剧' }
            ],
            music: [
                { value: 'all', text: '全部分类' },
                { value: 'pop', text: '流行' },
                { value: 'rock', text: '摇滚' },
                { value: 'classical', text: '古典' }
            ]
        };
        
        return options[type] || options.books;
    }
    
    updateSelectOptions(selectElement, options) {
        if (!selectElement) return;
        
        selectElement.innerHTML = '';
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            selectElement.appendChild(optionElement);
        });
    }
    
    performSearch() {
        const searchTerm = this.mobileSearchInput?.value.trim();
        
        // 同步到PC端搜索
        const pcSearchInput = document.getElementById('searchInput');
        if (pcSearchInput) {
            pcSearchInput.value = searchTerm;
        }
        
        // 触发搜索事件
        const event = new CustomEvent('mobileSearch', {
            detail: { searchTerm }
        });
        document.dispatchEvent(event);
        
        // 关闭搜索面板
        this.closeSearchPanel();
    }
    
    applyFilters() {
        const filters = {
            sort: this.mobileSortSelect?.value,
            status: this.mobileStatusFilter?.value,
            category: this.mobileCategoryFilter?.value
        };
        
        // 触发筛选事件
        const event = new CustomEvent('mobileFilter', {
            detail: filters
        });
        document.dispatchEvent(event);
        
        // 关闭搜索面板
        this.closeSearchPanel();
    }
    
    resetFilters() {
        // 重置所有筛选器
        if (this.mobileSearchInput) this.mobileSearchInput.value = '';
        if (this.mobileSortSelect) this.mobileSortSelect.value = 'id-asc';
        if (this.mobileStatusFilter) this.mobileStatusFilter.value = 'all';
        if (this.mobileCategoryFilter) this.mobileCategoryFilter.value = 'all';
        
        // 触发重置事件
        const event = new CustomEvent('mobileResetFilters');
        document.dispatchEvent(event);
    }
    
    handleResize() {
        const newIsMobile = window.innerWidth <= 768;
        
        if (newIsMobile !== this.isMobile) {
            this.isMobile = newIsMobile;
            
            if (!this.isMobile) {
                // 切换到PC端时，关闭移动端面板
                this.closeSearchPanel();
                document.body.style.overflow = '';
            } else {
                // 切换到移动端时，不需要重新初始化加载更多
                // 因为现在使用分页导航
                console.log('🔸 切换到移动端分页模式');
            }
        }
    }
    
    // 公共API方法
    updateTabContent(type) {
        if (this.isMobile) {
            // 移动端现在使用分页导航，不需要显示加载更多按钮
            // this.showLoadMoreButton(type);
            this.syncFilterOptions();
        }
    }
    
    resetPageState(type) {
        if (type) {
            this.currentPage[type] = 1;
        } else {
            this.currentPage = { books: 1, movies: 1, music: 1 };
        }
    }
    
    destroy() {
        // 清理事件监听器
        window.removeEventListener('resize', this.handleResize);
        document.body.style.overflow = '';
    }
}

// 全局实例
window.MobileUXManager = MobileUXManager;

// 自动初始化（无论屏幕大小）
document.addEventListener('DOMContentLoaded', () => {
    window.mobileUX = new MobileUXManager();
});

// 导出为模块（如果支持）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileUXManager;
}