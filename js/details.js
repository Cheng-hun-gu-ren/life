// 详情弹窗功能
class DetailModal {
    constructor() {
        this.modal = document.getElementById('detailModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalDetailImage = document.getElementById('modalDetailImage');
        this.modalMeta = document.getElementById('modalMeta');
        this.modalThoughts = document.getElementById('modalThoughts');
        this.modalClose = document.getElementById('modalClose');
        // 添加感想标题元素引用
        this.modalThoughtsTitle = document.querySelector('.modal-thoughts .thoughts-title');
        
        this.initEvents();
    }
    
    initEvents() {
        // 关闭弹窗事件
        this.modalClose?.addEventListener('click', () => this.close());
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
        
        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                this.close();
            }
        });
    }
    
    open(data) {
        if (!this.modal) return;
        
        // 填充数据
        this.modalTitle.textContent = data.title;
        this.modalDetailImage.src = data.detailImage;
        
        // 根据类型设置个性化的感想标题
        if (this.modalThoughtsTitle) {
            const thoughtsTitles = {
                'books': '观书有感',
                'movies': '24格印象', 
                'music': '律动心声'
            };
            this.modalThoughtsTitle.textContent = thoughtsTitles[data.type] || '我的感想';
        }
        
        // 处理感想文本的换行符 - 同时处理<br>标签和\n换行符
        if (data.thoughts) {
            console.log('🔤 原始感想文本:', JSON.stringify(data.thoughts));
            
            // 将所有<br>标签转换为\n换行符，支持各种<br>格式
            let processedThoughts = data.thoughts
                .replace(/<br\s*\/?>/gi, '\n')  // 处理 <br>、<br/>、<br />
                .replace(/\n\s*\n/g, '\n\n');  // 清理多余的空白行，保留段落间距
            
            console.log('✨ 处理后的感想文本:', JSON.stringify(processedThoughts));
            
            this.modalThoughts.textContent = processedThoughts;
            
            // 验证CSS是否正确应用
            const computedStyle = window.getComputedStyle(this.modalThoughts);
            console.log('📝 CSS white-space样式:', computedStyle.whiteSpace);
        } else {
            this.modalThoughts.textContent = '';
        }
        
        // 填充元信息
        this.modalMeta.innerHTML = '';
        if (data.meta && data.meta.length > 0) {
            data.meta.forEach(item => {
                const metaItem = document.createElement('span');
                metaItem.className = 'meta-item';
                metaItem.textContent = item;
                this.modalMeta.appendChild(metaItem);
            });
        }
        
        // 显示弹窗
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // 重置动画
        this.resetAnimations();
    }
    
    showLoading() {
        if (!this.modal) return;
        
        // 显示加载状态
        this.modalTitle.textContent = '加载中...';
        this.modalDetailImage.src = '';
        this.modalThoughts.textContent = '正在获取详情数据，请稍候...';
        this.modalMeta.innerHTML = '<span class="meta-item">加载中</span>';
        
        // 重置感想标题为默认值
        if (this.modalThoughtsTitle) {
            this.modalThoughtsTitle.textContent = '我的感想';
        }
        
        // 显示弹窗
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    showError(message) {
        if (!this.modal) return;
        
        // 显示错误状态
        this.modalTitle.textContent = '加载失败';
        this.modalDetailImage.src = '';
        this.modalThoughts.textContent = message || '数据加载失败，请稍后重试';
        this.modalMeta.innerHTML = '<span class="meta-item">错误</span>';
        
        // 重置感想标题为默认值
        if (this.modalThoughtsTitle) {
            this.modalThoughtsTitle.textContent = '我的感想';
        }
        
        // 显示弹窗
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        if (!this.modal) return;
        
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    resetAnimations() {
        // 重新触发CSS动画
        const animatedElements = this.modal.querySelectorAll('.modal-detail-image, .modal-title, .modal-meta, .modal-thoughts');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // 触发重排
            el.style.animation = null;
        });
    }
}

// 详情数据管理器
const DetailsDataManager = {
    // 缓存数据
    cache: {
        books: new Map(),
        movies: new Map(),
        music: new Map()
    },

    // 获取API基础URL - 与api.js保持一致
    getApiBaseUrl() {
        const isHTTPS = window.location.protocol === 'https:';
        const hostname = window.location.hostname;
        // 支持多个域名：chenhun.me 和 chenggao.top
        const isDomain = hostname.includes('chenhun.me') || hostname.includes('chenggao.top');

        if (isDomain && isHTTPS) {
            console.log('🔒 Details HTTPS环境: 使用HTTPS API');
            return 'https://api.chenhun.me';
        } else if (isDomain) {
            console.log('🔄 Details HTTP环境: 使用HTTP API');
            return 'http://api.chenhun.me';
        } else {
            console.log('💻 Details 本地开发环境: 使用服务器IP');
            return 'http://47.115.72.85:3001';
        }
    },
    
    // 从API获取详情数据
    async fetchDetailData(type, id) {
        // 检查缓存
        if (this.cache[type].has(id)) {
            return this.cache[type].get(id);
        }
        
        try {
            let apiEndpoint = '';
            // 使用与api.js相同的智能API地址选择逻辑
            const baseUrl = this.getApiBaseUrl();
            
            switch (type) {
                case 'books':
                    apiEndpoint = `${baseUrl}/api/books/${id}`;
                    break;
                case 'movies':
                    apiEndpoint = `${baseUrl}/api/movies/${id}`;
                    break;
                case 'music':
                    apiEndpoint = `${baseUrl}/api/music/${id}`;
                    break;
                default:
                    throw new Error(`Unknown type: ${type}`);
            }
            
            const response = await fetch(apiEndpoint);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${type} details: ${response.status}`);
            }
            
            const response_data = await response.json();
            
            // 检查API响应是否成功
            if (!response_data.success) {
                throw new Error(`API响应失败: ${response_data.error || '未知错误'}`);
            }
            
            // 转换数据格式以适配前端显示
            const detailData = this.formatDetailData(type, response_data.data);
            
            // 缓存数据
            this.cache[type].set(id, detailData);
            
            return detailData;
        } catch (error) {
            console.error('获取详情数据失败:', error);
            // 返回默认数据结构
            return this.getDefaultDetailData(type, id);
        }
    },
    
    // 格式化详情数据
    formatDetailData(type, data) {
        const baseData = {
            type: type, // 添加类型信息
            title: data.title || data.song_name || '未知标题',
            detailImage: data.detail_image || this.getDefaultImage(type, data.id),
            meta: this.parseMeta(data.meta_tags),
            thoughts: this.getThoughts(type, data)
        };
        
        return baseData;
    },
    
    // 解析meta标签
    parseMeta(metaTags) {
        if (!metaTags) return ['暂无标签'];
        
        try {
            return typeof metaTags === 'string' ? JSON.parse(metaTags) : metaTags;
        } catch (error) {
            console.warn('解析meta标签失败:', error);
            return ['暂无标签'];
        }
    },
    
    // 获取感想文本
    getThoughts(type, data) {
        switch (type) {
            case 'books':
                return data.review || data.thoughts || '暂无读后感想。';
            case 'movies':
                return data.review || data.comment || '暂无观影感想。';
            case 'music':
                return data.reason || data.comment || '暂无听歌感想。';
            default:
                return '暂无感想。';
        }
    },
    
    // 获取默认图片
    getDefaultImage(type, id) {
        switch (type) {
            case 'books':
                return window.ImageUtils ? window.ImageUtils.getDetailImage(id, 'book') : '';
            case 'movies':
                return window.ImageUtils ? window.ImageUtils.getDetailImage(id, 'movie') : '';
            case 'music':
                return window.ImageUtils ? window.ImageUtils.getDetailImage(id, 'music') : '';
            default:
                return '';
        }
    },
    
    // 获取默认详情数据
    getDefaultDetailData(type, id) {
        return {
            type: type, // 添加类型信息
            title: '数据加载失败',
            detailImage: this.getDefaultImage(type, id),
            meta: ['加载失败'],
            thoughts: '抱歉，详情数据加载失败，请稍后重试。'
        };
    }
};

// 初始化详情弹窗功能
function initDetailModal() {
    const modal = new DetailModal();
    
    // 为所有可点击的封面添加事件监听
    document.addEventListener('click', async (e) => {
        const bookCover = e.target.closest('.book-cover');
        const moviePoster = e.target.closest('.movie-poster');
        const albumCover = e.target.closest('.album-cover');
        
        if (bookCover) {
            const bookCard = bookCover.closest('.book-card');
            const bookId = bookCard?.dataset.id;
            if (bookId) {
                try {
                    // 显示加载状态
                    modal.showLoading();
                    const detailData = await DetailsDataManager.fetchDetailData('books', bookId);
                    modal.open(detailData);
                } catch (error) {
                    console.error('加载书籍详情失败:', error);
                    modal.showError('加载详情失败，请稍后重试');
                }
            }
        } else if (moviePoster) {
            const movieCard = moviePoster.closest('.movie-card');
            const movieId = movieCard?.dataset.id;
            if (movieId) {
                try {
                    modal.showLoading();
                    const detailData = await DetailsDataManager.fetchDetailData('movies', movieId);
                    modal.open(detailData);
                } catch (error) {
                    console.error('加载电影详情失败:', error);
                    modal.showError('加载详情失败，请稍后重试');
                }
            }
        } else if (albumCover) {
            const musicCard = albumCover.closest('.music-card');
            const musicId = musicCard?.dataset.id;
            if (musicId) {
                try {
                    modal.showLoading();
                    const detailData = await DetailsDataManager.fetchDetailData('music', musicId);
                    modal.open(detailData);
                } catch (error) {
                    console.error('加载音乐详情失败:', error);
                    modal.showError('加载详情失败，请稍后重试');
                }
            }
        }
    });
}

// 测试函数 - 用户可以在控制台调用来测试换行功能
function testLineBreaks() {
    const testData = {
        type: 'books',
        title: '测试换行功能',
        detailImage: '',
        meta: ['测试标签'],
        thoughts: '原本以为是本枯燥的学术书， <br> 结果意外地好读。\n\n特别是关于依恋类型的部分，\n简直是对号入座。'
    };
    
    console.log('🧪 开始测试换行功能...');
    
    // 获取详情弹窗实例
    const modal = new DetailModal();
    modal.open(testData);
    
    console.log('✅ 测试完成，请查看弹窗效果');
}

// 如果是在浏览器环境中，自动初始化
if (typeof window !== 'undefined') {
    // 等待DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDetailModal);
    } else {
        initDetailModal();
    }
    
    // 将测试函数暴露到全局
    window.testLineBreaks = testLineBreaks;
    console.log('🔧 调试工具已准备就绪，在控制台输入 testLineBreaks() 可测试换行功能');
}