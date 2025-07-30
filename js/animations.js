// 动画控制模块

// 首页动画初始化
function initLandingAnimations() {
    // 添加页面加载动画
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.8s ease';
        document.body.style.opacity = '1';
        
        // 依次显示元素
        animateElementsSequentially();
    }, 100);
}

// 依次显示首页元素
function animateElementsSequentially() {
    const elements = [
        '.avatar-container',
        '.name',
        '.intro',
        '.welcome',
        '.enter-btn'
    ];
    
    elements.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, (index + 1) * 200);
        }
    });
}

// 滚动触发动画
function initScrollAnimations() {
    if (!window.IntersectionObserver) {
        // 不支持IntersectionObserver的浏览器
        return;
    }
    
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.dataset.animation || 'fadeInUp';
                
                // 添加动画类
                element.classList.add('animate-in');
                
                // 根据不同类型添加不同动画
                switch (animationType) {
                    case 'fadeInLeft':
                        element.classList.add('animate-left');
                        break;
                    case 'fadeInRight':
                        element.classList.add('animate-right');
                        break;
                    case 'scaleIn':
                        element.classList.add('animate-scale');
                        break;
                    case 'bounceIn':
                        element.classList.add('animate-bounce');
                        break;
                    case 'rotateIn':
                        element.classList.add('animate-rotate');
                        break;
                    default:
                        element.classList.add('animate-in');
                }
                
                // 停止观察已动画的元素
                animateOnScroll.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // 观察所有需要动画的元素
    const elementsToAnimate = document.querySelectorAll(`
        .section,
        .book-card,
        .movie-card,
        .music-card,
        .interest-item,
        .stat-card,
        .race-card,
        .training-card,
        .playlist-card
    `);
    
    elementsToAnimate.forEach(el => {
        animateOnScroll.observe(el);
    });
}

// 页面切换动画
function fadeTransition(fromElement, toElement, duration = 300) {
    if (!fromElement || !toElement) return;
    
    fromElement.style.transition = `opacity ${duration}ms ease`;
    fromElement.style.opacity = '0';
    
    setTimeout(() => {
        fromElement.style.display = 'none';
        toElement.style.display = 'block';
        toElement.style.opacity = '0';
        toElement.style.transition = `opacity ${duration}ms ease`;
        
        // 强制重排
        toElement.offsetHeight;
        
        toElement.style.opacity = '1';
    }, duration);
}

// 卡片悬停效果
function initCardHoverEffects() {
    const cards = document.querySelectorAll(`
        .book-card,
        .movie-card,
        .music-card,
        .interest-item,
        .stat-card,
        .race-card,
        .training-card,
        .playlist-card
    `);
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', handleCardHover);
        card.addEventListener('mouseleave', handleCardLeave);
    });
}

function handleCardHover(e) {
    const card = e.currentTarget;
    
    if (!card.classList.contains('hover-lift')) {
        card.classList.add('hover-lift');
    }
    
    // 添加特殊效果
    card.style.transform = 'translateY(-4px) scale(1.02)';
    card.style.boxShadow = 'var(--shadow-lg)';
    card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
}

function handleCardLeave(e) {
    const card = e.currentTarget;
    
    card.style.transform = 'translateY(0) scale(1)';
    card.style.boxShadow = 'var(--shadow-md)';
}

// 按钮点击动画
function initButtonAnimations() {
    const buttons = document.querySelectorAll(`
        .enter-btn,
        .tab-btn,
        .mood-filter,
        .link-btn
    `);
    
    buttons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });
}

function handleButtonClick(e) {
    const button = e.currentTarget;
    
    // 创建波纹效果
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    // 移除波纹元素
    setTimeout(() => {
        ripple.remove();
    }, 600);
    
    // 按钮缩放效果
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

// 专辑封面旋转效果
function initAlbumRotation() {
    const albumCovers = document.querySelectorAll('.album-cover');
    
    albumCovers.forEach(cover => {
        cover.addEventListener('mouseenter', () => {
            cover.style.transform = 'rotate(5deg) scale(1.05)';
            cover.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        cover.addEventListener('mouseleave', () => {
            cover.style.transform = 'rotate(0deg) scale(1)';
        });
    });
}

// 进度条动画
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                
                progressBar.style.width = '0%';
                progressBar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 100);
                
                progressObserver.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
}

// 数字计数动画
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = counter.textContent;
                const isNumber = !isNaN(parseFloat(target));
                
                if (isNumber) {
                    const targetNum = parseFloat(target);
                    animateNumber(counter, 0, targetNum, 1500);
                }
                
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// 数字动画函数
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const isTime = typeof end === 'string' && end.includes(':');
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        if (isTime) {
            // 处理时间格式
            element.textContent = end;
        } else {
            const current = start + (end - start) * easeOutCubic(progress);
            element.textContent = Math.floor(current);
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = end;
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// 缓动函数
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// 视差滚动效果
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length === 0) return;
    
    const handleScroll = throttle(() => {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }, 16); // ~60fps
    
    window.addEventListener('scroll', handleScroll);
}

// 导航栏滚动效果
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    const handleScroll = throttle(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 向下滚动，隐藏导航栏
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动，显示导航栏
            navbar.style.transform = 'translateY(0)';
        }
        
        // 添加阴影效果
        if (scrollTop > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, 16);
    
    window.addEventListener('scroll', handleScroll);
}

// 打字机效果
function typewriterEffect(element, text, speed = 100) {
    if (!element) return;
    
    element.textContent = '';
    let i = 0;
    
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

// 粒子效果（简单版）
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    
    document.body.appendChild(particlesContainer);
    
    for (let i = 0; i < 20; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: var(--color-primary);
        border-radius: 50%;
        opacity: 0.6;
        animation: float ${5 + Math.random() * 5}s ease-in-out infinite;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 2}s;
    `;
    
    container.appendChild(particle);
}

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
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

// 检查是否支持动画
function supportsAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    return !prefersReducedMotion.matches;
}

// 初始化所有动画
function initAllAnimations() {
    if (!supportsAnimations()) {
        console.log('用户偏好减少动画，跳过动画初始化');
        return;
    }
    
    // 延迟初始化，确保DOM完全加载
    setTimeout(() => {
        initScrollAnimations();
        initCardHoverEffects();
        initButtonAnimations();
        initAlbumRotation();
        animateProgressBars();
        animateCounters();
        initParallaxEffects();
        initNavbarScroll();
    }, 100);
}

// 页面加载完成后初始化动画
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllAnimations);
} else {
    initAllAnimations();
}

// 导出函数
window.initLandingAnimations = initLandingAnimations;
window.initScrollAnimations = initScrollAnimations;
window.fadeTransition = fadeTransition;
window.typewriterEffect = typewriterEffect;