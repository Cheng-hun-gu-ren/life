// 二维码弹窗功能
const qrCodeData = {
    'wechat': {
        image: 'images/qrcodes/wechat-qr.jpg',
        alt: '微信二维码'
    },
    'wechat-official': {
        image: 'images/qrcodes/wechat-official-qr.jpg',
        alt: '公众号二维码'
    }
};

// 显示二维码弹窗
function showQRCode(type) {
    const qrData = qrCodeData[type];
    if (!qrData) {
        console.error('未找到二维码数据:', type);
        return;
    }

    // 设置图片
    const qrImage = document.getElementById('qrImage');
    qrImage.src = qrData.image;
    qrImage.alt = qrData.alt;

    // 显示弹窗
    const modal = document.getElementById('qrModal');
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
    
    // 添加淡入效果
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// 关闭二维码弹窗
function closeQRModal() {
    const modal = document.getElementById('qrModal');
    modal.classList.remove('active');
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }, 300);
}

// 初始化二维码功能
function initQRCodeModal() {
    // 关闭按钮事件
    const closeBtn = document.getElementById('qrModalClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeQRModal);
    }

    // 点击弹窗外部关闭
    const modal = document.getElementById('qrModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeQRModal();
            }
        });
    }

    // ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.getElementById('qrModal').classList.contains('active')) {
            closeQRModal();
        }
    });

    // 为联系方式项添加hover效果
    const contactItems = document.querySelectorAll('.contact-item.clickable');
    contactItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.style.transition = 'color 0.2s ease, transform 0.2s ease';
        
        item.addEventListener('mouseenter', function() {
            this.style.color = 'var(--accent-color)';
            this.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.color = '';
            this.style.transform = 'translateX(0)';
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initQRCodeModal();
});