// 学校信息系统
const schoolData = {
    'hitwh': {
        name: '哈尔滨工业大学（威海）',
        motto: '规格严格，功夫到家',
        website: 'https://www.hitwh.edu.cn',
        image: 'https://personl-website.oss-cn-shenzhen.aliyuncs.com/life-images-upload/schools/hit-weihai.jpg',
        imageSource: '哈尔滨工业大学威海 公众号',
        experience: `威海的海，常年托着云卷云舒。校园沿海而建，西门出去走不远就是金沙滩。北方小城没有喧嚣，四季分明，夏天不热，冬天蛮冷哈哈哈。冬天会下雪，白茫茫一片很漂亮。大三在校内与室友合租了一处校内的大房子，极大提升了就读体验。感觉这里生活很慢（也有可能是我大学不爱学习的缘故），安逸自然。
        

很多年前我们专业最早叫做"工业外贸"，后来改名"国际经济与贸易"，近两年又随着时代改变被取消，我们这一届成了倒数第二届，此后哈威再无国贸。其实很多同学毕业后也没有步入国际贸易，大多选择了继续升学。记得后来有一次面试，面试官问，"当初你选择这个专业的时候，有考虑到未来怎么找工作吗？"。所谓'时代变迁'，留给学生的，除了思考未来的自由，还有对变化的和解。

在哈工大威海，体会到的，是一种安静的舒适和自得其乐。最美好的，是曾在这里慢慢成长。`
    },
    'cuhk': {
        name: '香港中文大学（深圳）',
        motto: '博文约礼',
        website: 'https://www.cuhk.edu.cn',
        image: 'https://personl-website.oss-cn-shenzhen.aliyuncs.com/life-images-upload/schools/cuhk-shenzhen.png',
        imageSource: '香港中文大学深圳 公众号',
        experience: `深圳的风，比威海更温热。港中深校园宽敞明亮，基础设施极为齐全，健身房和游泳馆总有人挥洒汗水，图书馆、咖啡馆、自习空间层出不穷。校园绿化也做得很好，常常可见曲径通幽的小角落，湖水与绿植相映成趣。我白天很少在校园，入夜后却总会发现天猫超市里灯火通明，有人自习有人游戏，仿佛没有常规夜的概念，我也是夜猫子，很自然地就融入了进去。

硕士读金工，课程安排紧凑，却也灵活。学校和项目组都很支持学生去实习，也开设了很多职业发展相关的课程项目，学业和职场的界限被拉近，大家可以更多的在真实的工作中锤炼自己。

深圳的生活节奏明显加快，不似威海这座安逸舒适小城，大家都很忙碌，忙碌中焦虑，焦虑中成长。唯一让人比较难受的是实习通勤，深圳最发达的还是南山福田，倘若不租房，每日的通勤会非常非常消磨人的精气神了`
    }
};

// 打开学校信息弹窗
function openSchoolModal(schoolId) {
    const school = schoolData[schoolId];
    if (!school) {
        console.error('未找到学校信息:', schoolId);
        return;
    }

    // 填充弹窗内容
    document.getElementById('schoolModalImage').src = school.image;
    document.getElementById('schoolImageSource').textContent = `图片来源：${school.imageSource}`;
    document.getElementById('schoolMotto').textContent = school.motto;
    document.getElementById('schoolExperience').innerHTML = school.experience.replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>');
    document.getElementById('schoolWebsite').href = school.website;
    document.getElementById('schoolWebsite').textContent = `访问${school.name}官网`;

    // 显示弹窗
    const modal = document.getElementById('schoolModal');
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
    
    // 添加淡入效果
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// 关闭学校信息弹窗
function closeSchoolModal() {
    const modal = document.getElementById('schoolModal');
    modal.classList.remove('active');
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }, 300);
}

// 初始化学校信息功能
function initSchoolModal() {
    // 关闭按钮事件
    const closeBtn = document.getElementById('schoolModalClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSchoolModal);
    }

    // 点击弹窗外部关闭
    const modal = document.getElementById('schoolModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeSchoolModal();
            }
        });
    }

    // ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.getElementById('schoolModal').classList.contains('active')) {
            closeSchoolModal();
        }
    });

    // 为education-item添加hover效果
    const educationItems = document.querySelectorAll('.education-item.clickable');
    educationItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
        
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initSchoolModal();
});