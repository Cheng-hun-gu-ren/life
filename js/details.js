// 详情弹窗功能
class DetailModal {
    constructor() {
        this.modal = document.getElementById('detailModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalDetailImage = document.getElementById('modalDetailImage');
        this.modalMeta = document.getElementById('modalMeta');
        this.modalThoughts = document.getElementById('modalThoughts');
        this.modalClose = document.getElementById('modalClose');
        
        this.initEvents();
    }
    
    initEvents() {
        // 关闭弹窗事件
        this.modalClose?.addEventListener('click', () => this.close());
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
        
        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                this.close();
            }
        });
    }
    
    open(data) {
        if (!this.modal) return;
        
        // 填充数据
        this.modalTitle.textContent = data.title;
        this.modalDetailImage.src = data.detailImage;
        this.modalThoughts.textContent = data.thoughts;
        
        // 填充元信息
        this.modalMeta.innerHTML = '';
        if (data.meta && data.meta.length > 0) {
            data.meta.forEach(item => {
                const metaItem = document.createElement('span');
                metaItem.className = 'meta-item';
                metaItem.textContent = item;
                this.modalMeta.appendChild(metaItem);
            });
        }
        
        // 显示弹窗
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // 重置动画
        this.resetAnimations();
    }
    
    close() {
        if (!this.modal) return;
        
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    resetAnimations() {
        // 重新触发CSS动画
        const animatedElements = this.modal.querySelectorAll('.modal-detail-image, .modal-title, .modal-meta, .modal-thoughts');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // 触发重排
            el.style.animation = null;
        });
    }
}

// 详情数据配置
const detailsData = {
    books: {
        1: {
            title: '追风筝的人',
            detailImage: '../../images/details/追风筝的人.png',
            meta: ['卡勒德·胡赛尼', '2003年', '小说'],
            thoughts: '这本书让我深深震撼。阿米尔和哈桑的故事不仅仅是关于友谊和背叛，更是关于救赎和成长。书中描述的阿富汗风土人情让我仿佛置身其中，而"为你，千千万万遍"这句话至今还深深印在我心里。每个人心中都有那只需要追逐的风筝，代表着我们内心深处的愧疚、遗憾，以及对美好的渴望。这本书教会我，勇敢面对过去的错误，才能真正获得内心的平静。'
        },
        2: {
            title: '亲密关系',
            detailImage: '../../images/details/亲密关系.png',
            meta: ['克里斯多福·孟', '心理学', '2017年'],
            thoughts: '这本书彻底改变了我对人际关系的理解。作者深入浅出地解释了我们在关系中的各种行为模式，让我意识到很多冲突其实来自于内心的恐惧和不安全感。书中提到的"镜子法则"让我学会了从关系中的问题中反观自己，而不是一味地指责对方。这对我处理与家人、朋友的关系都有很大帮助。学会爱自己，才能真正地爱别人，这或许是这本书给我最大的启发。'
        },
        3: {
            title: '怦然心动的人生整理魔法',
            detailImage: '../../images/details/怦然心动的人生整理魔法.png',
            meta: ['近藤麻理惠', '生活方式', '2011年'],
            thoughts: '最初以为这只是一本整理收纳的工具书，读完后发现它更像是一本人生哲学书。"只留下让你怦然心动的物品"这个理念不仅适用于整理房间，更适用于整理人生。通过断舍离，我学会了专注于真正重要的事物，无论是物品还是人际关系。整理的过程也是自我反思的过程，让我更清楚地知道自己真正想要什么。现在的我，生活空间更简洁，心境也更加清晰和平静。'
        },
        4: {
            title: '平凡的世界',
            detailImage: '../../images/details/平凡的世界.png',
            meta: ['路遥', '1986年', '长篇小说'],
            thoughts: '路遥老师用朴实无华的文字，为我们展现了一个波澜壮阔的时代。孙少平的坚韧不拔，孙少安的勤劳智慧，都深深感动着我。这本书让我明白，平凡并不意味着平庸，每个人都可以在自己的人生道路上闪闪发光。特别是孙少平对知识的渴望和对美好生活的追求，让我想到了自己的求学路。无论身处何种环境，都要保持内心的高贵和对未来的希望。'
        }
    },
    movies: {
        1: {
            title: '哈尔的移动城堡',
            detailImage: '../../images/details/哈尔的移动城堡.png',
            meta: ['宫崎骏', '2004年', '动画/奇幻'],
            thoughts: '宫崎骏老爷子的作品总是能治愈人心。Sophie从一个自卑的女孩变成勇敢坚强的女性，这个成长过程让我看到了内在美的力量。哈尔虽然看似自恋虚荣，但内心却有着纯真和善良。电影中的反战主题也让我深思。最触动我的是，当Sophie真正爱上哈尔时，她身上的魔法就消失了，这告诉我们爱情的力量能够打破一切诅咒。城堡在天空中飞翔的画面美得令人窒息，就像我们每个人心中都有一座属于自己的移动城堡。'
        },
        2: {
            title: '土拨鼠之日',
            detailImage: '../../images/details/土拨鼠之日.png',
            meta: ['哈罗德·雷米斯', '1993年', '喜剧/奇幻'],
            thoughts: '这部电影用一个看似荒诞的设定探讨了深刻的人生哲学。Phil被困在同一天里无数次重复，从最初的绝望到后来的自我提升，这个过程让我思考：如果每一天都是重复的，我们应该如何度过？电影告诉我们，真正的快乐不是来自于外在的变化，而是来自于内心的成长和对他人的关爱。Phil学会弹钢琴、学会冰雕、帮助别人，最终赢得了Rita的心，也找到了生命的意义。这让我明白，每一天都是新的开始，关键在于我们以什么样的态度去面对。'
        },
        3: 
        {
            title: '白日梦想家',
            detailImage: '../../images/details/白日梦想家.png',
            meta: ['本·斯蒂勒', '2013年', '剧情/冒险'],
            thoughts: '这部电影深深触动了我。Walter Mitty从一个只会做白日梦的普通上班族，到勇敢踏出舒适圈去追寻真实的自己，这个转变过程让我反思自己的生活。电影中那些壮美的风景和José González的音乐完美融合，每一帧都像是在诉说着"Life is about courage and going into the unknown"。它让我明白，真正的生活不是在想象中度过，而是要勇敢地去体验、去冒险、去追求内心真正渴望的东西。这部电影激励我要活出真实的自己。'
        },
        4: {
            title: '蝴蝶效应',
            detailImage: '../../images/details/蝴蝶效应.png',
            meta: ['埃里克·布雷斯', '2004年', '科幻/惊悚'],
            thoughts: '这部电影让我对因果关系有了全新的认识。Evan试图通过改变过去来拯救心爱的人，却发现每一次改变都会带来意想不到的后果。这让我深刻理解了"蝴蝶效应"的含义——微小的改变可能导致巨大的结果。电影探讨的宿命论vs自由意志的主题让我思考了很久。最终Evan选择牺牲自己来成全大家的幸福，这种无私的爱让人动容。它提醒我要珍惜当下的每一个选择，因为我们永远不知道这些选择会带来什么样的未来。同时也要学会接受生活的不完美。'
        }
    },
    music: {
        1: {
            title: 'Stay Alive',
            detailImage: '../../images/details/Stay Alive.png',
            meta: ['José González', '2013年', '《白日梦想家》OST'],
            thoughts: '这首歌第一次听到是在《白日梦想家》电影中，José González温柔的嗓音配上简单的吉他旋律，却有着直击心灵的力量。歌词"Stay alive, stay alive for me"如此简单却如此有力，它鼓励着Walter去追寻真实的自己，也鼓励着我要勇敢地活着、真实地活着。每当我迷茫或者想要逃避现实的时候，这首歌总能给我力量，提醒我要积极面对生活，要为了那些爱我的人和我爱的人而坚强地活下去。简约的编曲背后蕴含着深刻的人生哲理。'
        },
        2: {
            title: 'リセット（Reset）',
            detailImage: '../../images/details/リセット.png',
            meta: ['向井太一', '2018年', '《强风吹拂》ED'],
            thoughts: '作为《强风吹拂》的片尾曲，这首歌完美诠释了"重新开始"的含义。向井太一独特的嗓音温暖治愈，旋律轻快却不失深度。每次听这首歌，我都会想起动画中那些为了梦想而努力奔跑的少年们。"Reset"这个词对我来说有特殊的意义，它提醒我无论过去经历了什么挫折或失败，都可以选择重新开始。人生没有标准答案，重要的是要有重新出发的勇气。这首歌陪伴我度过了很多迷茫的时刻，给了我重新振作的力量。'
        },
        3: {
            title: '音乐爱我',
            detailImage: '../../images/details/音乐爱我.png',
            meta: ['常石磊', '2019年', '流行/唱作人'],
            thoughts: '常石磊老师的这首歌简直就是我内心的写照。作为一个深爱音乐的人，我完全能理解歌词中表达的那种纯粹的热爱。"音乐爱我，我也爱音乐"这句歌词质朴却深情，道出了音乐人内心最真实的声音。常石磊独特而温暖的嗓音让这首歌充满了治愈的力量，每个音符都像是在倾诉对音乐的深情。音乐确实是有生命的，它能治愈人心，能表达言语无法述说的情感。这首歌让我更加坚定了对音乐的热爱，也让我明白艺术创作的初心就是那份最纯真的热爱。'
        }
    }
};

// 初始化详情弹窗功能
function initDetailModal() {
    const modal = new DetailModal();
    
    // 为所有可点击的封面添加事件监听
    document.addEventListener('click', (e) => {
        const bookCover = e.target.closest('.book-cover');
        const moviePoster = e.target.closest('.movie-poster');
        const albumCover = e.target.closest('.album-cover');
        
        if (bookCover) {
            const bookCard = bookCover.closest('.book-card');
            const bookId = bookCard?.dataset.id;
            if (bookId && detailsData.books[bookId]) {
                modal.open(detailsData.books[bookId]);
            }
        } else if (moviePoster) {
            const movieCard = moviePoster.closest('.movie-card');
            const movieId = movieCard?.dataset.id;
            if (movieId && detailsData.movies[movieId]) {
                modal.open(detailsData.movies[movieId]);
            }
        } else if (albumCover) {
            const musicCard = albumCover.closest('.music-card');
            const musicId = musicCard?.dataset.id;
            if (musicId && detailsData.music[musicId]) {
                modal.open(detailsData.music[musicId]);
            }
        }
    });
}

// 如果是在浏览器环境中，自动初始化
if (typeof window !== 'undefined') {
    // 等待DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDetailModal);
    } else {
        initDetailModal();
    }
}