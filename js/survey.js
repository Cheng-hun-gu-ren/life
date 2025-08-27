// 问卷调查功能
class SurveyManager {
    constructor() {
        // 使用与api.js相同的智能API地址选择逻辑
        this.apiBaseUrl = this.getApiBaseUrl();
        this.init();
    }

    getApiBaseUrl() {
        const isDomain = window.location.hostname === 'life.chenggao.top';
        
        if (isDomain) {
            console.log('🔄 Survey: 使用API子域名');
            return 'https://api.chenggao.top';
        } else {
            console.log('💻 Survey: 本地开发环境');
            return 'http://47.115.72.85:3001';
        }
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // 绑定表单提交事件
        const surveyForm = document.getElementById('surveyForm');
        if (surveyForm) {
            surveyForm.addEventListener('submit', this.handleSubmit.bind(this));
        }

        // 绑定ESC键关闭弹窗
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalOpen()) {
                closeSurvey();
            }
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        const submitBtn = event.target.querySelector('.btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // 显示加载状态
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        submitBtn.disabled = true;

        try {
            const formData = this.getFormData();
            console.log('Submitting survey data:', formData);
            
            const response = await this.submitSurvey(formData);
            
            if (response.success) {
                this.showSuccessMessage();
            } else {
                throw new Error(response.message || '提交失败');
            }
        } catch (error) {
            console.error('Survey submission error:', error);
            this.showErrorMessage(error.message);
        } finally {
            // 恢复按钮状态
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    }

    getFormData() {
        const form = document.getElementById('surveyForm');
        const formData = new FormData(form);
        
        return {
            rating: formData.get('rating'),
            suggestions: formData.get('suggestions') || '',
            website_interest: formData.get('website_interest'),
            nickname: formData.get('nickname') || '',
            contact: formData.get('contact') || '',
            submitted_at: new Date().toISOString(),
            user_agent: navigator.userAgent,
            referrer: document.referrer || ''
        };
    }

    async submitSurvey(data) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/survey/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            // 如果API失败，可以考虑备用方案（如发送到邮箱等）
            throw error;
        }
    }

    showSuccessMessage() {
        const form = document.getElementById('surveyForm');
        const successDiv = document.getElementById('surveySuccess');
        
        form.style.display = 'none';
        successDiv.style.display = 'block';
    }

    showErrorMessage(message) {
        // 简单的错误提示
        alert(`提交失败: ${message}\n\n你也可以通过微信 chgr_CarpeDiem 直接联系我分享你的想法。`);
    }

    isModalOpen() {
        const modal = document.getElementById('surveyModal');
        return modal && modal.style.display === 'flex';
    }
}

// 全局函数：打开问卷弹窗
function openSurvey() {
    const modal = document.getElementById('surveyModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 禁止背景滚动
        
        // 添加打开动画
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
}

// 全局函数：关闭问卷弹窗
function closeSurvey() {
    const modal = document.getElementById('surveyModal');
    if (modal) {
        modal.classList.remove('show');
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // 恢复滚动
            
            // 重置表单
            resetSurveyForm();
        }, 300);
    }
}

// 重置问卷表单
function resetSurveyForm() {
    const form = document.getElementById('surveyForm');
    const successDiv = document.getElementById('surveySuccess');
    
    if (form) {
        form.reset();
        form.style.display = 'block';
    }
    
    if (successDiv) {
        successDiv.style.display = 'none';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    new SurveyManager();
    
    // 点击弹窗外部区域关闭弹窗
    const modal = document.getElementById('surveyModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeSurvey();
            }
        });
    }
});