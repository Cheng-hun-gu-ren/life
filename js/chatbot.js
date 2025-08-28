/**
 * 智能聊天机器人组件 - 毛玻璃风格版本
 * 提供RAG智能问答功能的用户界面
 * 与网站整体设计风格保持一致
 */

class ChatBot {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.messages = [];
        this.isProcessing = false;
        this.suggestions = [
            "他最近读了什么书？",
            "他平时喜欢看什么类型的电影？",
            "他有什么音乐推荐吗？", 
            "他的阅读品味怎么样？",
            "他对哪些电影印象深刻？",
            "他最喜欢的音乐风格是什么？",
            "能介绍一下他的文化兴趣吗？",
            "他会推荐哪些经典作品？"
        ];
        
        this.init();
    }
    
    /**
     * 初始化聊天机器人
     */
    init() {
        this.createChatInterface();
        this.bindEvents();
        this.showWelcomeMessage();
    }
    
    /**
     * 创建聊天界面 - 毛玻璃风格
     */
    createChatInterface() {
        this.container.innerHTML = `
            <div class="chatbot-wrapper">
                <div class="chatbot-header">
                    <div class="chatbot-avatar">🤖</div>
                    <div class="chatbot-info">
                        <h3>智能助手</h3>
                        <p class="chatbot-status">在线 - 基于您的个人数据</p>
                    </div>
                    <button class="chatbot-close" aria-label="关闭">×</button>
                </div>
                
                <div class="chatbot-messages" id="chatbot-messages">
                    <!-- 消息将在这里显示 -->
                </div>
                
                <div class="chatbot-suggestions" id="chatbot-suggestions">
                    <!-- 建议问题 -->
                </div>
                
                <div class="chatbot-input-area">
                    <textarea 
                        id="chatbot-input" 
                        class="chatbot-input"
                        placeholder="问我关于书籍、电影、音乐的任何问题..." 
                        maxlength="500"
                        rows="1"
                    ></textarea>
                    <button id="chatbot-send" class="chatbot-send" aria-label="发送">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
                
                <div class="input-hint">
                    <span class="char-count">0/500</span>
                    <span class="hint-text">支持智能推荐和上下文对话</span>
                </div>
            </div>
        `;
        
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.suggestionsContainer = document.getElementById('chatbot-suggestions');
        this.inputField = document.getElementById('chatbot-input');
        this.sendButton = document.getElementById('chatbot-send');
        this.charCount = this.container.querySelector('.char-count');
        
        this.renderSuggestions();
        this.setupAutoResize();
    }
    
    /**
     * 设置输入框自动调整高度
     */
    setupAutoResize() {
        this.inputField.addEventListener('input', () => {
            // 重置高度以获取正确的scrollHeight
            this.inputField.style.height = 'auto';
            
            // 设置新高度，限制在1-4行之间
            const maxHeight = parseFloat(getComputedStyle(this.inputField).lineHeight) * 4;
            const newHeight = Math.min(this.inputField.scrollHeight, maxHeight);
            this.inputField.style.height = newHeight + 'px';
        });
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 发送按钮点击
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // 输入框回车（Shift+Enter换行，Enter发送）
        this.inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // 字符计数和输入状态
        this.inputField.addEventListener('input', (e) => {
            const length = e.target.value.length;
            this.charCount.textContent = `${length}/500`;
            
            // 根据字符数量改变颜色
            if (length > 450) {
                this.charCount.style.color = '#ef4444';
            } else if (length > 400) {
                this.charCount.style.color = '#f59e0b';
            } else {
                this.charCount.style.color = 'var(--text-muted-color)';
            }
            
            // 控制发送按钮状态
            this.sendButton.style.opacity = length > 0 ? '1' : '0.6';
        });
        
        // 关闭按钮
        const closeBtn = this.container.querySelector('.chatbot-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeChatbot();
            });
        }
    }
    
    /**
     * 关闭聊天机器人
     */
    closeChatbot() {
        const modal = document.getElementById('chatbotModal');
        const fab = document.getElementById('chatbotFab');
        
        if (modal) {
            modal.classList.remove('active');
        }
        if (fab) {
            fab.classList.remove('active');
        }
    }
    
    /**
     * 显示欢迎消息
     */
    showWelcomeMessage() {
        const welcomeMessage = `你好！我是这里的智能向导 🤖

我可以为您介绍网站主人的：
• 阅读品味和书籍推荐
• 电影爱好和观影感悟
• 音乐偏好和收听体验
• 个人兴趣和文化见解

想了解他在哪方面的品味呢？`;
        
        this.addMessage('bot', welcomeMessage);
    }
    
    /**
     * 渲染建议问题 - 毛玻璃风格
     */
    renderSuggestions() {
        const shuffled = [...this.suggestions].sort(() => Math.random() - 0.5);
        const displaySuggestions = shuffled.slice(0, 3);
        
        this.suggestionsContainer.innerHTML = `
            <div class="suggestions-title">💡 试试问我这些问题：</div>
            <div class="suggestion-chips">
                ${displaySuggestions.map(suggestion => 
                    `<button class="suggestion-chip" data-suggestion="${suggestion}" type="button">${suggestion}</button>`
                ).join('')}
            </div>
        `;
        
        // 绑定建议点击事件
        this.suggestionsContainer.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const suggestion = e.target.getAttribute('data-suggestion');
                this.inputField.value = suggestion;
                this.inputField.focus();
                // 触发input事件以更新字符计数
                this.inputField.dispatchEvent(new Event('input'));
            });
        });
    }
    
    /**
     * 发送消息
     */
    async sendMessage() {
        const message = this.inputField.value.trim();
        if (!message || this.isProcessing) return;
        
        this.isProcessing = true;
        this.updateSendButton(true);
        
        // 添加用户消息
        this.addMessage('user', message);
        this.inputField.value = '';
        this.inputField.style.height = 'auto';
        this.charCount.textContent = '0/500';
        this.charCount.style.color = 'var(--text-muted-color)';
        this.sendButton.style.opacity = '0.6';
        
        // 隐藏建议
        this.suggestionsContainer.style.display = 'none';
        
        // 显示打字指示器
        this.showTypingIndicator();
        
        try {
            // 发送到RAG API
            console.log('🤖 发送消息到RAG API:', message);
            const response = await RAGAPI.chat(message);
            
            this.hideTypingIndicator();
            
            if (response.success) {
                const { answer, relatedContent, hasContext } = response.data;
                
                // 添加AI回答
                this.addMessage('bot', answer, relatedContent);
                
                // 如果没有找到相关内容，显示建议
                if (!hasContext || (relatedContent && relatedContent.length === 0)) {
                    setTimeout(() => {
                        this.renderSuggestions();
                        this.suggestionsContainer.style.display = 'block';
                    }, 1000);
                }
                
            } else {
                this.addMessage('bot', '抱歉，我现在无法处理您的问题，请稍后再试。💭');
            }
            
        } catch (error) {
            console.error('❌ 发送消息失败:', error);
            this.hideTypingIndicator();
            
            let errorMessage = '抱歉，出现了一些技术问题。🔧';
            if (error.message.includes('timeout')) {
                errorMessage = '响应时间过长，请尝试简化您的问题。⏱️';
            } else if (error.message.includes('rate limit')) {
                errorMessage = '请求过于频繁，请稍后再试。⚡';
            }
            
            this.addMessage('bot', errorMessage);
            if (window.RAGErrorHandler) {
                RAGErrorHandler.handleNetworkError(error);
            }
        } finally {
            this.isProcessing = false;
            this.updateSendButton(false);
        }
    }
    
    /**
     * 添加消息到聊天界面 - 毛玻璃风格
     */
    addMessage(sender, content, relatedContent = null) {
        const messageId = 'msg_' + Date.now();
        const time = new Date().toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        messageElement.id = messageId;
        
        const avatar = sender === 'user' ? '👤' : '🤖';
        // 处理换行符
        const formattedContent = content.replace(/\n/g, '<br>');
        
        let relatedContentHtml = '';
        if (relatedContent && relatedContent.length > 0) {
            const items = relatedContent.slice(0, 6).map(item => {
                const typeEmoji = this.getTypeEmoji(item.type);
                const similarity = Math.round(item.similarity * 100);
                return `
                    <button class="related-item" data-type="${item.type}" data-id="${item.id}" type="button">
                        <span class="item-type">${typeEmoji} ${this.getTypeDisplayName(item.type)}</span>
                        <span class="item-name">${item.name}</span>
                        <span class="item-similarity">相似度: ${similarity}%</span>
                    </button>
                `;
            }).join('');
            
            relatedContentHtml = `
                <div class="related-content">
                    <div class="related-title">📚 相关内容推荐：</div>
                    <div class="related-items">${items}</div>
                </div>
            `;
        }
        
        messageElement.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-bubble">
                    <div class="message-text">${formattedContent}</div>
                    ${relatedContentHtml}
                </div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        // 绑定相关内容点击事件
        if (relatedContent) {
            messageElement.querySelectorAll('.related-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    const type = e.currentTarget.getAttribute('data-type');
                    const id = e.currentTarget.getAttribute('data-id');
                    this.handleRelatedContentClick(type, id, e.currentTarget);
                });
            });
        }
        
        // 保存消息到历史
        this.messages.push({
            id: messageId,
            sender: sender,
            content: content,
            relatedContent: relatedContent,
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * 处理相关内容点击
     */
    handleRelatedContentClick(type, id, element) {
        const questions = {
            'book': `他对这本书有什么看法？能详细介绍一下吗？`,
            'movie': `他觉得这部电影有什么特别之处？为什么会喜欢？`,
            'music': `他为什么会喜欢这首歌？有什么特别的感受吗？`
        };
        
        // 获取内容名称
        const nameElement = element.querySelector('.item-name');
        const contentName = nameElement ? nameElement.textContent.trim() : '';
        
        const baseQuestion = questions[type] || '能详细介绍一下这个内容吗？';
        
        // 在问题前加上内容名称
        const question = contentName ? `${contentName} ${baseQuestion}` : baseQuestion;
        
        this.inputField.value = question;
        this.inputField.focus();
        // 触发input事件以更新字符计数和按钮状态
        this.inputField.dispatchEvent(new Event('input'));
    }
    
    /**
     * 显示打字指示器 - 毛玻璃风格
     */
    showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'message bot typing-message';
        indicator.id = 'typing-indicator';
        
        indicator.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="message-bubble">
                    <div class="typing-indicator">
                        <span>正在思考中</span>
                        <div class="typing-dots">
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.messagesContainer.appendChild(indicator);
        this.scrollToBottom();
    }
    
    /**
     * 隐藏打字指示器
     */
    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    /**
     * 更新发送按钮状态
     */
    updateSendButton(isProcessing) {
        this.sendButton.disabled = isProcessing;
        this.inputField.disabled = isProcessing;
        
        if (isProcessing) {
            this.sendButton.innerHTML = `
                <div class="sending-spinner">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="3" fill="currentColor">
                            <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
                        </circle>
                    </svg>
                </div>
            `;
        } else {
            this.sendButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
                </svg>
            `;
        }
    }
    
    /**
     * 滚动到底部
     */
    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }
    
    /**
     * 获取类型表情符号
     */
    getTypeEmoji(type) {
        const emojiMap = {
            'book': '📚',
            'movie': '🎬', 
            'music': '🎵'
        };
        return emojiMap[type] || '📄';
    }
    
    /**
     * 获取类型显示名称
     */
    getTypeDisplayName(type) {
        const nameMap = {
            'book': '书籍',
            'movie': '电影',
            'music': '音乐'
        };
        return nameMap[type] || type;
    }
    
    /**
     * 清除聊天历史
     */
    clearHistory() {
        this.messages = [];
        this.messagesContainer.innerHTML = '';
        this.showWelcomeMessage();
        this.renderSuggestions();
        this.suggestionsContainer.style.display = 'block';
    }
    
    /**
     * 获取聊天历史
     */
    getChatHistory() {
        return [...this.messages];
    }
    
    /**
     * 销毁实例
     */
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.messages = [];
        this.isProcessing = false;
    }
}

// 暴露到全局
window.ChatBot = ChatBot;