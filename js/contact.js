// 留言板功能
class MessageBoard {
    constructor() {
        this.form = document.getElementById('messageForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.successMessage = document.getElementById('successMessage');
        this.btnText = this.submitBtn?.querySelector('.btn-text');
        this.btnLoading = this.submitBtn?.querySelector('.btn-loading');
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        // 表单验证
        const inputs = this.form?.querySelectorAll('input, textarea');
        inputs?.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        
        this.setLoading(true);
        
        try {
            // 使用AJAX提交到Formspree
            const formData = new FormData(this.form);
            
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                this.showSuccess();
                this.form.reset();
                console.log('表单提交成功');
            } else {
                console.log('响应状态:', response.status);
                const data = await response.json().catch(() => ({}));
                console.log('响应数据:', data);
                
                if (data.errors) {
                    this.showError('发送失败：' + data.errors.map(e => e.message).join(', '));
                } else {
                    this.showError(`发送失败 (${response.status})，请稍后重试`);
                }
            }
            
        } catch (error) {
            console.error('提交错误:', error);
            this.showError('网络错误，请检查网络连接后重试');
        } finally {
            this.setLoading(false);
        }
    }
    
    validateForm() {
        const messageField = document.getElementById('message');
        
        if (!messageField.value.trim()) {
            this.showFieldError(messageField, '请输入留言内容');
            return false;
        }
        
        if (messageField.value.trim().length < 5) {
            this.showFieldError(messageField, '留言内容至少需要5个字符');
            return false;
        }
        
        // 验证邮箱格式（如果填写了的话）
        const emailField = document.getElementById('email');
        if (emailField.value.trim() && !this.isValidEmail(emailField.value)) {
            this.showFieldError(emailField, '请输入有效的邮箱地址');
            return false;
        }
        
        return true;
    }
    
    validateField(field) {
        if (field.id === 'message' && field.required) {
            if (!field.value.trim()) {
                this.showFieldError(field, '请输入留言内容');
                return false;
            }
            if (field.value.trim().length < 5) {
                this.showFieldError(field, '留言内容至少需要5个字符');
                return false;
            }
        }
        
        if (field.id === 'email' && field.value.trim()) {
            if (!this.isValidEmail(field.value)) {
                this.showFieldError(field, '请输入有效的邮箱地址');
                return false;
            }
        }
        
        this.clearFieldError(field);
        return true;
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            animation: fadeIn 0.3s ease-out;
        `;
        
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#ef4444';
    }
    
    clearFieldError(field) {
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.style.borderColor = '';
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    setLoading(loading) {
        if (!this.submitBtn) return;
        
        this.submitBtn.disabled = loading;
        
        if (loading) {
            this.btnText.style.display = 'none';
            this.btnLoading.style.display = 'flex';
        } else {
            this.btnText.style.display = 'inline';
            this.btnLoading.style.display = 'none';
        }
    }
    
    showSuccess() {
        if (this.successMessage) {
            this.successMessage.style.display = 'block';
            // 隐藏表单，只在重定向回来时显示成功消息
            if (this.form) {
                this.form.style.display = 'none';
            }
            
            // 5秒后隐藏成功消息，显示表单
            setTimeout(() => {
                if (this.successMessage) {
                    this.successMessage.style.display = 'none';
                }
                if (this.form) {
                    this.form.style.display = 'block';
                    this.form.reset();
                }
            }, 5000);
        }
    }
    
    showError(message) {
        // 创建临时错误提示
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div style="
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
                backdrop-filter: blur(20px);
                border: 1px solid rgba(239, 68, 68, 0.2);
                border-radius: 12px;
                padding: 1rem;
                margin-top: 1rem;
                text-align: center;
                color: #ef4444;
                animation: slideInUp 0.5s ease-out forwards;
            ">
                ${message}
            </div>
        `;
        
        this.form.appendChild(errorDiv);
        
        // 3秒后自动移除
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}


// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    const messageBoard = new MessageBoard();
    
    // 添加CSS动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
});