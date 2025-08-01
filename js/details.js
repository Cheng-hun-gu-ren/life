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
            meta: ['已看完', '希望世界和平', '没有战乱'],
            thoughts: '已经看完过一遍了，"为你，千千万万遍"。每次想起这句话，心里总是会涌起一阵暖流，又或者是某种说不清的酸楚。阿米尔和哈桑的故事，让我想起那些年少时光里，我们曾经伤害过的人，曾经错过的道歉机会。\n\n或许每个人心中都有一只风筝，代表着那些我们想要挽回却再也无法触及的美好。战乱中的阿富汗，让这个故事更添了几分沉重。希望世界和平，希望每个孩子都能在蓝天下自由地奔跑，追逐属于他们的风筝，而不是在硝烟中失去童年的色彩。'
        },
        2: {
            title: '亲密关系',
            detailImage: '../../images/details/亲密关系.png',
            meta: ['大众心理学经典', '科学严谨', '做过很多批注'],
            thoughts: '大众心理学经典读物，这本书的科学严谨令我惊叹。我很喜欢彭凯平的序，鼓励读者理解和适应学术表达方式，用科学视角理解和处理亲密关系。\n\n这本书对我影响很大，之前读的纸质书，做过很多批注。那些密密麻麻的笔记，记录着我在阅读过程中的顿悟时刻。后来也从应用层面在幕布上，整理了一下我的读书心得，那些理论在现实生活中真的很有用。\n\n科学地理解爱情，或许听起来有些冰冷，但实际上，当我们用更理性的方式去审视感情时，反而能够更好地珍惜和经营那些珍贵的关系。链接：https://www.mubu.com/doc/2dC5hp43Aks'
        },
        3: {
            title: '怦然心动的人生整理魔法',
            detailImage: '../../images/details/怦然心动的人生整理魔法.png',
            meta: ['与物品交流', '真正的人生', '始于整理之后'],
            thoughts: '"礼物是心意，在收到的那一刻便已完成它的使命。此后再拿起，如果没有怦然心动的感觉，那就感谢它曾带来的快乐，然后说再见"。这句话第一次读到时，心里涌起一种莫名的感动，仿佛找到了与物品和解的方式。\n\n"真正的人生始于整理之后"。这本书教会我如何与物品交流，如何倾听内心真实的声音。每一次整理，都像是在进行一场内心的对话，问自己什么是真正重要的，什么是可以放下的。那些曾经以为重要的东西，或许只是我们对过去的执念罢了。\n\n学会告别，也是一种成长。'
        },
        4: {
            title: '平凡的世界',
            detailImage: '../../images/details/平凡的世界.png',
            meta: ['高中寒假', '指定读物', '史诗级长篇'],
            thoughts: '高中寒假指定读物之一。史诗级长篇小说，给当时的自己带来不小的触动。\n\n那个寒假，窝在家里的暖气房里，一页一页地翻着这本厚重的书。窗外雪花纷飞，屋内灯火温暖，我跟着孙少平一起经历着生活的苦与甜。高中的自己，对未来充满憧憬却又忐忑不安，在孙少平身上，我看到了一种坚韧的力量。\n\n平凡的世界里，每个人都在为自己的生活而努力奋斗着。那种朴实而深刻的感动，至今还能在心底泛起涟漪。或许这就是文学的力量吧，能够跨越时空，与我们的心灵产生共鸣。'
        }
    },
    movies: {
        1: {
            title: '哈尔的移动城堡',
            detailImage: '../../images/details/哈尔的移动城堡.png',
            meta: ['大学好友推荐', '宫崎骏的魔力', '好喜欢苏菲'],
            thoughts: '大学时一个好朋友推荐的。宫崎骏的电影真的很有魔力。好喜欢苏菲哈哈哈。\n\n记得那个下午，室友说"你一定要看看这部电影"，然后我们就窝在宿舍里，抱着零食看完了整部电影。苏菲从一个怯生生的女孩变成勇敢的女性，那种成长的力量让人着迷。还有哈尔，看似浮夸却内心纯真。\n\n最喜欢的是那座会飞的城堡，载着所有人的梦想在云端漫游。每次看到这个画面，心里就会涌起一种说不出的温暖，仿佛自己也拥有了一座移动的城堡，可以带我去任何想去的地方。'
        },
        2: {
            title: '土拨鼠之日',
            detailImage: '../../images/details/土拨鼠之日.png',
            meta: ['无限轮回流', '开山鼻祖', '真正宝贵的东西'],
            thoughts: '无限轮回流的开山鼻祖级别的电影。但不同于这类电影通用的悬疑烧脑，这部电影更多的是讲述男主的改变。如果此后余生，我只会无限去重复某一天，那么我会去做什么呢？\n\n所有的刺激都已经追求过了，剩下的是什么，生活的意义又在哪里呢？Phil从最初的绝望、放纵，到后来学会关爱他人，学会让自己变得更好。那种从内而外的改变，让我思考什么才是真正重要的。\n\n真正宝贵的东西、值得珍惜与爱的人往往要用心才能发现。或许我们每个人都活在某种"轮回"里，重要的不是外在环境的变化，而是内心的成长和对生活的态度。'
        },
        3: {
            title: '白日梦想家',
            detailImage: '../../images/details/白日梦想家.png',
            meta: ['大一舍友推荐', '激励我前行', '也喜欢白日做梦'],
            thoughts: '大一时舍友推荐看的电影，非常喜欢，激励我前行。最近看《长安的荔枝》，突然感觉《白日梦想家》的男主和李善德在某种程度还蛮像的，都是小人物去完成一个看似不可能的任务，其中经历的种种奇妙的故事。\n\nWalter从一个只会幻想的上班族，到真正踏上冒险的旅程，那种勇气让我佩服。我也喜欢白日做梦，在脑海里构建各种可能的未来，想象着自己去到世界的各个角落。就算是黄粱一梦又如何哈哈哈。\n\n梦想不是用来嘲笑的，而是用来实现的。这部电影告诉我，真正的生活不在想象里，而在脚下的每一步路上。'
        },
        4: {
            title: '蝴蝶效应',
            detailImage: '../../images/details/蝴蝶效应.png',
            meta: ['轮回流经典', '未选择的路', '珍惜当前'],
            thoughts: '轮回流经典，罗伯特有一首诗，《未选择的路》。我们总会去美化曾经没有选择的那条路，但是实际上这可能只是我们对现实不满的一厢情愿的幻想罢了。\n\nEvan一次次地回到过去，想要修正那些遗憾，却发现每一次改变都会带来新的痛苦。爱情、亲情、友情、个人发展，如何权衡如何选择？这个问题没有标准答案。生活不是处处完美，有所收获就必然有所放弃。\n\n这部电影让我明白，与其沉溺于对过去的懊悔和对未选择道路的幻想，不如好好珍惜当前，不要活在过去里。毕竟，我们永远不知道那些"如果"的背后，会是怎样的结局。'
        }
    },
    music: {
        1: {
            title: 'Stay Alive',
            detailImage: '../../images/details/Stay Alive.png',
            meta: ['爱听', '看完白日梦想家后', '加入收藏歌单'],
            thoughts: '爱听，看完《白日梦想家》后就加入了我的收藏歌单。每次听到José González温柔的嗓音，心里就会涌起一种莫名的力量。\n\n"Stay alive, stay alive for me"，简单的歌词却有着直击心灵的魔力。那种温暖而坚定的声音，像是在黑暗中点亮的一盏灯，提醒我要勇敢地活着，要为了那些在乎的人而好好生活。\n\n每当迷茫的时候听这首歌，总能找回那种对生活的热爱。简单的吉他伴奏，却承载着如此深刻的情感，这或许就是音乐的魅力吧。'
        },
        2: {
            title: 'リセット（Reset）',
            detailImage: '../../images/details/リセット.png',
            meta: ['训练时经常听', '步伐跟着节奏', '四分配速马上有'],
            thoughts: '"你也喜欢跑步吗？"。训练时经常听，步伐跟着节奏走，四分配速马上有。\n\n每次戴上耳机，听到这首歌响起，脚步就会不自觉地跟上那个节拍。向井太一的声音有种独特的治愈感，配上轻快的旋律，跑步的疲惫感仿佛都减轻了不少。\n\n"Reset"这个词对我来说特别有意义。每一次跑步，都像是给自己按下重置键，把那些烦恼和压力都甩在身后。汗水挥洒的过程，也是内心净化的过程。这首歌见证了我很多个挥汗如雨的训练日，也陪伴我跑过了无数个黄昏。'
        },
        3: {
            title: '音乐爱我',
            detailImage: '../../images/details/音乐爱我.png',
            meta: ['深夜爱听', '喜欢听音乐', '音乐有生命'],
            thoughts: '深夜爱听，喜欢听音乐。常石磊老师的这首歌简直就是我内心的写照。\n\n"音乐爱我，我也爱音乐"，这句歌词质朴却深情，每次听到都会让我会心一笑。深夜的时候，戴上耳机，让这首歌在安静的房间里轻柔地流淌，那种被音乐包围的感觉真的很治愈。\n\n音乐确实是有生命的，它能够治愈人心，能够表达那些言语无法述说的情感。有时候一整天的疲惫，在音乐响起的那一刻就烟消云散了。常石磊温暖的嗓音，像是在跟我进行一场关于音乐的深夜对话。'
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