/**
 * 智能聊天机器人组件
 * 提供RAG智能问答功能的用户界面
 */

class ChatBot {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.messages = [];
        this.isProcessing = false;
        this.suggestions = [
            "推荐几本关于心理学的书籍",
            "有什么治愈系的音乐推荐吗？",
            "想看一部让人深思的电影", 
            "最近读了什么有趣的书？",
            "有没有适合放松的歌曲？",
            "推荐一些经典的电影台词"
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
     * 创建聊天界面
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
                    <button class="chatbot-minimize" aria-label="最小化">−</button>
                </div>
                
                <div class="chatbot-messages" id="chatbot-messages">
                    <!-- 消息将在这里显示 -->
                </div>
                
                <div class="chatbot-suggestions" id="chatbot-suggestions">
                    <!-- 建议问题 -->
                </div>
                
                <div class="chatbot-input-area">
                    <div class="input-wrapper">
                        <input 
                            type="text" 
                            id="chatbot-input" 
                            placeholder="问我关于书籍、电影、音乐的任何问题..." 
                            maxlength="500"
                        />
                        <button id="chatbot-send" class="send-button" aria-label="发送">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                    <div class="input-hint">
                        <span class="char-count">0/500</span>
                        <span class="hint-text">支持语音输入和智能推荐</span>
                    </div>
                </div>
            </div>
        `;
        
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.suggestionsContainer = document.getElementById('chatbot-suggestions');
        this.inputField = document.getElementById('chatbot-input');
        this.sendButton = document.getElementById('chatbot-send');
        this.charCount = this.container.querySelector('.char-count');
        
        this.renderSuggestions();
        this.applyChatbotStyles();
    }
    
    /**
     * 应用聊天机器人样式
     */
    applyChatbotStyles() {
        if (document.getElementById('chatbot-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'chatbot-styles';
        styles.textContent = `
            .chatbot-wrapper {
                display: flex;
                flex-direction: column;
                height: 600px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .chatbot-header {
                display: flex;
                align-items: center;
                padding: 16px 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            
            .chatbot-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                margin-right: 12px;
            }
            
            .chatbot-info h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }
            
            .chatbot-status {
                margin: 0;
                font-size: 12px;
                opacity: 0.9;
            }
            
            .chatbot-minimize {
                margin-left: auto;
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                transition: background-color 0.2s;
            }
            
            .chatbot-minimize:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .chatbot-messages {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                background: #f8f9fa;
            }
            
            .message {
                margin-bottom: 16px;
                display: flex;
                align-items: flex-start;
                animation: messageSlideIn 0.3s ease-out;
            }
            
            .message.user {
                flex-direction: row-reverse;
            }
            
            .message-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                flex-shrink: 0;
            }
            
            .message.user .message-avatar {
                background: #007bff;
                color: white;
                margin-left: 8px;
            }
            
            .message.bot .message-avatar {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                margin-right: 8px;
            }
            
            .message-content {
                flex: 1;
                max-width: 80%;
            }
            
            .message-bubble {
                padding: 12px 16px;
                border-radius: 18px;
                position: relative;
                word-wrap: break-word;
                line-height: 1.4;
            }
            
            .message.user .message-bubble {
                background: #007bff;
                color: white;
                margin-left: auto;
            }
            
            .message.bot .message-bubble {
                background: white;
                color: #333;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            
            .message-time {
                font-size: 11px;
                opacity: 0.6;
                margin-top: 4px;
                text-align: right;
            }
            
            .message.user .message-time {
                text-align: left;
            }
            
            .related-content {
                margin-top: 12px;
            }
            
            .related-title {
                font-size: 12px;
                font-weight: 600;
                color: #666;
                margin-bottom: 8px;
            }
            
            .related-items {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }
            
            .related-item {
                background: #f0f2ff;
                border: 1px solid #e0e6ff;
                border-radius: 8px;
                padding: 6px 10px;
                font-size: 11px;
                cursor: pointer;
                transition: all 0.2s;
                max-width: 200px;
            }
            
            .related-item:hover {
                background: #e0e6ff;
                border-color: #c0ccff;
            }
            
            .related-item .item-type {
                display: inline-block;
                font-weight: 600;
                margin-right: 4px;
            }
            
            .related-item .item-name {
                display: block;
                color: #333;
                font-weight: 500;
            }
            
            .related-item .item-similarity {
                display: block;
                color: #666;
                font-size: 10px;
            }
            
            .chatbot-suggestions {
                padding: 12px 16px;
                border-top: 1px solid #eee;
                background: white;
            }
            
            .suggestions-title {
                font-size: 12px;
                color: #666;
                margin-bottom: 8px;
                font-weight: 600;
            }
            
            .suggestion-chips {
                display: flex;
                gap: 6px;
                flex-wrap: wrap;
            }
            
            .suggestion-chip {
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 12px;
                padding: 4px 10px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
                white-space: nowrap;
            }
            
            .suggestion-chip:hover {
                background: #e9ecef;
                border-color: #adb5bd;
            }
            
            .chatbot-input-area {
                padding: 16px;
                background: white;
                border-top: 1px solid #eee;
            }
            
            .input-wrapper {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            #chatbot-input {
                flex: 1;
                border: 1px solid #ddd;
                border-radius: 24px;
                padding: 10px 16px;
                outline: none;
                transition: border-color 0.2s;
                font-size: 14px;
            }
            
            #chatbot-input:focus {
                border-color: #667eea;
            }
            
            .send-button {
                width: 40px;
                height: 40px;
                border: none;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s;
            }
            
            .send-button:hover:not(:disabled) {
                transform: scale(1.05);
            }
            
            .send-button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            .input-hint {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 6px;
                font-size: 11px;
                color: #666;
            }
            
            .typing-indicator {
                display: flex;
                align-items: center;
                padding: 12px 16px;
                background: white;
                border-radius: 18px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                margin-bottom: 16px;
            }
            
            .typing-dots {
                display: flex;
                gap: 4px;
                margin-left: 8px;
            }
            
            .typing-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #999;
                animation: typingBounce 1.4s infinite;
            }
            
            .typing-dot:nth-child(2) { animation-delay: 0.2s; }
            .typing-dot:nth-child(3) { animation-delay: 0.4s; }
            
            @keyframes messageSlideIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes typingBounce {
                0%, 60%, 100% { transform: translateY(0); }
                30% { transform: translateY(-10px); }
            }
            
            .chatbot-messages::-webkit-scrollbar {
                width: 4px;
            }
            
            .chatbot-messages::-webkit-scrollbar-track {
                background: #f1f1f1;
            }
            
            .chatbot-messages::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 2px;
            }
            
            .chatbot-messages::-webkit-scrollbar-thumb:hover {
                background: #a1a1a1;
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 发送按钮点击
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // 输入框回车
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // 字符计数
        this.inputField.addEventListener('input', (e) => {
            const length = e.target.value.length;
            this.charCount.textContent = `${length}/500`;
            
            if (length > 450) {
                this.charCount.style.color = '#ff4757';
            } else if (length > 400) {
                this.charCount.style.color = '#ffa502';
            } else {
                this.charCount.style.color = '#666';
            }
        });
        
        // 最小化按钮
        this.container.querySelector('.chatbot-minimize').addEventListener('click', () => {
            this.toggleMinimize();
        });
    }
    
    /**
     * 显示欢迎消息
     */
    showWelcomeMessage() {
        const welcomeMessage = "你好！我是基于您个人数据的智能助手 🤖\n\n我可以帮您：\n• 推荐书籍、电影、音乐\n• 回答关于您收藏的问题\n• 发现相似的内容\n• 根据心情推荐合适的内容\n\n请问您想了解什么呢？";
        
        this.addMessage('bot', welcomeMessage);
    }
    
    /**
     * 渲染建议问题
     */
    renderSuggestions() {
        const shuffled = [...this.suggestions].sort(() => Math.random() - 0.5);
        const displaySuggestions = shuffled.slice(0, 4);
        
        this.suggestionsContainer.innerHTML = `
            <div class="suggestions-title">💡 试试问我这些问题：</div>
            <div class="suggestion-chips">
                ${displaySuggestions.map(suggestion => 
                    `<div class="suggestion-chip" data-suggestion="${suggestion}">${suggestion}</div>`
                ).join('')}
            </div>
        `;
        
        // 绑定建议点击事件
        this.suggestionsContainer.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const suggestion = e.target.getAttribute('data-suggestion');
                this.inputField.value = suggestion;
                this.sendMessage();
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
        this.charCount.textContent = '0/500';
        
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
                this.addMessage('bot', '抱歉，我现在无法处理您的问题，请稍后再试。');
            }
            
        } catch (error) {
            console.error('❌ 发送消息失败:', error);
            this.hideTypingIndicator();
            
            let errorMessage = '抱歉，出现了一些技术问题。';
            if (error.message.includes('timeout')) {
                errorMessage = '响应时间过长，请尝试简化您的问题。';
            } else if (error.message.includes('rate limit')) {
                errorMessage = '请求过于频繁，请稍后再试。';
            }
            
            this.addMessage('bot', errorMessage);
            RAGErrorHandler.handleNetworkError(error);
        } finally {
            this.isProcessing = false;
            this.updateSendButton(false);
        }
    }
    
    /**
     * 添加消息到聊天界面
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
        const formattedContent = content.replace(/\\n/g, '\\n').replace(/\\n/g, '<br>');
        
        let relatedContentHtml = '';
        if (relatedContent && relatedContent.length > 0) {
            const items = relatedContent.slice(0, 6).map(item => {
                const typeEmoji = this.getTypeEmoji(item.type);
                const similarity = Math.round(item.similarity * 100);
                return `
                    <div class="related-item" data-type="${item.type}" data-id="${item.id}">
                        <span class="item-type">${typeEmoji} ${this.getTypeDisplayName(item.type)}</span>
                        <span class="item-name">${item.name}</span>
                        <span class="item-similarity">相似度: ${similarity}%</span>
                    </div>
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
                    ${formattedContent}
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
                    this.handleRelatedContentClick(type, id);
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
    handleRelatedContentClick(type, id) {
        const questions = {
            'book': `给我详细介绍一下这本书的内容和您的读后感`,
            'movie': `这部电影有什么特别之处吗？您最喜欢哪个部分？`,
            'music': `这首歌为什么打动您？能分享一下听歌时的感受吗？`
        };
        
        const question = questions[type] || '能详细介绍一下这个内容吗？';
        this.inputField.value = question;
        this.sendMessage();
    }
    
    /**
     * 显示打字指示器
     */
    showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = `
            <div class="message-avatar">🤖</div>
            正在思考中...
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="3" fill="currentColor">
                        <animate attributeName="r" values="3;6;3" dur="1s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite"/>
                    </circle>
                </svg>
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
     * 切换最小化状态
     */
    toggleMinimize() {
        const wrapper = this.container.querySelector('.chatbot-wrapper');
        const isMinimized = wrapper.style.height === '60px';
        
        if (isMinimized) {
            wrapper.style.height = '600px';
            this.container.querySelector('.chatbot-minimize').textContent = '−';
        } else {
            wrapper.style.height = '60px';
            this.container.querySelector('.chatbot-minimize').textContent = '+';
        }
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
}

// 暴露到全局
window.ChatBot = ChatBot;