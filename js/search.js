/**
 * 搜索和筛选功能模块
 */

// 筛选器选项配置
const FILTER_OPTIONS = {
    books: {
        status: [
            { value: 'all', text: '全部状态' },
            { value: 'reading', text: '正在读' },
            { value: 'finished', text: '已读完' },
            { value: 'want_to_read', text: '想读' },
            { value: 'paused', text: '暂停' }
        ],
        category: [
            { value: 'all', text: '全部分类' },
            { value: '文学小说', text: '文学小说' },
            { value: '技术编程', text: '技术编程' },
            { value: '心理学', text: '心理学' },
            { value: '历史传记', text: '历史传记' },
            { value: '哲学思辨', text: '哲学思辨' },
            { value: '经济管理', text: '经济管理' },
            { value: '科普百科', text: '科普百科' },
            { value: '生活实用', text: '生活实用' },
            { value: '其他', text: '其他' }
        ],
        extra: {
            label: '推荐等级',
            options: [
                { value: 'all', text: '全部等级' },
                { value: '5', text: '5星力荐' },
                { value: '4', text: '4星推荐' },
                { value: '3', text: '3星一般' },
                { value: '1,2', text: '1-2星' }
            ]
        }
    },
    movies: {
        status: [
            { value: 'all', text: '全部状态' },
            { value: '已观看', text: '已观看' },
            { value: '想看', text: '想看' },
            { value: '重看清单', text: '重看清单' }
        ],
        category: [
            { value: 'all', text: '全部分类' },
            { value: '剧情片', text: '剧情片' },
            { value: '喜剧片', text: '喜剧片' },
            { value: '动画片', text: '动画片' },
            { value: '纪录片', text: '纪录片' },
            { value: '科幻片', text: '科幻片' },
            { value: '悬疑片', text: '悬疑片' },
            { value: '动作片', text: '动作片' },
            { value: '爱情片', text: '爱情片' },
            { value: '其他', text: '其他' }
        ],
        extra: {
            label: '情绪标签',
            options: [
                { value: 'all', text: '全部标签' },
                { value: '治愈系', text: '治愈系' },
                { value: '励志向上', text: '励志向上' },
                { value: '悬疑烧脑', text: '悬疑烧脑' },
                { value: '轻松搞笑', text: '轻松搞笑' },
                { value: '深度思考', text: '深度思考' },
                { value: '视觉震撼', text: '视觉震撼' },
                { value: '其他', text: '其他' }
            ]
        }
    },
    music: {
        status: [
            { value: 'all', text: '全部状态' },
            { value: 'current', text: '当前歌单' },
            { value: 'archived', text: '历史记录' }
        ],
        category: [
            { value: 'all', text: '全部分类' },
            { value: '民谣', text: '民谣' },
            { value: '摇滚', text: '摇滚' },
            { value: '古典', text: '古典' },
            { value: '电子', text: '电子' },
            { value: '流行', text: '流行' },
            { value: '爵士', text: '爵士' },
            { value: '说唱', text: '说唱' },
            { value: '轻音乐', text: '轻音乐' },
            { value: '其他', text: '其他' }
        ],
        extra: {
            label: '使用场景',
            options: [
                { value: 'all', text: '全部场景' },
                { value: '工作专注', text: '工作专注' },
                { value: '运动健身', text: '运动健身' },
                { value: '睡前放松', text: '睡前放松' },
                { value: '通勤路上', text: '通勤路上' },
                { value: '聚会活动', text: '聚会活动' },
                { value: '独处时光', text: '独处时光' },
                { value: '其他', text: '其他' }
            ]
        }
    }
};

// 搜索状态管理
const SearchState = {
    currentQuery: '',
    currentSort: 'id-asc',
    currentTab: 'books',
    isSearching: false,
    
    // 多维度筛选状态
    filters: {
        status: 'all',
        category: 'all',
        extra: 'all'
    },
    
    // 分页状态
    pagination: {
        books: { currentPage: 1, pageSize: 8 },
        movies: { currentPage: 1, pageSize: 8 },
        music: { currentPage: 1, pageSize: 8 }
    },
    
    // 原始数据缓存
    originalData: {
        books: [],
        movies: [],
        music: []
    },
    
    // 过滤后的数据
    filteredData: {
        books: [],
        movies: [],
        music: []
    }
};

/**
 * 搜索管理器
 */
const SearchManager = {
    
    /**
     * 初始化搜索功能
     */
    init() {
        this.initPageSizes();
        this.initFilterOptions();
        this.bindEvents();
        this.updateCounts();
    },
    
    /**
     * 初始化分页大小，从HTML的selected属性读取
     */
    initPageSizes() {
        ['books', 'movies', 'music'].forEach(type => {
            const pageSizeSelect = document.getElementById(`${type}PageSize`);
            if (pageSizeSelect) {
                if (pageSizeSelect.classList.contains('custom-dropdown')) {
                    // 自定义下拉菜单：通过dropdown管理器获取当前值
                    const dropdown = window.DropdownManager?.get(`${type}PageSize`);
                    if (dropdown) {
                        const currentValue = dropdown.getValue();
                        if (currentValue) {
                            SearchState.pagination[type].pageSize = parseInt(currentValue);
                        }
                    }
                } else {
                    // 传统select：查找selected选项
                    const selectedOption = pageSizeSelect.querySelector('option[selected]');
                    if (selectedOption) {
                        SearchState.pagination[type].pageSize = parseInt(selectedOption.value);
                    }
                }
            }
        });
    },
    
    /**
     * 初始化筛选器选项
     */
    initFilterOptions() {
        // 初始化为books的选项
        this.updateFilterOptions('books');
    },
    
    /**
     * 根据当前tab更新筛选器选项
     */
    updateFilterOptions(tabType) {
        const statusFilter = document.getElementById('statusFilter');
        const categoryFilter = document.getElementById('categoryFilter');
        const extraFilter = document.getElementById('extraFilter');
        
        if (!FILTER_OPTIONS[tabType]) return;
        
        const options = FILTER_OPTIONS[tabType];
        
        // 更新状态筛选器（支持自定义下拉菜单）
        if (statusFilter) {
            if (statusFilter.classList.contains('custom-dropdown')) {
                // 自定义下拉菜单
                const dropdown = window.DropdownManager.get('statusFilter');
                if (dropdown) {
                    dropdown.setOptions(options.status);
                }
            } else {
                // 传统select元素
                statusFilter.innerHTML = '';
                options.status.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.value;
                    optionElement.textContent = option.text;
                    statusFilter.appendChild(optionElement);
                });
            }
        }
        
        // 更新分类筛选器（支持自定义下拉菜单）
        if (categoryFilter) {
            if (categoryFilter.classList.contains('custom-dropdown')) {
                // 自定义下拉菜单
                const dropdown = window.DropdownManager.get('categoryFilter');
                if (dropdown) {
                    dropdown.setOptions(options.category);
                }
            } else {
                // 传统select元素
                categoryFilter.innerHTML = '';
                options.category.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.value;
                    optionElement.textContent = option.text;
                    categoryFilter.appendChild(optionElement);
                });
            }
        }
        
        // 更新附加筛选器（支持自定义下拉菜单）
        if (extraFilter && options.extra) {
            if (extraFilter.classList.contains('custom-dropdown')) {
                // 自定义下拉菜单
                const dropdown = window.DropdownManager.get('extraFilter');
                if (dropdown) {
                    // 更新标签文本
                    const trigger = extraFilter.querySelector('.dropdown-label');
                    if (trigger) {
                        trigger.textContent = `全部${options.extra.label}`;
                    }
                    dropdown.setOptions(options.extra.options);
                }
            } else {
                // 传统select元素
                extraFilter.innerHTML = '';
                // 设置placeholder显示筛选器类型
                const placeholderOption = document.createElement('option');
                placeholderOption.value = 'all';
                placeholderOption.textContent = `全部${options.extra.label}`;
                extraFilter.appendChild(placeholderOption);
                
                options.extra.options.slice(1).forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.value;
                    optionElement.textContent = option.text;
                    extraFilter.appendChild(optionElement);
                });
            }
        }
        
        // 重置筛选状态
        SearchState.filters = {
            status: 'all',
            category: 'all',
            extra: 'all'
        };
    },
    
    /**
     * 绑定事件
     */
    bindEvents() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const clearBtn = document.getElementById('clearSearchBtn');
        const sortSelect = document.getElementById('sortSelect');
        const statusFilter = document.getElementById('statusFilter');
        const categoryFilter = document.getElementById('categoryFilter');
        const extraFilter = document.getElementById('extraFilter');
        
        // 搜索输入事件（防抖）
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                this.handleSearch(e.target.value);
            }, 300));
            
            // 回车搜索
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(e.target.value);
                }
            });
        }
        
        // 搜索按钮
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput ? searchInput.value : '';
                this.handleSearch(query);
            });
        }
        
        // 清除搜索
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearSearch();
            });
        }
        
        // 排序变化（支持自定义下拉菜单）
        if (sortSelect) {
            if (sortSelect.classList.contains('custom-dropdown')) {
                // 自定义下拉菜单事件
                sortSelect.addEventListener('dropdown:select', (e) => {
                    SearchState.currentSort = e.detail.value;
                    this.resetPagination();
                    this.applyFilters();
                });
            } else {
                // 传统select事件
                sortSelect.addEventListener('change', (e) => {
                    SearchState.currentSort = e.target.value;
                    this.resetPagination();
                    this.applyFilters();
                });
            }
        }
        
        // 状态筛选（支持自定义下拉菜单）
        if (statusFilter) {
            if (statusFilter.classList.contains('custom-dropdown')) {
                // 自定义下拉菜单事件
                statusFilter.addEventListener('dropdown:select', (e) => {
                    SearchState.filters.status = e.detail.value;
                    this.resetPagination();
                    this.applyFilters();
                });
            } else {
                // 传统select事件
                statusFilter.addEventListener('change', (e) => {
                    SearchState.filters.status = e.target.value;
                    this.resetPagination();
                    this.applyFilters();
                });
            }
        }
        
        // 分类筛选（支持自定义下拉菜单）
        if (categoryFilter) {
            if (categoryFilter.classList.contains('custom-dropdown')) {
                // 自定义下拉菜单事件
                categoryFilter.addEventListener('dropdown:select', (e) => {
                    SearchState.filters.category = e.detail.value;
                    this.resetPagination();
                    this.applyFilters();
                });
            } else {
                // 传统select事件
                categoryFilter.addEventListener('change', (e) => {
                    SearchState.filters.category = e.target.value;
                    this.resetPagination();
                    this.applyFilters();
                });
            }
        }
        
        // 附加筛选（支持自定义下拉菜单）
        if (extraFilter) {
            if (extraFilter.classList.contains('custom-dropdown')) {
                // 自定义下拉菜单事件
                extraFilter.addEventListener('dropdown:select', (e) => {
                    SearchState.filters.extra = e.detail.value;
                    this.resetPagination();
                    this.applyFilters();
                });
            } else {
                // 传统select事件
                extraFilter.addEventListener('change', (e) => {
                    SearchState.filters.extra = e.target.value;
                    this.resetPagination();
                    this.applyFilters();
                });
            }
        }
        
        // 标签页切换
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const newTab = btn.getAttribute('data-tab');
                if (newTab !== SearchState.currentTab) {
                    SearchState.currentTab = newTab;
                    this.updateFilterOptions(newTab);
                    this.updateTabState();
                    this.applyFilters();
                }
            });
        });
        
        // 分页大小选择器
        ['books', 'movies', 'music'].forEach(type => {
            const pageSizeSelect = document.getElementById(`${type}PageSize`);
            if (pageSizeSelect) {
                if (pageSizeSelect.classList.contains('custom-dropdown')) {
                    // 自定义下拉菜单事件
                    pageSizeSelect.addEventListener('dropdown:select', (e) => {
                        SearchState.pagination[type].pageSize = parseInt(e.detail.value);
                        SearchState.pagination[type].currentPage = 1;
                        this.renderCurrentTab();
                    });
                } else {
                    // 传统select事件
                    pageSizeSelect.addEventListener('change', (e) => {
                        SearchState.pagination[type].pageSize = parseInt(e.target.value);
                        SearchState.pagination[type].currentPage = 1;
                        this.renderCurrentTab();
                    });
                }
            }
        });
    },
    
    /**
     * 设置原始数据
     */
    setData(books, movies, music) {
        SearchState.originalData.books = this.normalizeBooks(books);
        SearchState.originalData.movies = this.normalizeMovies(movies);
        SearchState.originalData.music = this.normalizeMusic(music);
        
        // 初始化过滤数据
        SearchState.filteredData = JSON.parse(JSON.stringify(SearchState.originalData));
        
        this.updateCounts();
    },
    
    /**
     * 标准化书籍数据
     */
    normalizeBooks(booksData) {
        if (!booksData) return [];
        
        const currentReading = booksData.currentReading || [];
        const recentlyFinished = booksData.recentlyFinished || [];
        
        return [...currentReading, ...recentlyFinished].map(book => ({
            ...book,
            type: 'book',
            searchText: `${book.title} ${book.author} ${book.genre || ''} ${book.thoughts || book.review || ''}`.toLowerCase()
        }));
    },
    
    /**
     * 标准化电影数据
     */
    normalizeMovies(moviesData) {
        if (!moviesData || !moviesData.recentWatched) return [];
        
        return moviesData.recentWatched.map(movie => ({
            ...movie,
            type: 'movie',
            searchText: `${movie.title} ${movie.director} ${Array.isArray(movie.genre) ? movie.genre.join(' ') : (movie.genre || '')} ${movie.review || movie.comment || ''}`.toLowerCase()
        }));
    },
    
    /**
     * 标准化音乐数据
     */
    normalizeMusic(musicData) {
        if (!musicData || !musicData.currentListening) return [];
        
        return musicData.currentListening.map(song => ({
            ...song,
            type: 'music',
            searchText: `${song.songName || song.song_name} ${song.artist} ${song.album || ''} ${song.genre || ''} ${song.mood || ''} ${song.reason || ''}`.toLowerCase()
        }));
    },
    
    /**
     * 处理搜索
     */
    handleSearch(query) {
        SearchState.currentQuery = query.trim();
        this.resetPagination();
        
        // 显示/隐藏清除按钮
        const clearBtn = document.getElementById('clearSearchBtn');
        if (clearBtn) {
            clearBtn.style.display = SearchState.currentQuery ? 'block' : 'none';
        }
        
        this.applyFilters();
    },
    
    /**
     * 重置分页
     */
    resetPagination() {
        SearchState.pagination.books.currentPage = 1;
        SearchState.pagination.movies.currentPage = 1;
        SearchState.pagination.music.currentPage = 1;
    },
    
    /**
     * 清除搜索
     */
    clearSearch() {
        SearchState.currentQuery = '';
        SearchState.currentPage = 1;
        
        const searchInput = document.getElementById('searchInput');
        const clearBtn = document.getElementById('clearSearchBtn');
        
        if (searchInput) searchInput.value = '';
        if (clearBtn) clearBtn.style.display = 'none';
        
        this.applyFilters();
    },
    
    /**
     * 应用筛选
     */
    applyFilters() {
        SearchState.isSearching = true;
        
        // 过滤数据
        SearchState.filteredData.books = this.filterAndSort(SearchState.originalData.books, 'books');
        SearchState.filteredData.movies = this.filterAndSort(SearchState.originalData.movies, 'movies');
        SearchState.filteredData.music = this.filterAndSort(SearchState.originalData.music, 'music');
        
        // 更新计数
        this.updateCounts();
        
        // 重新渲染当前标签页
        this.renderCurrentTab();
        
        SearchState.isSearching = false;
    },
    
    /**
     * 筛选和排序数据
     */
    filterAndSort(data, type) {
        let filtered = [...data];
        
        // 文本搜索
        if (SearchState.currentQuery) {
            filtered = filtered.filter(item => 
                item.searchText.includes(SearchState.currentQuery.toLowerCase())
            );
        }
        
        // 多维度筛选
        filtered = this.applyMultiFilters(filtered, type);
        
        // 排序
        filtered.sort((a, b) => {
            switch (SearchState.currentSort) {
                case 'title-asc':
                    return (a.title || a.songName || a.song_name).localeCompare(b.title || b.songName || b.song_name);
                case 'title-desc':
                    return (b.title || b.songName || b.song_name).localeCompare(a.title || a.songName || a.song_name);
                case 'rating-desc':
                    return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
                case 'rating-asc':
                    return (parseFloat(a.rating) || 0) - (parseFloat(b.rating) || 0);
                case 'date-desc':
                    return new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0);
                case 'date-asc':
                    return new Date(a.updated_at || a.created_at || 0) - new Date(b.updated_at || b.created_at || 0);
                case 'id-asc':
                default:
                    return (a.id || 0) - (b.id || 0);
            }
        });
        
        return filtered;
    },
    
    /**
     * 应用多维度筛选
     */
    applyMultiFilters(data, type) {
        let filtered = [...data];
        
        // 状态筛选
        if (SearchState.filters.status !== 'all') {
            filtered = filtered.filter(item => {
                return item.status === SearchState.filters.status || 
                       item.watch_status === SearchState.filters.status;
            });
        }
        
        // 分类筛选
        if (SearchState.filters.category !== 'all') {
            filtered = filtered.filter(item => {
                return item.category === SearchState.filters.category;
            });
        }
        
        // 附加筛选
        if (SearchState.filters.extra !== 'all') {
            filtered = filtered.filter(item => {
                switch (type) {
                    case 'books':
                        // 推荐等级筛选
                        if (SearchState.filters.extra === '1,2') {
                            return item.recommendation_level <= 2;
                        }
                        return item.recommendation_level == SearchState.filters.extra;
                    
                    case 'movies':
                        // 情绪标签筛选
                        return item.mood_tag === SearchState.filters.extra;
                    
                    case 'music':
                        // 使用场景筛选
                        return item.scene === SearchState.filters.extra;
                    
                    default:
                        return true;
                }
            });
        }
        
        return filtered;
    },
    
    /**
     * 更新计数显示
     */
    updateCounts() {
        const booksCount = document.getElementById('booksCount');
        const moviesCount = document.getElementById('moviesCount');
        const musicCount = document.getElementById('musicCount');
        
        if (booksCount) {
            booksCount.textContent = `(${SearchState.filteredData.books.length})`;
        }
        if (moviesCount) {
            moviesCount.textContent = `(${SearchState.filteredData.movies.length})`;
        }
        if (musicCount) {
            musicCount.textContent = `(${SearchState.filteredData.music.length})`;
        }
    },
    
    /**
     * 更新标签页状态
     */
    updateTabState() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        // 更新按钮状态
        tabBtns.forEach(btn => {
            if (btn.getAttribute('data-tab') === SearchState.currentTab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // 更新内容显示
        tabContents.forEach(content => {
            if (content.id === `${SearchState.currentTab}-content`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // 渲染当前标签页
        this.renderCurrentTab();
    },
    
    /**
     * 渲染当前标签页
     */
    renderCurrentTab() {
        const data = SearchState.filteredData[SearchState.currentTab];
        
        switch (SearchState.currentTab) {
            case 'books':
                this.renderFilteredBooks(data);
                break;
            case 'movies':
                this.renderFilteredMovies(data);
                break;
            case 'music':
                this.renderFilteredMusic(data);
                break;
        }
    },
    
    /**
     * 渲染筛选后的书籍
     */
    renderFilteredBooks(books) {
        const container = document.getElementById('books-container');
        const paginationContainer = document.getElementById('booksPagination');
        if (!container) return;
        
        if (books.length === 0) {
            container.innerHTML = this.getNoResultsHTML('书籍');
            if (paginationContainer) paginationContainer.style.display = 'none';
            return;
        }
        
        // 分页逻辑
        const pagination = SearchState.pagination.books;
        const totalPages = Math.ceil(books.length / pagination.pageSize);
        const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
        const endIndex = startIndex + pagination.pageSize;
        const pagedBooks = books.slice(startIndex, endIndex);
        
        // 渲染书籍
        container.innerHTML = pagedBooks.map(book => {
            const coverUrl = book.cover_image || book.cover || (window.ImageUtils ? window.ImageUtils.getBookCover(book.id) : '');
            const title = this.highlightSearchText(book.title);
            const author = this.highlightSearchText(book.author);
            
            return `
            <div class="book-card hover-lift animate-in" data-id="${book.id}">
                <div class="book-cover">
                    <img src="${coverUrl}" alt="${book.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMTA3IiB2aWV3Qm94PSIwIDAgODAgMTA3IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSIxMDciIGZpbGw9IiM0RUNEQzQiIG9wYWNpdHk9IjAuMyIvPjx0ZXh0IHg9IjQwIiB5PSI1NCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM0RUNEQzQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuS5puexuzwvdGV4dD48L3N2Zz4='" />
                </div>
                <div class="book-info">
                    <h4 class="book-title">${title}</h4>
                    <p class="book-author">${author}</p>
                    <p class="book-status">${book.status === 'reading' ? '在读' : '已完成'}</p>
                    ${book.progress ? `
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${book.progress}%"></div>
                        </div>
                        <p class="progress-text">${book.progress}%</p>
                    ` : ''}
                    <div class="rating">
                        <span class="stars">${this.generateStars(book.rating)}</span>
                        <span class="rating-text">${book.rating}/5</span>
                    </div>
                    <p class="book-thoughts">${book.thoughts || book.review || '暂无感想'}</p>
                </div>
            </div>
            `;
        }).join('');
        
        // 渲染分页器
        this.renderPagination('books', pagination.currentPage, totalPages, books.length);
    },
    
    /**
     * 渲染筛选后的电影
     */
    renderFilteredMovies(movies) {
        const container = document.getElementById('movies-container');
        const paginationContainer = document.getElementById('moviesPagination');
        if (!container) return;
        
        if (movies.length === 0) {
            container.innerHTML = this.getNoResultsHTML('电影');
            if (paginationContainer) paginationContainer.style.display = 'none';
            return;
        }
        
        // 分页逻辑
        const pagination = SearchState.pagination.movies;
        const totalPages = Math.ceil(movies.length / pagination.pageSize);
        const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
        const endIndex = startIndex + pagination.pageSize;
        const pagedMovies = movies.slice(startIndex, endIndex);
        
        container.innerHTML = pagedMovies.map(movie => {
            const posterUrl = movie.poster_image || movie.poster || (window.ImageUtils ? window.ImageUtils.getMoviePoster(movie.id) : '');
            const title = this.highlightSearchText(movie.title);
            const director = this.highlightSearchText(movie.director);
            const genres = Array.isArray(movie.genre) ? movie.genre.join('/') : (movie.genre || '未知');
            
            return `
            <div class="movie-card hover-lift animate-in" data-id="${movie.id}">
                <div class="movie-poster">
                    <img src="${posterUrl}" alt="${movie.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgODAgMTIwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiM0NUI3RDEiIG9wYWNpdHk9IjAuMyIvPjx0ZXh0IHg9IjQwIiB5PSI2MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM0NUI3RDEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPueUteW9sTwvdGV4dD48L3N2Zz4='" />
                </div>
                <div class="movie-info">
                    <h4 class="movie-title">${title}</h4>
                    <p class="movie-director">${director}</p>
                    <p class="movie-year">${movie.year || movie.release_year} · ${genres}</p>
                    <div class="rating">
                        <span class="stars">${this.generateStars(movie.rating)}</span>
                        <span class="rating-text">${movie.rating}/5</span>
                    </div>
                    <p class="movie-review">${movie.quotes || movie.review || '暂无台词'}</p>
                </div>
            </div>
            `;
        }).join('');
        
        // 渲染分页器
        this.renderPagination('movies', pagination.currentPage, totalPages, movies.length);
    },
    
    /**
     * 渲染筛选后的音乐
     */
    renderFilteredMusic(music) {
        const container = document.getElementById('music-container');
        const paginationContainer = document.getElementById('musicPagination');
        if (!container) return;
        
        if (music.length === 0) {
            container.innerHTML = this.getNoResultsHTML('音乐');
            if (paginationContainer) paginationContainer.style.display = 'none';
            return;
        }
        
        // 分页逻辑
        const pagination = SearchState.pagination.music;
        const totalPages = Math.ceil(music.length / pagination.pageSize);
        const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
        const endIndex = startIndex + pagination.pageSize;
        const pagedMusic = music.slice(startIndex, endIndex);
        
        container.innerHTML = pagedMusic.map(song => {
            const albumUrl = song.album_cover || song.albumCover || (window.ImageUtils ? window.ImageUtils.getAlbumCover(song.id) : '');
            const title = this.highlightSearchText(song.songName || song.song_name);
            const artist = this.highlightSearchText(song.artist);
            
            return `
            <div class="music-card hover-lift animate-in" data-id="${song.id}" data-mood="${song.mood}">
                <div class="album-cover">
                    <img src="${albumUrl}" alt="${song.album}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSI0MCIgZmlsbD0iI0ZGQTcwQSIgb3BhY2l0eT0iMC4zIi8+PHRleHQgeD0iNDAiIHk9IjQ0IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0ZGQTcwQSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+6Z+z5LmQPC90ZXh0Pjwvc3ZnPg=='" />
                </div>
                <div class="music-info">
                    <h4 class="music-title">${title}</h4>
                    <p class="music-artist">${artist}</p>
                    <p class="music-genre">${song.genre} · ${song.language}</p>
                    <span class="music-mood">${song.mood}</span>
                    <p class="music-reason">${song.lyrics_snippet || song.reason || '♪ 暂无歌词片段'}</p>
                </div>
            </div>
            `;
        }).join('');
        
        // 渲染分页器
        this.renderPagination('music', pagination.currentPage, totalPages, music.length);
    },
    
    /**
     * 高亮搜索文本
     */
    highlightSearchText(text) {
        if (!SearchState.currentQuery || !text) return text;
        
        const regex = new RegExp(`(${SearchState.currentQuery})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    },
    
    /**
     * 生成无结果HTML
     */
    getNoResultsHTML(type) {
        return `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <div class="no-results-text">没有找到相关${type}</div>
                <div class="no-results-suggestion">试试修改搜索关键词或筛选条件</div>
            </div>
        `;
    },
    
    /**
     * 渲染分页器
     */
    renderPagination(type, currentPage, totalPages, totalItems) {
        const paginationContainer = document.getElementById(`${type}Pagination`);
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.style.display = 'none';
            return;
        }
        
        paginationContainer.style.display = 'flex';
        
        const pagination = SearchState.pagination[type];
        const startItem = (currentPage - 1) * pagination.pageSize + 1;
        const endItem = Math.min(currentPage * pagination.pageSize, totalItems);
        
        let paginationHTML = '';
        
        // 上一页按钮
        paginationHTML += `
            <button class="pagination-btn" ${currentPage <= 1 ? 'disabled' : ''} 
                    onclick="SearchManager.goToPage('${type}', ${currentPage - 1})">
                ‹ 上一页
            </button>
        `;
        
        // 页码按钮
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // 调整起始页
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // 第一页
        if (startPage > 1) {
            paginationHTML += `
                <button class="pagination-btn" onclick="SearchManager.goToPage('${type}', 1)">1</button>
            `;
            if (startPage > 2) {
                paginationHTML += '<span class="pagination-ellipsis">...</span>';
            }
        }
        
        // 页码
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                        onclick="SearchManager.goToPage('${type}', ${i})">
                    ${i}
                </button>
            `;
        }
        
        // 最后一页
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += '<span class="pagination-ellipsis">...</span>';
            }
            paginationHTML += `
                <button class="pagination-btn" onclick="SearchManager.goToPage('${type}', ${totalPages})">${totalPages}</button>
            `;
        }
        
        // 下一页按钮
        paginationHTML += `
            <button class="pagination-btn" ${currentPage >= totalPages ? 'disabled' : ''} 
                    onclick="SearchManager.goToPage('${type}', ${currentPage + 1})">
                下一页 ›
            </button>
        `;
        
        // 信息显示
        paginationHTML += `
            <div class="pagination-info">
                显示 ${startItem}-${endItem} 条，共 ${totalItems} 条
            </div>
        `;
        
        paginationContainer.innerHTML = paginationHTML;
    },
    
    /**
     * 跳转到指定页
     */
    goToPage(type, page) {
        const totalItems = SearchState.filteredData[type].length;
        const pagination = SearchState.pagination[type];
        const totalPages = Math.ceil(totalItems / pagination.pageSize);
        
        if (page < 1 || page > totalPages) return;
        
        SearchState.pagination[type].currentPage = page;
        
        // 重新渲染当前类型
        if (SearchState.currentTab === type) {
            this.renderCurrentTab();
        }
        
        // 滚动到顶部
        document.querySelector('.search-controls').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    },
    
    /**
     * 生成星星评分
     */
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '★';
        }
        if (hasHalfStar) {
            starsHTML += '☆';
        }
        for (let i = Math.ceil(rating); i < 5; i++) {
            starsHTML += '☆';
        }
        
        return starsHTML;
    }
};

// 暴露到全局
window.SearchManager = SearchManager;
window.SearchState = SearchState;

console.log('🔍 搜索模块已加载');