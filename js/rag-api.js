/**
 * RAG智能问答API模块
 * 提供前端与RAG后端系统的通信功能
 */

// RAG API配置
const RAG_CONFIG = {
    // 继承基础API配置
    baseURL: (() => {
        const isHTTPS = window.location.protocol === 'https:';
        const hostname = window.location.hostname;
        // 支持多个域名：chenhun.me 和 chenggao.top
        const isDomain = hostname.includes('chenhun.me') || hostname.includes('chenggao.top');

        if (isDomain && isHTTPS) {
            return 'https://api.chenhun.me';
        } else if (isDomain) {
            return 'http://api.chenhun.me';
        } else {
            return 'http://47.115.72.85:3001';
        }
    })(),
    timeout: 30000, // RAG请求需要更长的超时时间
    retryTimes: 2   // RAG请求重试次数较少
};

/**
 * RAG API请求函数
 * @param {string} endpoint - API端点
 * @param {object} options - 请求选项
 * @returns {Promise} API响应
 */
async function ragApiRequest(endpoint, options = {}) {
    const url = `${RAG_CONFIG.baseURL}${endpoint}`;
    
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: RAG_CONFIG.timeout,
        ...options
    };

    try {
        console.log(`🤖 RAG API请求: ${defaultOptions.method} ${url}`);
        
        const response = await fetch(url, defaultOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`✅ RAG API响应成功:`, data);
        
        return data;
    } catch (error) {
        console.error(`❌ RAG API请求失败 ${url}:`, error);
        throw error;
    }
}

/**
 * 带重试机制的RAG API请求
 * @param {string} endpoint - API端点
 * @param {object} options - 请求选项
 * @param {number} retryCount - 当前重试次数
 * @returns {Promise} API响应
 */
async function ragApiRequestWithRetry(endpoint, options = {}, retryCount = 0) {
    try {
        return await ragApiRequest(endpoint, options);
    } catch (error) {
        if (retryCount < RAG_CONFIG.retryTimes) {
            console.log(`🔄 重试RAG API请求 (${retryCount + 1}/${RAG_CONFIG.retryTimes}): ${endpoint}`);
            await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1))); // 递增延迟
            return ragApiRequestWithRetry(endpoint, options, retryCount + 1);
        }
        throw error;
    }
}

/**
 * RAG智能问答API模块
 */
const RAGAPI = {
    
    // ==========  智能问答  ==========
    
    /**
     * 发送智能问答请求
     * @param {string} question - 用户问题
     * @returns {Promise} AI回答和相关内容
     */
    async chat(question) {
        if (!question || typeof question !== 'string') {
            throw new Error('问题内容不能为空');
        }
        
        if (question.length > 500) {
            throw new Error('问题长度不能超过500字符');
        }
        
        const options = {
            method: 'POST',
            body: JSON.stringify({ question: question.trim() })
        };
        
        return await ragApiRequestWithRetry('/api/rag/chat', options);
    },
    
    // ==========  语义搜索  ==========
    
    /**
     * 语义搜索内容
     * @param {string} query - 搜索查询
     * @param {object} options - 搜索选项
     * @returns {Promise} 搜索结果
     */
    async search(query, options = {}) {
        if (!query || typeof query !== 'string') {
            throw new Error('搜索关键词不能为空');
        }
        
        const { type, limit = 10 } = options;
        
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({ 
                query: query.trim(),
                type: type,
                limit: limit
            })
        };
        
        return await ragApiRequestWithRetry('/api/rag/search', requestOptions);
    },
    
    /**
     * 搜索特定类型的内容
     * @param {string} query - 搜索查询
     * @param {string} type - 内容类型 (books/movies/music)
     * @param {number} limit - 结果数量限制
     * @returns {Promise} 搜索结果
     */
    async searchByType(query, type, limit = 10) {
        if (!['books', 'movies', 'music'].includes(type)) {
            throw new Error('类型必须是 books、movies 或 music');
        }
        
        return await this.search(query, { type, limit });
    },
    
    // ==========  智能推荐  ==========
    
    /**
     * 获取智能推荐
     * @param {object} preferences - 推荐偏好
     * @returns {Promise} 推荐结果
     */
    async getRecommendations(preferences = {}) {
        const { type, mood, limit = 10 } = preferences;
        
        const params = new URLSearchParams();
        if (type) params.append('type', type);
        if (mood) params.append('mood', mood);
        params.append('limit', limit.toString());
        
        const endpoint = `/api/rag/recommend?${params.toString()}`;
        return await ragApiRequestWithRetry(endpoint);
    },
    
    /**
     * 根据心情获取推荐
     * @param {string} mood - 心情描述
     * @param {number} limit - 结果数量限制
     * @returns {Promise} 推荐结果
     */
    async getRecommendationsByMood(mood, limit = 10) {
        return await this.getRecommendations({ mood, limit });
    },
    
    /**
     * 根据类型获取推荐
     * @param {string} type - 内容类型
     * @param {number} limit - 结果数量限制
     * @returns {Promise} 推荐结果
     */
    async getRecommendationsByType(type, limit = 10) {
        return await this.getRecommendations({ type, limit });
    },
    
    // ==========  相似内容发现  ==========
    
    /**
     * 获取相似内容
     * @param {string} contentType - 内容类型 (book/movie/music)
     * @param {number} contentId - 内容ID
     * @param {number} limit - 结果数量限制
     * @returns {Promise} 相似内容列表
     */
    async getSimilarContent(contentType, contentId, limit = 5) {
        if (!['book', 'movie', 'music'].includes(contentType)) {
            throw new Error('内容类型必须是 book、movie 或 music');
        }
        
        if (!contentId || isNaN(parseInt(contentId))) {
            throw new Error('内容ID必须是有效的数字');
        }
        
        const endpoint = `/api/rag/similar/${contentType}/${contentId}?limit=${limit}`;
        return await ragApiRequestWithRetry(endpoint);
    },
    
    // ==========  系统功能  ==========
    
    /**
     * 获取RAG系统统计信息
     * @returns {Promise} 统计信息
     */
    async getStats() {
        return await ragApiRequestWithRetry('/api/rag/stats');
    },
    
    /**
     * RAG系统健康检查
     * @returns {Promise} 健康状态
     */
    async healthCheck() {
        return await ragApiRequest('/api/rag/health');
    },
    
    // ==========  高级功能  ==========
    
    /**
     * 批量获取推荐内容
     * @param {Array} preferences - 推荐偏好数组
     * @returns {Promise} 批量推荐结果
     */
    async getBatchRecommendations(preferences) {
        const promises = preferences.map(pref => this.getRecommendations(pref));
        return await Promise.all(promises);
    },
    
    /**
     * 多维度搜索（同时搜索多个关键词）
     * @param {Array} queries - 搜索关键词数组
     * @param {object} options - 搜索选项
     * @returns {Promise} 多维度搜索结果
     */
    async multiSearch(queries, options = {}) {
        const promises = queries.map(query => this.search(query, options));
        const results = await Promise.all(promises);
        
        // 合并和去重结果
        const allResults = [];
        const seenIds = new Set();
        
        results.forEach(result => {
            if (result.success && result.data && result.data.results) {
                result.data.results.forEach(item => {
                    const uniqueKey = `${item.type}-${item.id}`;
                    if (!seenIds.has(uniqueKey)) {
                        seenIds.add(uniqueKey);
                        allResults.push(item);
                    }
                });
            }
        });
        
        // 按相似度排序
        allResults.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
        
        return {
            success: true,
            data: {
                queries: queries,
                combinedResults: allResults,
                total: allResults.length,
                timestamp: new Date().toISOString()
            }
        };
    },
    
    /**
     * 智能内容分析（分析用户输入并选择最佳功能）
     * @param {string} input - 用户输入
     * @returns {Promise} 分析结果和建议操作
     */
    async analyzeInput(input) {
        // 简单的输入分析逻辑
        const inputLower = input.toLowerCase();
        
        // 判断是否为问题（包含疑问词）
        const questionWords = ['什么', '怎么', '如何', '为什么', '哪个', '哪些', '推荐', '建议'];
        const isQuestion = questionWords.some(word => inputLower.includes(word)) || input.includes('？') || input.includes('?');
        
        // 判断是否为搜索（包含搜索词）
        const searchWords = ['搜索', '查找', '找到', '关于'];
        const isSearch = searchWords.some(word => inputLower.includes(word));
        
        // 判断内容类型
        let contentType = null;
        if (inputLower.includes('书') || inputLower.includes('阅读') || inputLower.includes('读')) {
            contentType = 'books';
        } else if (inputLower.includes('电影') || inputLower.includes('影片') || inputLower.includes('观看')) {
            contentType = 'movies';
        } else if (inputLower.includes('音乐') || inputLower.includes('歌') || inputLower.includes('听')) {
            contentType = 'music';
        }
        
        let suggestion = {
            action: 'chat', // 默认为聊天
            reason: '这看起来像是一个问题，建议使用智能问答功能'
        };
        
        if (isSearch && !isQuestion) {
            suggestion = {
                action: 'search',
                contentType: contentType,
                reason: '这看起来像是搜索请求，建议使用语义搜索功能'
            };
        } else if (inputLower.includes('推荐') || inputLower.includes('建议')) {
            suggestion = {
                action: 'recommend',
                contentType: contentType,
                reason: '这是推荐请求，建议使用智能推荐功能'
            };
        }
        
        return {
            input: input,
            analysis: {
                isQuestion: isQuestion,
                isSearch: isSearch,
                contentType: contentType,
                suggestion: suggestion
            }
        };
    }
};

/**
 * RAG缓存模块（专门用于RAG数据缓存）
 */
const RAGCache = {
    cache: new Map(),
    cacheDuration: 10 * 60 * 1000, // RAG数据缓存10分钟（更长）

    /**
     * 生成缓存键
     * @param {string} type - 缓存类型
     * @param {string} key - 原始键
     * @returns {string} 缓存键
     */
    generateKey(type, key) {
        return `rag_${type}_${key}`;
    },

    /**
     * 获取缓存数据
     * @param {string} type - 缓存类型
     * @param {string} key - 缓存键
     * @returns {any} 缓存的数据或null
     */
    get(type, key) {
        const cacheKey = this.generateKey(type, key);
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
            console.log(`📦 使用RAG缓存数据: ${cacheKey}`);
            return cached.data;
        }
        return null;
    },

    /**
     * 设置缓存数据
     * @param {string} type - 缓存类型
     * @param {string} key - 缓存键
     * @param {any} data - 要缓存的数据
     */
    set(type, key, data) {
        const cacheKey = this.generateKey(type, key);
        this.cache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });
        console.log(`💾 RAG数据已缓存: ${cacheKey}`);
    },

    /**
     * 清除指定缓存
     * @param {string} type - 缓存类型
     * @param {string} key - 缓存键
     */
    clear(type, key) {
        const cacheKey = this.generateKey(type, key);
        this.cache.delete(cacheKey);
    },

    /**
     * 清除所有RAG缓存
     */
    clearAll() {
        // 只清除RAG相关的缓存
        for (const [key] of this.cache) {
            if (key.startsWith('rag_')) {
                this.cache.delete(key);
            }
        }
        console.log('🗑️ 所有RAG缓存已清除');
    }
};

/**
 * RAG错误处理模块
 */
const RAGErrorHandler = {
    /**
     * 显示RAG错误信息
     * @param {string} message - 错误信息
     * @param {Error} error - 错误对象
     */
    showError(message, error = null) {
        console.error('🤖🚨 RAG错误:', message, error);
        
        // 创建RAG专用的错误提示UI
        const errorElement = document.createElement('div');
        errorElement.className = 'rag-error-toast';
        errorElement.innerHTML = `
            <div style="display: flex; align-items: center;">
                <span style="margin-right: 8px;">🤖</span>
                <span>${message}</span>
            </div>
        `;
        errorElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 20px;
            border-radius: 12px;
            z-index: 9999;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
            max-width: 350px;
            font-size: 14px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(errorElement);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => {
                    if (errorElement.parentNode) {
                        errorElement.parentNode.removeChild(errorElement);
                    }
                }, 300);
            }
        }, 3000);
    },

    /**
     * RAG网络错误处理
     * @param {Error} error - 网络错误
     */
    handleNetworkError(error) {
        if (error.message.includes('timeout')) {
            this.showError('AI服务响应超时，请稍后重试');
        } else if (error.message.includes('503')) {
            this.showError('AI服务暂时不可用，请稍后重试');
        } else if (error.message.includes('rate limit')) {
            this.showError('请求过于频繁，请稍后再试');
        } else {
            this.showError('AI服务连接失败，请检查网络');
        }
    }
};

// 添加CSS动画到页面
if (!document.getElementById('rag-animations')) {
    const style = document.createElement('style');
    style.id = 'rag-animations';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// 在全局作用域中暴露RAG API
window.RAGAPI = RAGAPI;
window.RAGCache = RAGCache;
window.RAGErrorHandler = RAGErrorHandler;

console.log('🤖 RAG API模块已加载');
console.log(`🔗 RAG API baseURL: ${RAG_CONFIG.baseURL}`);