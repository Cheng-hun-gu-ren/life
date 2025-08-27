// 主要JavaScript逻辑

// 全局变量
let booksData = null;
let moviesData = null;
let musicData = null;
let marathonData = null;

// 页面初始化
async function initPage() {
    try {
        // 加载数据
        await loadAllData();
        
        // 初始化各个组件
        initNavigation();
        initTabs();
        initMobileMenu();
        
        // 渲染内容
        renderBooks();
        renderMovies();
        renderMusic();
        renderMarathon();
        
        // 初始化动画
        initScrollAnimations();
        
        console.log('页面初始化完成');
    } catch (error) {
        console.error('页面初始化失败:', error);
        showError('页面加载失败，请刷新重试');
    }
}

// 数据加载函数 - 使用API调用
async function loadAllData() {
    try {
        // 检查是否有LifeAPI可用
        if (typeof LifeAPI === 'undefined') {
            console.error('LifeAPI未加载，回退到JSON文件读取');
            return await loadAllDataFromJSON();
        }

        console.log('🚀 使用API加载数据...');
        
        // 使用API加载数据
        const allData = await LifeAPI.loadAllData();
        
        booksData = allData.books;
        moviesData = allData.movies;
        musicData = allData.music;
        marathonData = allData.marathon;
        
        console.log('✅ API数据加载完成:', allData);
    } catch (error) {
        console.error('❌ API数据加载失败，尝试回退到JSON文件:', error);
        
        // API失败时回退到JSON文件
        try {
            await loadAllDataFromJSON();
            console.log('📁 JSON文件数据加载成功（回退模式）');
        } catch (jsonError) {
            console.error('📁 JSON文件数据加载也失败:', jsonError);
            ErrorHandler.showError('数据加载失败，请检查网络连接或联系管理员');
            throw jsonError;
        }
    }
}

// 原有的JSON数据加载函数（作为回退方案）
async function loadAllDataFromJSON() {
    const [books, movies, music, marathon] = await Promise.all([
        loadJSON('data/books.json'),
        loadJSON('data/movies.json'),
        loadJSON('data/music.json'),
        loadJSON('data/marathon.json')
    ]);
    
    booksData = books;
    moviesData = movies;
    musicData = music;
    marathonData = marathon;
    
    console.log('所有JSON数据加载完成');
}

// JSON数据加载
async function loadJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error loading ${url}:`, error);
        return null;
    }
}

// 导航功能
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // 只对页面内锚点链接（以#开头）阻止默认行为
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                // 移除所有active类
                navLinks.forEach(l => l.classList.remove('active'));
                // 添加active类到当前链接
                this.classList.add('active');
                
                // 滚动到对应section
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            // 对于外部页面链接（如pages/about/index.html），让浏览器正常跳转
        });
    });
    
    // 滚动时更新导航状态
    window.addEventListener('scroll', updateActiveNavLink);
}

// 更新活动导航链接
function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// 标签页功能
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // 移除所有active类
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // 添加active类
            this.classList.add('active');
            
            if (targetTab === 'books') {
                document.getElementById('books-content').classList.add('active');
            } else if (targetTab === 'movies') {
                document.getElementById('movies-content').classList.add('active');
            } else if (targetTab === 'music') {
                document.getElementById('music-content').classList.add('active');
            }
        });
    });
}

// 移动端菜单
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-open');
            overlay.style.display = sidebar.classList.contains('mobile-open') ? 'block' : 'none';
        });
        
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('mobile-open');
            overlay.style.display = 'none';
        });
    }
}

// 渲染书籍 - 使用分页
function renderBooks(activeTags = null) {
    if (!booksData) return;
    
    // 如果SearchManager可用且已初始化，使用分页渲染
    if (window.SearchManager && window.SearchState) {
        // 确保数据已设置到SearchManager
        window.SearchManager.setData(booksData, moviesData, musicData);
        window.SearchManager.renderFilteredBooks(window.SearchState.filteredData.books);
        return;
    }
    
    // 回退到旧的渲染方式（兼容性）
    const container = document.getElementById('books-container');
    if (!container) return;
    
    let allBooks = [...(booksData.currentReading || []), ...(booksData.recentlyFinished || [])].sort((a, b) => a.id - b.id);
    
    // 应用标签筛选
    if (activeTags && activeTags.length > 0 && window.TagFilterManager) {
        allBooks = allBooks.filter(book => window.TagFilterManager.matchesActiveTags(book, 'books'));
    }
    
    container.innerHTML = allBooks.map(book => {
        // 优先使用数据库中的封面图片URL
        const coverUrl = book.cover_image || book.cover || (window.ImageUtils ? window.ImageUtils.getBookCover(book.id) : '');
        
        return `
        <div class="book-card hover-lift animate-in" data-id="${book.id}">
            <div class="book-cover">
                <img src="${coverUrl}" alt="${book.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMTA3IiB2aWV3Qm94PSIwIDAgODAgMTA3IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSIxMDciIGZpbGw9IiM0RUNEQzQiIG9wYWNpdHk9IjAuMyIvPjx0ZXh0IHg9IjQwIiB5PSI1NCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM0RUNEQzQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuS5puexuzwvdGV4dD48L3N2Zz4='" />
            </div>
            <div class="book-info">
                <h4 class="book-title">${book.title}</h4>
                <p class="book-meta interest-meta">${book.author} | ${book.category || '其他'}</p>
                <div class="rating">
                    <span class="rating-label">推荐指数</span>
                    <span class="stars">${generateStars(book.rating)}</span>
                </div>
                <p class="book-thoughts">${book.thoughts || book.review || '暂无感想'}</p>
            </div>
        </div>
        `;
    }).join('');
}

// 渲染电影 - 使用分页
function renderMovies(activeTags = null) {
    if (!moviesData) return;
    
    // 如果SearchManager可用且已初始化，使用分页渲染
    if (window.SearchManager && window.SearchState) {
        // 确保数据已设置到SearchManager
        window.SearchManager.setData(booksData, moviesData, musicData);
        window.SearchManager.renderFilteredMovies(window.SearchState.filteredData.movies);
        return;
    }
    
    // 回退到旧的渲染方式（兼容性）
    const container = document.getElementById('movies-container');
    if (!container) return;
    
    let movies = moviesData.recentWatched || [];
    
    // 应用标签筛选
    if (activeTags && activeTags.length > 0 && window.TagFilterManager) {
        movies = movies.filter(movie => window.TagFilterManager.matchesActiveTags(movie, 'movies'));
    }
    
    container.innerHTML = movies.sort((a, b) => a.id - b.id).map(movie => {
        // 优先使用数据库中的海报图片URL
        const posterUrl = movie.poster_image || movie.poster || (window.ImageUtils ? window.ImageUtils.getMoviePoster(movie.id) : '');
        // 使用category字段
        const category = movie.category || '其他';
        
        return `
        <div class="movie-card hover-lift animate-in" data-id="${movie.id}">
            <div class="movie-poster">
                <img src="${posterUrl}" alt="${movie.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgODAgMTIwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiM0NUI3RDEiIG9wYWNpdHk9IjAuMyIvPjx0ZXh0IHg9IjQwIiB5PSI2MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM0NUI3RDEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPueUteW9sTwvdGV4dD48L3N2Zz4='" />
            </div>
            <div class="movie-info">
                <h4 class="movie-title">${movie.title}</h4>
                <p class="movie-meta interest-meta">${movie.director} · ${movie.year || movie.release_year} · ${category}</p>
                <div class="rating">
                    <span class="stars">${generateStars(movie.rating)}</span>
                    <span class="rating-text">${movie.rating}/10</span>
                </div>
                <p class="movie-review">${movie.quotes || movie.review || '暂无台词'}</p>
            </div>
        </div>
        `;
    }).join('');
}

// 渲染音乐 - 使用分页
function renderMusic(activeTags = null) {
    if (!musicData) return;
    
    // 如果SearchManager可用且已初始化，使用分页渲染
    if (window.SearchManager && window.SearchState) {
        // 确保数据已设置到SearchManager
        window.SearchManager.setData(booksData, moviesData, musicData);
        window.SearchManager.renderFilteredMusic(window.SearchState.filteredData.music);
        // 渲染播放列表
        renderPlaylists();
        return;
    }
    
    // 回退到旧的渲染方式（兼容性）
    const container = document.getElementById('music-container');
    if (!container) return;
    
    let music = musicData.currentListening || [];
    
    // 应用标签筛选
    if (activeTags && activeTags.length > 0 && window.TagFilterManager) {
        music = music.filter(song => window.TagFilterManager.matchesActiveTags(song, 'music'));
    }
    
    container.innerHTML = music.sort((a, b) => a.id - b.id).map(song => {
        // 优先使用数据库中的专辑封面URL
        const albumUrl = song.album_cover || song.albumCover || (window.ImageUtils ? window.ImageUtils.getAlbumCover(song.id) : '');
        
        return `
        <div class="music-card hover-lift animate-in" data-id="${song.id}" data-mood="${song.mood}">
            <div class="album-cover">
                <img src="${albumUrl}" alt="${song.album}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSI0MCIgZmlsbD0iI0ZGQTcwQSIgb3BhY2l0eT0iMC4zIi8+PHRleHQgeD0iNDAiIHk9IjQ0IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0ZGQTcwQSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+6Z+z5LmQPC90ZXh0Pjwvc3ZnPg=='" />
            </div>
            <div class="music-info">
                <h4 class="music-title">${song.songName || song.song_name}</h4>
                <p class="music-meta interest-meta">${song.artist} · ${song.scene || '其他'} · ${song.mood}</p>
                <p class="music-reason">${song.lyrics_snippet || song.reason || '♪ 暂无歌词片段'}</p>
            </div>
        </div>
        `;
    }).join('');
    
    // 渲染播放列表
    renderPlaylists();
}

// 渲染播放列表
function renderPlaylists() {
    if (!musicData || !musicData.playlists) return;
    
    const container = document.getElementById('playlists-container');
    if (!container) return;
    
    container.innerHTML = musicData.playlists.map(playlist => `
        <div class="playlist-card hover-lift animate-in">
            <div class="playlist-cover">🎵</div>
            <h4 class="playlist-name">${playlist.name}</h4>
            <p class="playlist-description">${playlist.description}</p>
            <p class="playlist-info">${playlist.songCount} 首歌曲</p>
        </div>
    `).join('');
}

// 渲染马拉松数据
function renderMarathon() {
    if (!marathonData) return;
    
    // 渲染统计数据
    document.getElementById('total-races').textContent = marathonData.statistics.totalRaces;
    document.getElementById('total-distance').textContent = marathonData.statistics.totalDistance;
    document.getElementById('best-time').textContent = marathonData.statistics.bestTime;
    
    // 渲染比赛记录
    const racesContainer = document.getElementById('races-container');
    if (racesContainer && marathonData.races) {
        racesContainer.innerHTML = marathonData.races.map(race => `
            <div class="race-card hover-lift animate-in">
                <div class="race-header">
                    <h4 class="race-name">${race.name}</h4>
                    <span class="race-date">${formatDate(race.date)}</span>
                </div>
                <div class="race-details">
                    <div class="detail-item">
                        <div class="detail-label">距离</div>
                        <div class="detail-value">${race.distance}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">成绩</div>
                        <div class="detail-value">${race.time}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">排名</div>
                        <div class="detail-value">${race.ranking}/${race.totalParticipants}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">天气</div>
                        <div class="detail-value">${race.weather}</div>
                    </div>
                </div>
                <div class="race-experience">${race.experience}</div>
            </div>
        `).join('');
    }
    
    // 渲染训练记录
    const trainingContainer = document.getElementById('training-container');
    if (trainingContainer && marathonData.trainingLog) {
        trainingContainer.innerHTML = marathonData.trainingLog.map(training => `
            <div class="training-card hover-lift animate-in">
                <div class="training-header">
                    <h4 class="training-distance">${training.distance}km</h4>
                    <span class="training-date">${formatDate(training.date)}</span>
                </div>
                <div class="training-details">
                    <div class="detail-item">
                        <div class="detail-label">用时</div>
                        <div class="detail-value">${training.time}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">配速</div>
                        <div class="detail-value">${training.pace}/km</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">地点</div>
                        <div class="detail-value">${training.location}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">天气</div>
                        <div class="detail-value">${training.weather}</div>
                    </div>
                </div>
                <div class="training-feeling">${training.feeling}</div>
            </div>
        `).join('');
    }
}

// 工具函数

// 生成星星评分
function generateStars(rating) {
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

// 日期格式化
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 显示错误信息
function showError(message) {
    console.error(message);
    // 可以在这里添加用户友好的错误提示
}

// 滚动动画初始化
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // 观察所有需要动画的元素
    document.querySelectorAll('.section, .card, .interest-item').forEach(el => {
        observer.observe(el);
    });
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 平滑滚动polyfill
if (!('scrollBehavior' in document.documentElement.style)) {
    // 如果浏览器不支持smooth scroll，可以添加polyfill
    console.log('Browser does not support smooth scrolling');
}

// 页面可见性API
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('页面隐藏');
    } else {
        console.log('页面可见');
    }
});

// 导出函数供其他模块使用
window.initPage = initPage;
window.loadJSON = loadJSON;
window.generateStars = generateStars;
window.formatDate = formatDate;