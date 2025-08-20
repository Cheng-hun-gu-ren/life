/**
 * 自定义下拉菜单组件
 * 支持鼠标悬停和点击交互，与现有筛选逻辑兼容
 */

class CustomDropdown {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            hoverDelay: 0, // 立即显示，无延迟
            autoClose: true,
            onChange: null,
            ...options
        };
        
        this.trigger = element.querySelector('.dropdown-trigger');
        this.menu = element.querySelector('.dropdown-menu');
        this.label = element.querySelector('.dropdown-label');
        this.arrow = element.querySelector('.dropdown-arrow');
        
        this.isOpen = false;
        this.selectedValue = 'all';
        this.hoverTimer = null;
        this.closeTimer = null;
        this.lastMousePosition = { x: 0, y: 0 };
        this.isClicking = false; // 添加点击状态追踪
        
        this.init();
    }
    
    init() {
        this.initializeSelectedValue();
        this.bindEvents();
        this.updateLabel();
    }
    
    bindEvents() {
        // 鼠标悬停事件
        this.element.addEventListener('mouseenter', () => {
            // 只在没有正在进行点击操作时才响应悬停
            if (!this.isClicking) {
                this.clearTimers();
                this.hoverTimer = setTimeout(() => {
                    if (!this.isClicking) { // 再次检查，确保点击优先
                        this.open();
                    }
                }, this.options.hoverDelay);
            }
        });
        
        this.element.addEventListener('mouseleave', (e) => {
            this.clearTimers();
            this.lastMousePosition = { x: e.clientX, y: e.clientY };
            
            if (this.isOpen) {
                // 使用智能延迟关闭
                this.scheduleClose(e);
            }
        });
        
        // 全局鼠标移动监听（用于三角形安全区域）
        document.addEventListener('mousemove', (e) => {
            if (this.isOpen && this.closeTimer) {
                if (this.isInSafeTriangle(e.clientX, e.clientY)) {
                    // 在安全区域内，取消关闭
                    this.clearCloseTimer();
                } else if (!this.element.contains(e.target)) {
                    // 不在元素内且不在安全区域，继续关闭倒计时
                    if (!this.closeTimer) {
                        this.scheduleClose(e);
                    }
                }
            }
        });
        
        // 点击触发器事件
        this.trigger.addEventListener('mousedown', (e) => {
            this.isClicking = true;
        });
        
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            // 设置点击状态
            this.isClicking = true;
            
            // 清除所有定时器，确保立即响应点击
            this.clearTimers();
            
            // 执行切换
            this.toggle();
            
            // 短暂延迟后重置点击状态
            setTimeout(() => {
                this.isClicking = false;
            }, 100);
        });
        
        // 鼠标释放时重置点击状态
        this.trigger.addEventListener('mouseup', () => {
            setTimeout(() => {
                this.isClicking = false;
            }, 50);
        });
        
        // 选项点击事件 - 增强版，支持更好的事件检测
        this.menu.addEventListener('click', (e) => {
            // 寻找最近的dropdown-option元素（支持嵌套结构）
            let targetOption = e.target;
            while (targetOption && !targetOption.classList.contains('dropdown-option')) {
                if (targetOption === this.menu) break; // 防止向上搜索超出边界
                targetOption = targetOption.parentElement;
            }
            
            if (targetOption && targetOption.classList.contains('dropdown-option')) {
                e.preventDefault();
                e.stopPropagation();
                console.log('点击选项:', targetOption.textContent.trim(), 'value:', targetOption.dataset.value);
                this.selectOption(targetOption);
            }
        });
        
        // 增加mousedown事件作为备用，确保能捕获点击
        this.menu.addEventListener('mousedown', (e) => {
            let targetOption = e.target;
            while (targetOption && !targetOption.classList.contains('dropdown-option')) {
                if (targetOption === this.menu) break;
                targetOption = targetOption.parentElement;
            }
            
            if (targetOption && targetOption.classList.contains('dropdown-option')) {
                e.preventDefault();
                e.stopPropagation();
                console.log('mousedown事件捕获:', targetOption.textContent.trim(), 'value:', targetOption.dataset.value);
                
                // 特别检查第二个选项
                const allOptions = Array.from(this.menu.querySelectorAll('.dropdown-option'));
                const optionIndex = allOptions.indexOf(targetOption);
                if (optionIndex === 1) {
                    console.log('🔍 检测到第二个选项被点击，强制执行选择');
                    this.selectOption(targetOption);
                    return;
                }
                
                // 短暂延迟后执行选择，确保不与click事件冲突
                setTimeout(() => {
                    this.selectOption(targetOption);
                }, 50);
            }
        });
        
        // 点击外部关闭
        if (this.options.autoClose) {
            document.addEventListener('click', (e) => {
                if (!this.element.contains(e.target)) {
                    this.close();
                }
            });
        }
        
        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    clearTimers() {
        this.clearHoverTimer();
        this.clearCloseTimer();
    }
    
    clearHoverTimer() {
        if (this.hoverTimer) {
            clearTimeout(this.hoverTimer);
            this.hoverTimer = null;
        }
    }
    
    clearCloseTimer() {
        if (this.closeTimer) {
            clearTimeout(this.closeTimer);
            this.closeTimer = null;
        }
    }
    
    scheduleClose(event) {
        this.clearCloseTimer();
        this.closeTimer = setTimeout(() => {
            this.close();
        }, 300); // 300ms延迟关闭
    }
    
    // 增强的安全区域检测算法
    isInSafeTriangle(mouseX, mouseY) {
        if (!this.isOpen) return false;
        
        const triggerRect = this.trigger.getBoundingClientRect();
        const menuRect = this.menu.getBoundingClientRect();
        
        // 扩展安全区域边距
        const margin = 20;
        const expandedMenuRect = {
            left: menuRect.left - margin,
            right: menuRect.right + margin,
            top: menuRect.top - margin,
            bottom: menuRect.bottom + margin
        };
        
        // 1. 首先检查是否在扩展的矩形区域内
        if (mouseX >= expandedMenuRect.left && 
            mouseX <= expandedMenuRect.right && 
            mouseY >= expandedMenuRect.top && 
            mouseY <= expandedMenuRect.bottom) {
            return true;
        }
        
        // 2. 检查多个三角形安全区域
        const triggerCenterX = triggerRect.left + triggerRect.width / 2;
        const triggerCenterY = triggerRect.bottom;
        
        // 主三角形：触发器中心到菜单顶部两角
        const mainTriangle = this.isPointInTriangle(
            { x: mouseX, y: mouseY },
            { x: triggerCenterX, y: triggerCenterY },
            { x: menuRect.left - margin, y: menuRect.top },
            { x: menuRect.right + margin, y: menuRect.top }
        );
        
        // 侧边三角形：触发器两角到菜单对应边
        const leftTriangle = this.isPointInTriangle(
            { x: mouseX, y: mouseY },
            { x: triggerRect.left, y: triggerCenterY },
            { x: menuRect.left - margin, y: menuRect.top },
            { x: menuRect.left - margin, y: menuRect.bottom }
        );
        
        const rightTriangle = this.isPointInTriangle(
            { x: mouseX, y: mouseY },
            { x: triggerRect.right, y: triggerCenterY },
            { x: menuRect.right + margin, y: menuRect.top },
            { x: menuRect.right + margin, y: menuRect.bottom }
        );
        
        // 底部三角形：为高度很大的菜单提供底部安全区域
        const bottomTriangle = this.isPointInTriangle(
            { x: mouseX, y: mouseY },
            { x: triggerCenterX, y: triggerCenterY },
            { x: menuRect.left - margin, y: menuRect.bottom },
            { x: menuRect.right + margin, y: menuRect.bottom }
        );
        
        return mainTriangle || leftTriangle || rightTriangle || bottomTriangle;
    }
    
    // 判断点是否在三角形内（使用重心坐标法）
    isPointInTriangle(p, a, b, c) {
        const denom = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
        if (Math.abs(denom) < 0.000001) return false; // 防止除零
        
        const alpha = ((b.y - c.y) * (p.x - c.x) + (c.x - b.x) * (p.y - c.y)) / denom;
        const beta = ((c.y - a.y) * (p.x - c.x) + (a.x - c.x) * (p.y - c.y)) / denom;
        const gamma = 1 - alpha - beta;
        
        return alpha >= 0 && beta >= 0 && gamma >= 0;
    }
    
    open() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.element.classList.add('open');
        
        // 更新选中状态显示
        this.updateSelectedOption();
        
        // 触发打开事件
        this.element.dispatchEvent(new CustomEvent('dropdown:open', {
            detail: { dropdown: this }
        }));
    }
    
    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.element.classList.remove('open');
        this.clearTimers();
        
        // 触发关闭事件
        this.element.dispatchEvent(new CustomEvent('dropdown:close', {
            detail: { dropdown: this }
        }));
    }
    
    toggle() {
        // 立即清除所有定时器，避免鼠标悬停事件干扰
        this.clearTimers();
        
        if (this.isOpen) {
            console.log('下拉框收回:', this.element.id);
            this.close();
        } else {
            console.log('下拉框展开:', this.element.id);
            this.open();
        }
    }
    
    selectOption(optionElement) {
        const value = optionElement.dataset.value;
        const text = optionElement.textContent.trim();
        
        // 更新选中值
        this.selectedValue = value;
        
        // 更新标签显示
        this.label.textContent = text;
        
        // 更新选中状态
        this.updateSelectedOption();
        
        // 关闭菜单
        this.close();
        
        // 触发变化事件
        if (this.options.onChange) {
            this.options.onChange(value, text, this);
        }
        
        // 触发选择事件
        this.element.dispatchEvent(new CustomEvent('dropdown:select', {
            detail: { 
                value, 
                text, 
                dropdown: this 
            }
        }));
        
        // 兼容原有的change事件（模拟select的change事件）
        const changeEvent = new Event('change', { bubbles: true });
        this.element.dispatchEvent(changeEvent);
    }
    
    updateSelectedOption() {
        // 移除所有选中状态
        this.menu.querySelectorAll('.dropdown-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // 添加当前选中状态
        const selectedOption = this.menu.querySelector(`[data-value="${this.selectedValue}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
    }
    
    initializeSelectedValue() {
        // 检查HTML中是否有预选项（selected类）
        const preSelectedOption = this.menu.querySelector('.dropdown-option.selected');
        if (preSelectedOption) {
            this.selectedValue = preSelectedOption.dataset.value;
        } else {
            // 如果没有预选项，使用第一个选项
            const firstOption = this.menu.querySelector('.dropdown-option');
            if (firstOption) {
                this.selectedValue = firstOption.dataset.value;
            }
        }
    }
    
    updateLabel() {
        const selectedOption = this.menu.querySelector(`[data-value="${this.selectedValue}"]`);
        if (selectedOption) {
            this.label.textContent = selectedOption.textContent.trim();
        }
    }
    
    // 添加选项
    addOption(value, text, selected = false) {
        const option = document.createElement('div');
        option.className = 'dropdown-option';
        option.dataset.value = value;
        option.textContent = text;
        
        this.menu.appendChild(option);
        
        if (selected) {
            this.selectedValue = value;
            this.updateLabel();
            this.updateSelectedOption();
        }
    }
    
    // 清空选项
    clearOptions() {
        this.menu.innerHTML = '';
    }
    
    // 设置选项
    setOptions(options) {
        this.clearOptions();
        options.forEach(option => {
            this.addOption(option.value, option.text, option.selected);
        });
    }
    
    // 获取当前值
    getValue() {
        return this.selectedValue;
    }
    
    // 设置值
    setValue(value) {
        const option = this.menu.querySelector(`[data-value="${value}"]`);
        if (option) {
            this.selectOption(option);
        }
    }
    
    // 禁用/启用
    setDisabled(disabled) {
        if (disabled) {
            this.element.classList.add('disabled');
            this.trigger.style.pointerEvents = 'none';
            this.trigger.style.opacity = '0.5';
        } else {
            this.element.classList.remove('disabled');
            this.trigger.style.pointerEvents = '';
            this.trigger.style.opacity = '';
        }
    }
    
    // 销毁
    destroy() {
        this.clearTimers();
        this.element.removeEventListener('mouseenter', this.open);
        this.element.removeEventListener('mouseleave', this.close);
        this.trigger.removeEventListener('click', this.toggle);
        this.menu.removeEventListener('click', this.selectOption);
    }
}

// 全局下拉菜单管理器
window.DropdownManager = {
    dropdowns: new Map(),
    
    // 初始化下拉菜单
    init(selector, options = {}) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            const dropdown = new CustomDropdown(element, options);
            this.dropdowns.set(element.id, dropdown);
        });
    },
    
    // 获取下拉菜单实例
    get(id) {
        return this.dropdowns.get(id);
    },
    
    // 关闭所有下拉菜单
    closeAll() {
        this.dropdowns.forEach(dropdown => dropdown.close());
    },
    
    // 销毁所有下拉菜单
    destroyAll() {
        this.dropdowns.forEach(dropdown => dropdown.destroy());
        this.dropdowns.clear();
    }
};