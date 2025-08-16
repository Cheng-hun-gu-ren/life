/**
 * Life项目API调用模块
 * 提供前端与后端API的通信功能
 */

// API配置
const API_CONFIG = {
    // 智能API地址选择 - 解决Mixed Content问题
    baseURL: (() => {
        const isHTTPS = window.location.protocol === 'https:';
        const isDomain = window.location.hostname === 'life.chenggao.top';
        
        console.log(`🌐 检测到访问环境: ${window.location.protocol}//${window.location.hostname}`);
        
        if (isDomain && isHTTPS) {
            // HTTPS域名环境: 使用HTTPS API避免Mixed Content
            console.log('🔒 HTTPS环境: 使用HTTPS API');
            return 'https://api.chenggao.top';
        } else if (isDomain) {
            // HTTP域名环境: 使用HTTP API
            console.log('🔄 HTTP域名环境: 使用HTTP API');
            return 'http://api.chenggao.top';
        } else {
            // 本地开发环境: 直接使用IP和端口
            console.log('💻 本地开发环境: 使用服务器IP');
            return 'http://47.115.72.85:3001';
        }
    })(),
    timeout: 10000, // 10秒超时
    retryTimes: 3   // 重试次数
};

// 图片URL配置 - 使用Lorem Picsum进行测试
const IMAGE_CONFIG = {
    // 书籍封面 - 竖版比例 200x300
    bookCover: (id) => `https://picsum.photos/200/300?random=${id || Math.floor(Math.random() * 1000)}`,
    
    // 电影海报 - 竖版比例 200x280 
    moviePoster: (id) => `https://picsum.photos/200/280?random=${(id || Math.floor(Math.random() * 1000)) + 100}`,
    
    // 音乐专辑封面 - 正方形 200x200
    albumCover: (id) => `https://picsum.photos/200/200?random=${(id || Math.floor(Math.random() * 1000)) + 200}`,
    
    // 详情页大图 - 横版比例 400x300
    detailImage: (id) => `https://picsum.photos/400/300?random=${(id || Math.floor(Math.random() * 1000)) + 300}`,
    
    // 头像图片 - 正方形 100x100
    avatar: (id) => `https://picsum.photos/100/100?random=${(id || Math.floor(Math.random() * 1000)) + 400}`,
    
    // 背景图片 - 横版大图 1200x600
    background: (id) => `https://picsum.photos/1200/600?random=${(id || Math.floor(Math.random() * 1000)) + 500}`,
    
    // 马拉松证书/场景 - 横版 400x300
    marathon: (id) => `https://picsum.photos/400/300?random=${(id || Math.floor(Math.random() * 1000)) + 600}`
};

// 图片URL生成工具
const ImageUtils = {
    /**
     * 获取书籍封面URL
     * @param {number|string} bookId - 书籍ID
     * @returns {string} 图片URL
     */
    getBookCover(bookId) {
        return IMAGE_CONFIG.bookCover(bookId);
    },
    
    /**
     * 获取电影海报URL
     * @param {number|string} movieId - 电影ID
     * @returns {string} 图片URL
     */
    getMoviePoster(movieId) {
        return IMAGE_CONFIG.moviePoster(movieId);
    },
    
    /**
     * 获取音乐专辑封面URL
     * @param {number|string} musicId - 音乐ID
     * @returns {string} 图片URL
     */
    getAlbumCover(musicId) {
        return IMAGE_CONFIG.albumCover(musicId);
    },
    
    /**
     * 获取详情页图片URL
     * @param {number|string} itemId - 项目ID
     * @param {string} type - 类型 (book/movie/music)
     * @returns {string} 图片URL
     */
    getDetailImage(itemId, type) {
        const offset = type === 'book' ? 0 : type === 'movie' ? 50 : 100;
        return `https://picsum.photos/400/300?random=${(itemId || Math.floor(Math.random() * 1000)) + 300 + offset}`;
    },
    
    /**
     * 获取头像URL
     * @param {string} type - 头像类型
     * @returns {string} 图片URL
     */
    getAvatar(type = 'main') {
        const avatarMap = {
            'main': 401,
            'card': 402,
            'small': 403
        };
        return `https://picsum.photos/100/100?random=${avatarMap[type] || 401}`;
    }
};

/**
 * 通用API请求函数
 * @param {string} endpoint - API端点
 * @param {object} options - 请求选项
 * @returns {Promise} API响应
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: API_CONFIG.timeout,
        ...options
    };

    try {
        console.log(`🌐 API请求: ${defaultOptions.method} ${url}`);
        console.log(`🔍 当前baseURL: ${API_CONFIG.baseURL}`);
        
        const response = await fetch(url, defaultOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`✅ API响应成功:`, data);
        
        return data;
    } catch (error) {
        console.error(`❌ API请求失败 ${url}:`, error);
        throw error;
    }
}

/**
 * 带重试机制的API请求
 * @param {string} endpoint - API端点
 * @param {object} options - 请求选项
 * @param {number} retryCount - 当前重试次数
 * @returns {Promise} API响应
 */
async function apiRequestWithRetry(endpoint, options = {}, retryCount = 0) {
    try {
        return await apiRequest(endpoint, options);
    } catch (error) {
        if (retryCount < API_CONFIG.retryTimes) {
            console.log(`🔄 重试API请求 (${retryCount + 1}/${API_CONFIG.retryTimes}): ${endpoint}`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // 递增延迟
            return apiRequestWithRetry(endpoint, options, retryCount + 1);
        }
        throw error;
    }
}

/**
 * Life API模块 - 提供所有数据接口
 */
const LifeAPI = {
    // ==========  书籍相关API ==========
    
    /**
     * 获取所有书籍
     * @param {object} params - 查询参数
     * @returns {Promise} 书籍列表
     */
    async getBooks(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/api/books${queryString ? '?' + queryString : ''}`;
        return await apiRequestWithRetry(endpoint);
    },

    /**
     * 获取正在阅读的书籍
     * @returns {Promise} 正在阅读的书籍列表
     */
    async getCurrentReading() {
        return await apiRequestWithRetry('/api/books/current');
    },

    /**
     * 获取已完成的书籍
     * @param {number} limit - 限制数量
     * @returns {Promise} 已完成书籍列表
     */
    async getFinishedBooks(limit = 10) {
        return await apiRequestWithRetry(`/api/books/finished?limit=${limit}`);
    },

    /**
     * 根据ID获取单本书籍
     * @param {number} id - 书籍ID
     * @returns {Promise} 书籍详情
     */
    async getBookById(id) {
        return await apiRequestWithRetry(`/api/books/${id}`);
    },

    /**
     * 搜索书籍
     * @param {string} keyword - 搜索关键词
     * @param {number} limit - 限制数量
     * @returns {Promise} 搜索结果
     */
    async searchBooks(keyword, limit = 20) {
        return await apiRequestWithRetry(`/api/books/search/${encodeURIComponent(keyword)}?limit=${limit}`);
    },

    /**
     * 获取书籍统计
     * @returns {Promise} 书籍统计数据
     */
    async getBooksStats() {
        return await apiRequestWithRetry('/api/books/stats/summary');
    },

    // ==========  电影相关API ==========
    
    /**
     * 获取所有电影
     * @param {object} params - 查询参数
     * @returns {Promise} 电影列表
     */
    async getMovies(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/api/movies${queryString ? '?' + queryString : ''}`;
        return await apiRequestWithRetry(endpoint);
    },

    /**
     * 获取电影统计
     * @returns {Promise} 电影统计数据
     */
    async getMoviesStats() {
        return await apiRequestWithRetry('/api/movies/stats');
    },

    /**
     * 根据ID获取电影详情
     * @param {number} id - 电影ID
     * @returns {Promise} 电影详情
     */
    async getMovieById(id) {
        return await apiRequestWithRetry(`/api/movies/${id}`);
    },

    // ==========  音乐相关API ==========
    
    /**
     * 获取所有音乐
     * @param {object} params - 查询参数
     * @returns {Promise} 音乐列表
     */
    async getMusic(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/api/music${queryString ? '?' + queryString : ''}`;
        return await apiRequestWithRetry(endpoint);
    },

    /**
     * 获取当前播放的音乐
     * @returns {Promise} 当前播放音乐列表
     */
    async getCurrentMusic() {
        return await apiRequestWithRetry('/api/music/current');
    },

    /**
     * 根据ID获取音乐详情
     * @param {number} id - 音乐ID
     * @returns {Promise} 音乐详情
     */
    async getMusicById(id) {
        return await apiRequestWithRetry(`/api/music/${id}`);
    },

    // ==========  马拉松相关API ==========
    
    /**
     * 获取所有马拉松记录
     * @param {object} params - 查询参数
     * @returns {Promise} 马拉松记录列表
     */
    async getMarathons(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/api/marathons${queryString ? '?' + queryString : ''}`;
        return await apiRequestWithRetry(endpoint);
    },

    /**
     * 获取马拉松统计
     * @returns {Promise} 马拉松统计数据
     */
    async getMarathonsStats() {
        return await apiRequestWithRetry('/api/marathons/stats');
    },

    /**
     * 根据ID获取马拉松详情
     * @param {number} id - 马拉松ID
     * @returns {Promise} 马拉松详情
     */
    async getMarathonById(id) {
        return await apiRequestWithRetry(`/api/marathons/${id}`);
    },

    // ==========  系统相关API ==========
    
    /**
     * 健康检查
     * @returns {Promise} 服务器状态
     */
    async healthCheck() {
        return await apiRequest('/health');
    },

    /**
     * 获取服务器信息
     * @returns {Promise} 服务器信息
     */
    async getServerInfo() {
        return await apiRequest('/');
    },

    // ==========  批量数据加载 ==========
    
    /**
     * 批量加载所有数据（兼容原有接口）
     * @returns {Promise} 包含所有数据的对象
     */
    async loadAllData() {
        try {
            console.log('🚀 开始加载所有数据...');
            
            const [booksResponse, moviesResponse, musicResponse, marathonResponse] = await Promise.all([
                this.getBooks(),
                this.getMovies(),
                this.getCurrentMusic(),
                this.getMarathons()
            ]);

            // 转换为原有的数据格式，保持兼容性
            const data = {
                books: {
                    currentReading: booksResponse.data?.filter(book => book.status === 'reading') || [],
                    recentlyFinished: booksResponse.data?.filter(book => book.status === 'finished') || []
                },
                movies: {
                    recentWatched: moviesResponse.data || []
                },
                music: {
                    currentListening: musicResponse.data || []
                },
                marathon: await this.formatMarathonData(marathonResponse.data || [])
            };

            console.log('✅ 所有数据加载完成');
            return data;
        } catch (error) {
            console.error('❌ 批量数据加载失败:', error);
            throw error;
        }
    },

    /**
     * 格式化马拉松数据以匹配前端期待的结构
     */
    async formatMarathonData(marathonData) {
        console.log('🔄 开始格式化马拉松数据:', marathonData);
        
        try {
            // 获取统计数据
            console.log('📊 正在获取统计数据...');
            const statsResponse = await apiRequestWithRetry('/api/marathons/stats');
            const stats = statsResponse.data || {};
            console.log('📈 统计数据获取成功:', stats);
            
            const formattedData = {
                races: marathonData.map(race => ({
                    id: race.id,
                    name: race.name,
                    date: new Date(race.race_date).toISOString().split('T')[0],
                    location: race.location,
                    distance: race.distance,
                    time: race.finish_time,
                    ranking: race.ranking,
                    totalParticipants: race.total_participants,
                    weather: race.weather,
                    experience: race.experience,
                    certificate: race.certificate_image,
                    medal: race.medal_image,
                    photos: race.photos || []
                })),
                statistics: {
                    totalRaces: stats.total_races || marathonData.length,
                    totalDistance: stats.total_distance || 0,
                    monthlyDistance: "60"
                }
            };
            
            console.log('✅ 马拉松数据格式化完成:', formattedData);
            return formattedData;
        } catch (error) {
            console.error('格式化马拉松数据时出错:', error);
            // 即使出错也要返回基本的数据结构
            return {
                races: marathonData.map(race => ({
                    id: race.id,
                    name: race.name,
                    date: new Date(race.race_date).toISOString().split('T')[0],
                    location: race.location,
                    distance: race.distance,
                    time: race.finish_time,
                    ranking: race.ranking,
                    totalParticipants: race.total_participants,
                    weather: race.weather,
                    experience: race.experience,
                    certificate: race.certificate_image,
                    medal: race.medal_image,
                    photos: race.photos || []
                })),
                statistics: { 
                    totalRaces: 4, 
                    totalDistance: 52.2, 
                    monthlyDistance: "60" 
                }
            };
        }
    },

};

/**
 * 数据缓存模块
 */
const DataCache = {
    cache: new Map(),
    cacheDuration: 5 * 60 * 1000, // 5分钟缓存

    /**
     * 获取缓存数据
     * @param {string} key - 缓存键
     * @returns {any} 缓存的数据或null
     */
    get(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
            console.log(`📦 使用缓存数据: ${key}`);
            return cached.data;
        }
        return null;
    },

    /**
     * 设置缓存数据
     * @param {string} key - 缓存键
     * @param {any} data - 要缓存的数据
     */
    set(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
        console.log(`💾 数据已缓存: ${key}`);
    },

    /**
     * 清除指定缓存
     * @param {string} key - 缓存键
     */
    clear(key) {
        this.cache.delete(key);
    },

    /**
     * 清除所有缓存
     */
    clearAll() {
        this.cache.clear();
        console.log('🗑️ 所有缓存已清除');
    }
};

/**
 * 错误处理模块
 */
const ErrorHandler = {
    /**
     * 显示错误信息
     * @param {string} message - 错误信息
     * @param {Error} error - 错误对象
     */
    showError(message, error = null) {
        console.error('🚨 错误:', message, error);
        
        // 可以在这里添加用户友好的错误提示UI
        const errorElement = document.createElement('div');
        errorElement.className = 'error-toast';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4757;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
        `;
        
        document.body.appendChild(errorElement);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.parentNode.removeChild(errorElement);
            }
        }, 3000);
    },

    /**
     * 网络错误处理
     * @param {Error} error - 网络错误
     */
    handleNetworkError(error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            this.showError('网络连接失败，请检查网络设置');
        } else if (error.message.includes('timeout')) {
            this.showError('请求超时，请稍后重试');
        } else {
            this.showError('数据加载失败，请刷新页面重试');
        }
    }
};

// 在全局作用域中暴露API
window.LifeAPI = LifeAPI;
window.DataCache = DataCache;
window.ErrorHandler = ErrorHandler;
window.ImageUtils = ImageUtils;

console.log('🔧 Life API模块已加载');
console.log(`🌐 当前检测到的访问环境: ${window.location.protocol}//${window.location.hostname}`);
console.log(`🔗 配置的API baseURL: ${API_CONFIG.baseURL}`);