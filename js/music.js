// 音乐相关交互功能

// 音乐心情筛选
function initMusicFilters() {
    const moodFilters = document.querySelectorAll('.mood-filter');
    const musicCards = document.querySelectorAll('.music-card');
    
    moodFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const selectedMood = this.getAttribute('data-mood');
            
            // 更新活动状态
            moodFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // 筛选音乐卡片
            filterMusicByMood(selectedMood, musicCards);
        });
    });
}

// 根据心情筛选音乐
function filterMusicByMood(mood, cards) {
    cards.forEach(card => {
        const cardMood = card.getAttribute('data-mood');
        
        if (mood === 'all' || cardMood === mood) {
            showMusicCard(card);
        } else {
            hideMusicCard(card);
        }
    });
}

// 显示音乐卡片
function showMusicCard(card) {
    card.style.display = 'flex';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    // 使用requestAnimationFrame确保样式已应用
    requestAnimationFrame(() => {
        card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
}

// 隐藏音乐卡片
function hideMusicCard(card) {
    card.style.transition = 'all 0.3s ease';
    card.style.opacity = '0';
    card.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        card.style.display = 'none';
    }, 300);
}

// 专辑封面特效
function initAlbumCoverEffects() {
    const albumCovers = document.querySelectorAll('.album-cover');
    
    albumCovers.forEach(cover => {
        // 鼠标悬停旋转效果
        cover.addEventListener('mouseenter', function() {
            this.style.transform = 'rotate(5deg) scale(1.05)';
            this.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // 添加发光效果
            this.style.boxShadow = '0 8px 25px rgba(78, 205, 196, 0.3)';
        });
        
        cover.addEventListener('mouseleave', function() {
            this.style.transform = 'rotate(0deg) scale(1)';
            this.style.boxShadow = 'var(--shadow-sm)';
        });
        
        // 点击播放动画
        cover.addEventListener('click', function() {
            playAlbumAnimation(this);
        });
    });
}

// 专辑播放动画
function playAlbumAnimation(albumCover) {
    // 创建播放按钮
    const playButton = document.createElement('div');
    playButton.className = 'play-button';
    playButton.innerHTML = '▶';
    playButton.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.9);
        color: var(--color-primary);
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        animation: playButtonPulse 0.6s ease;
        pointer-events: none;
    `;
    
    // 确保父元素有相对定位
    if (getComputedStyle(albumCover).position === 'static') {
        albumCover.style.position = 'relative';
    }
    
    albumCover.appendChild(playButton);
    
    // 播放按钮动画
    setTimeout(() => {
        playButton.style.opacity = '0';
        playButton.style.transform = 'translate(-50%, -50%) scale(1.5)';
    }, 300);
    
    // 移除播放按钮
    setTimeout(() => {
        playButton.remove();
    }, 600);
    
    // 专辑旋转效果
    albumCover.style.animation = 'spin 2s linear';
    
    setTimeout(() => {
        albumCover.style.animation = '';
    }, 2000);
}

// 播放列表交互
function initPlaylistInteractions() {
    const playlistCards = document.querySelectorAll('.playlist-card');
    
    playlistCards.forEach(card => {
        card.addEventListener('click', function() {
            expandPlaylist(this);
        });
    });
}

// 展开播放列表
function expandPlaylist(playlistCard) {
    const isExpanded = playlistCard.classList.contains('expanded');
    
    if (isExpanded) {
        collapsePlaylist(playlistCard);
    } else {
        // 先收起其他播放列表
        document.querySelectorAll('.playlist-card.expanded').forEach(card => {
            if (card !== playlistCard) {
                collapsePlaylist(card);
            }
        });
        
        // 展开当前播放列表
        expandPlaylistDetails(playlistCard);
    }
}

// 展开播放列表详情
function expandPlaylistDetails(card) {
    card.classList.add('expanded');
    
    // 创建详情内容
    let detailsElement = card.querySelector('.playlist-details');
    
    if (!detailsElement) {
        detailsElement = document.createElement('div');
        detailsElement.className = 'playlist-details';
        detailsElement.innerHTML = `
            <div class="playlist-songs">
                <div class="song-item">
                    <span class="song-number">1</span>
                    <span class="song-title">示例歌曲 1</span>
                </div>
                <div class="song-item">
                    <span class="song-number">2</span>
                    <span class="song-title">示例歌曲 2</span>
                </div>
                <div class="song-item">
                    <span class="song-number">3</span>
                    <span class="song-title">示例歌曲 3</span>
                </div>
            </div>
            <div class="playlist-actions">
                <button class="action-btn shuffle">🔀 随机播放</button>
                <button class="action-btn favorite">❤️ 收藏</button>
            </div>
        `;
        
        card.appendChild(detailsElement);
    }
    
    // 展开动画
    detailsElement.style.maxHeight = '0';
    detailsElement.style.opacity = '0';
    detailsElement.style.overflow = 'hidden';
    detailsElement.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    
    requestAnimationFrame(() => {
        detailsElement.style.maxHeight = '300px';
        detailsElement.style.opacity = '1';
    });
    
    // 卡片放大效果
    card.style.transform = 'scale(1.02)';
    card.style.zIndex = '10';
}

// 收起播放列表
function collapsePlaylist(card) {
    card.classList.remove('expanded');
    
    const detailsElement = card.querySelector('.playlist-details');
    if (detailsElement) {
        detailsElement.style.maxHeight = '0';
        detailsElement.style.opacity = '0';
        
        setTimeout(() => {
            detailsElement.remove();
        }, 400);
    }
    
    // 恢复卡片大小
    card.style.transform = 'scale(1)';
    card.style.zIndex = '1';
}

// 音乐搜索功能
function initMusicSearch() {
    const searchInput = document.getElementById('music-search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function() {
        const searchTerm = this.value.toLowerCase().trim();
        searchMusic(searchTerm);
    }, 300));
}

// 搜索音乐
function searchMusic(searchTerm) {
    const musicCards = document.querySelectorAll('.music-card');
    
    musicCards.forEach(card => {
        const title = card.querySelector('.music-title')?.textContent.toLowerCase() || '';
        const artist = card.querySelector('.music-artist')?.textContent.toLowerCase() || '';
        const genre = card.querySelector('.music-genre')?.textContent.toLowerCase() || '';
        
        const isMatch = title.includes(searchTerm) || 
                       artist.includes(searchTerm) || 
                       genre.includes(searchTerm);
        
        if (searchTerm === '' || isMatch) {
            showMusicCard(card);
        } else {
            hideMusicCard(card);
        }
    });
}

// 音量可视化效果
function createVolumeVisualizer() {
    const visualizers = document.querySelectorAll('.music-card');
    
    visualizers.forEach(card => {
        const visualizer = document.createElement('div');
        visualizer.className = 'volume-visualizer';
        visualizer.innerHTML = `
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
        `;
        
        visualizer.style.cssText = `
            display: flex;
            align-items: end;
            gap: 2px;
            height: 20px;
            opacity: 0;
            transition: opacity 0.3s ease;
            position: absolute;
            right: 10px;
            bottom: 10px;
        `;
        
        // 为每个柱子设置样式和动画
        const bars = visualizer.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            bar.style.cssText = `
                width: 3px;
                background: var(--color-primary);
                border-radius: 2px;
                animation: bounce ${0.8 + Math.random() * 0.4}s ease-in-out infinite alternate;
                animation-delay: ${index * 0.1}s;
                height: ${20 + Math.random() * 80}%;
            `;
        });
        
        card.style.position = 'relative';
        card.appendChild(visualizer);
        
        // 悬停时显示可视化效果
        card.addEventListener('mouseenter', () => {
            visualizer.style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', () => {
            visualizer.style.opacity = '0';
        });
    });
}

// 音乐推荐系统
function initMusicRecommendations() {
    // 基于心情推荐音乐
    const currentMood = getCurrentUserMood();
    const recommendations = generateRecommendations(currentMood);
    
    displayRecommendations(recommendations);
}

// 获取当前用户心情（示例实现）
function getCurrentUserMood() {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) {
        return '开心'; // 早晨
    } else if (hour >= 12 && hour < 18) {
        return '激昂'; // 下午
    } else {
        return '放松'; // 晚上
    }
}

// 生成推荐
function generateRecommendations(mood) {
    // 这里可以根据心情返回推荐的音乐
    const recommendations = {
        '开心': ['轻快的流行音乐', '阳光的民谣'],
        '激昂': ['动感的电子音乐', '摇滚音乐'],
        '放松': ['轻柔的爵士乐', '安静的钢琴曲'],
        '忧伤': ['深情的民谣', '忧郁的蓝调']
    };
    
    return recommendations[mood] || recommendations['放松'];
}

// 显示推荐
function displayRecommendations(recommendations) {
    const container = document.getElementById('music-recommendations');
    if (!container) return;
    
    container.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item">
            <span class="rec-icon">🎵</span>
            <span class="rec-text">${rec}</span>
        </div>
    `).join('');
}

// 添加CSS动画样式
function addMusicAnimationStyles() {
    if (document.getElementById('music-animations')) return;
    
    const style = document.createElement('style');
    style.id = 'music-animations';
    style.textContent = `
        @keyframes playButtonPulse {
            0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 0.9; }
        }
        
        @keyframes bounce {
            0%, 100% { height: 20%; }
            50% { height: 100%; }
        }
        
        .playlist-details {
            background: var(--bg-hover);
            border-radius: var(--radius-sm);
            margin-top: var(--spacing-md);
            padding: var(--spacing-md);
        }
        
        .song-item {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            padding: var(--spacing-xs) 0;
            border-bottom: 1px solid var(--border-light);
        }
        
        .song-item:last-child {
            border-bottom: none;
        }
        
        .song-number {
            font-size: 0.8rem;
            color: var(--text-secondary);
            min-width: 20px;
        }
        
        .song-title {
            font-size: 0.9rem;
            color: var(--text-primary);
        }
        
        .playlist-actions {
            display: flex;
            gap: var(--spacing-sm);
            margin-top: var(--spacing-md);
        }
        
        .action-btn {
            flex: 1;
            padding: var(--spacing-xs) var(--spacing-sm);
            border: 1px solid var(--border-light);
            background: var(--bg-card);
            border-radius: var(--radius-sm);
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .action-btn:hover {
            background: var(--color-primary);
            color: white;
            border-color: var(--color-primary);
        }
        
        .recommendation-item {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            padding: var(--spacing-sm);
            background: var(--bg-hover);
            border-radius: var(--radius-sm);
            margin-bottom: var(--spacing-sm);
        }
        
        .rec-icon {
            font-size: 1.2rem;
        }
        
        .rec-text {
            font-size: 0.9rem;
            color: var(--text-primary);
        }
    `;
    
    document.head.appendChild(style);
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

// 初始化所有音乐功能
function initMusicInteractions() {
    addMusicAnimationStyles();
    initMusicFilters();
    initAlbumCoverEffects();
    initPlaylistInteractions();
    initMusicSearch();
    createVolumeVisualizer();
    initMusicRecommendations();
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMusicInteractions);
} else {
    initMusicInteractions();
}

// 导出函数
window.initMusicInteractions = initMusicInteractions;
window.filterMusicByMood = filterMusicByMood;