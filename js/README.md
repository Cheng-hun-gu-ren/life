# JavaScript文件说明

本目录包含网站的所有JavaScript文件，采用模块化管理。

## 📁 文件结构

```
js/
├── main.js           # 主要交互逻辑
├── animations.js     # 动画控制
└── music.js          # 音乐相关交互
```

## 🎯 main.js - 主要交互逻辑

### 包含功能
- 页面初始化
- 导航控制
- 标签页切换
- 数据加载和渲染
- 通用工具函数

### 主要功能模块
```javascript
// 页面初始化
function initPage() {
    loadData();
    initNavigation();
    initTabs();
}

// 数据加载
async function loadData() {
    const books = await loadJSON('data/books.json');
    const movies = await loadJSON('data/movies.json');
    const music = await loadJSON('data/music.json');
    const marathon = await loadJSON('data/marathon.json');
}

// 内容渲染
function renderBooks(books) { /* 渲染书籍 */ }
function renderMovies(movies) { /* 渲染电影 */ }
function renderMusic(music) { /* 渲染音乐 */ }
function renderMarathon(marathon) { /* 渲染马拉松 */ }
```

## ✨ animations.js - 动画控制

### 包含功能
- 页面切换动画
- 滚动动画
- 悬停效果
- 点击反馈动画
- 特殊交互动画

### 主要功能
```javascript
// 滚动动画
function initScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    });
}

// 页面切换
function fadeTransition(fromElement, toElement) {
    fromElement.style.opacity = '0';
    setTimeout(() => {
        fromElement.style.display = 'none';
        toElement.style.display = 'block';
        toElement.style.opacity = '1';
    }, 300);
}

// 卡片悬停效果
function initCardHoverEffects() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', handleCardHover);
        card.addEventListener('mouseleave', handleCardLeave);
    });
}
```

## 🎵 music.js - 音乐相关交互

### 包含功能
- 音乐数据处理
- 专辑封面交互
- 播放按钮动画
- 心情标签筛选
- 播放列表展开/收起

### 主要功能
```javascript
// 音乐数据渲染
function renderMusicCards(musicData) {
    const container = document.querySelector('.music-container');
    musicData.forEach(song => {
        const card = createMusicCard(song);
        container.appendChild(card);
    });
}

// 专辑封面旋转效果
function initAlbumRotation() {
    document.querySelectorAll('.album-cover').forEach(cover => {
        cover.addEventListener('mouseenter', () => {
            cover.style.transform = 'rotate(5deg) scale(1.05)';
        });
        cover.addEventListener('mouseleave', () => {
            cover.style.transform = 'rotate(0deg) scale(1)';
        });
    });
}

// 心情筛选
function filterByMood(mood) {
    const cards = document.querySelectorAll('.music-card');
    cards.forEach(card => {
        if (mood === 'all' || card.dataset.mood === mood) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// 播放列表交互
function togglePlaylist(playlistId) {
    const playlist = document.querySelector(`[data-playlist="${playlistId}"]`);
    playlist.classList.toggle('expanded');
}
```

## 🛠 通用工具函数

### 数据加载
```javascript
// JSON数据加载
async function loadJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error loading JSON:', error);
        return null;
    }
}

// 图片预加载
function preloadImages(imageUrls) {
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}
```

### DOM操作
```javascript
// 元素创建
function createElement(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
}

// 事件委托
function delegateEvent(parent, selector, event, handler) {
    parent.addEventListener(event, function(e) {
        if (e.target.matches(selector)) {
            handler.call(e.target, e);
        }
    });
}
```

### 数据处理
```javascript
// 日期格式化
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 评分星星生成
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<span class="star full">★</span>';
    }
    if (hasHalfStar) {
        starsHTML += '<span class="star half">☆</span>';
    }
    
    return starsHTML;
}
```

## 📱 响应式交互

### 移动端适配
```javascript
// 检测设备类型
function isMobile() {
    return window.innerWidth <= 768;
}

// 触摸事件处理
function initTouchEvents() {
    if (isMobile()) {
        // 替换hover为touch事件
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('touchstart', handleTouchStart);
            card.addEventListener('touchend', handleTouchEnd);
        });
    }
}

// 抽屉菜单控制
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}
```

## 🔄 数据更新机制

### 动态内容更新
```javascript
// 检查数据更新
async function checkForUpdates() {
    const lastUpdate = localStorage.getItem('lastUpdate');
    const currentTime = Date.now();
    
    // 如果超过1小时，重新加载数据
    if (!lastUpdate || currentTime - lastUpdate > 3600000) {
        await loadData();
        localStorage.setItem('lastUpdate', currentTime);
    }
}

// 本地存储缓存
function cacheData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getCachedData(key) {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
}
```

## 🎨 交互反馈

### 加载状态
```javascript
// 显示加载动画
function showLoading(container) {
    container.innerHTML = '<div class="loading">加载中...</div>';
}

// 隐藏加载动画
function hideLoading(container) {
    container.querySelector('.loading')?.remove();
}

// 错误处理
function showError(container, message) {
    container.innerHTML = `<div class="error">加载失败: ${message}</div>`;
}
```

### 用户反馈
```javascript
// 成功提示
function showSuccess(message) {
    const toast = createElement('div', 'toast success', message);
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// 点击反馈
function addClickFeedback(element) {
    element.addEventListener('click', function(e) {
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 150);
    });
}
```

## 💡 编写规范

### 代码组织
1. **功能分离**: 不同功能写在不同文件
2. **模块化**: 使用IIFE或ES6模块
3. **事件驱动**: 基于事件的架构
4. **异步处理**: 使用async/await

### 命名约定
- 函数: 驼峰命名 `functionName`
- 变量: 驼峰命名 `variableName`
- 常量: 大写下划线 `CONSTANT_NAME`
- DOM元素: 带前缀 `$element`

### 错误处理
```javascript
// 统一错误处理
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    // 可以添加错误上报逻辑
}

// 安全的DOM操作
function safeQuerySelector(selector) {
    try {
        return document.querySelector(selector);
    } catch (error) {
        handleError(error, 'safeQuerySelector');
        return null;
    }
}
```

## 🔧 调试和维护

### 调试工具
```javascript
// 调试模式
const DEBUG = true;

function debug(message, data) {
    if (DEBUG) {
        console.log(`[DEBUG] ${message}`, data);
    }
}

// 性能监控
function measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    debug(`${name} took ${end - start}ms`);
    return result;
}
```

### 兼容性处理
```javascript
// 检查特性支持
function supportsIntersectionObserver() {
    return 'IntersectionObserver' in window;
}

// Polyfill处理
function loadPolyfills() {
    if (!supportsIntersectionObserver()) {
        // 加载polyfill
    }
}
```