# 晨昏故人的个人生活主页

一个可爱卡通风格的个人生活主页，用于展示个人兴趣爱好、最近动态和社交互动。

## 🎯 项目目标

帮助拓展社交圈，认识更多的朋友。通过展示个人的阅读、电影、音乐和运动爱好，让访问者更好地了解我。

## 🌟 项目特色

- **可爱卡通设计**: 清新的配色和圆润的设计元素
- **动态内容更新**: 定期更新书籍、电影、音乐等内容
- **响应式设计**: 适配桌面、平板和手机设备
- **纯前端实现**: 无需后端，适合静态部署
- **易于维护**: JSON数据驱动，更新简单

## 🎨 设计风格

- **主色调**: 薄荷绿 (#4ECDC4)、天空蓝 (#45B7D1)、温暖橙 (#FFA07A)
- **背景色**: 极浅薄荷色 (#F8FFFE)、纯白 (#FFFFFF)
- **字体**: Nunito - 圆润友好的字体
- **图标**: 手绘卡通风格

## 📁 项目结构

```
life-homepage/
├── index.html              # 首页引导页
├── main.html               # 主页面（导航入口）
├── CNAME                   # 域名配置文件
├── CONTACT_SETUP.md        # 联系功能设置说明
├── css/                    # 样式文件
│   ├── style.css           # 主样式
│   ├── responsive.css      # 响应式样式
│   ├── animations.css      # 动画效果
│   └── README.md          # CSS说明文档
├── js/                     # JavaScript文件
│   ├── main.js            # 主要逻辑
│   ├── animations.js      # 动画控制
│   ├── music.js           # 音乐交互
│   ├── background.js      # 背景效果
│   ├── contact.js         # 联系功能
│   ├── details.js         # 详情弹窗
│   └── README.md          # JS说明文档
├── pages/                  # 子页面目录
│   ├── about/             # 个人简介页面
│   │   └── index.html
│   ├── interests/         # 兴趣爱好页面
│   │   └── index.html
│   ├── journey/           # 人生旅程页面
│   │   └── index.html
│   └── contact/           # 联系方式页面
│       └── index.html
├── data/                   # 数据文件
│   ├── books.json         # 书籍数据
│   ├── movies.json        # 电影数据
│   ├── music.json         # 音乐数据
│   ├── marathon.json      # 马拉松数据
│   └── README.md          # 数据说明文档
├── images/                 # 图片素材
│   ├── backgrounds/       # 背景图片
│   ├── books/             # 书籍封面
│   ├── movies/            # 电影海报
│   ├── music/             # 专辑封面
│   ├── marathon/          # 马拉松相关图片
│   ├── icons/             # 自定义图标
│   ├── details/           # 详情展示图片
│   └── README.md          # 图片说明文档
└── README.md              # 项目说明文档
```

## 🚀 快速开始

### 1. 准备素材

- 按照 `images/` 目录下各子目录的README说明准备图片素材
- 根据设计建议制作自定义图标

### 2. 更新数据

- 编辑 `data/` 目录下的JSON文件
- 添加个人的书籍、电影、音乐和马拉松数据

### 3. 本地预览

```bash
# 使用简单的HTTP服务器
python -m http.server 8001

#本地浏览器预览
http://localhost:8001/index.html
http://localhost:8001/main.html


# 或者使用Node.js
npx serve .
```

### 4. 部署

- 推荐使用GitHub Pages部署
- 也可以部署到任何静态网站托管服务

## 📊 页面功能

### 首页 (index.html)

- 全屏引导页面
- 个人头像和基本信息展示
- "ENTER"按钮进入主页

### 主页 (main.html)

- **导航中心**: 包含四个主要版块的导航卡片
- **个人信息卡片**: 展示基本信息和联系方式
- **关联主页链接**: 学术主页和求职主页

### 子页面系统

#### 个人简介 (pages/about/)
- 成长经历和教育背景
- 性格特点和个人理念
- 技能专长展示

#### 兴趣爱好 (pages/interests/)
- **最近在看**: 书籍和电影分享
- **最近在听**: 音乐推荐和心情标签
- **详情弹窗**: 点击查看详细介绍
- **留言板功能**: 访客互动交流

#### 人生旅程 (pages/journey/)
- **马拉松之路**: 跑步成就和训练记录
- **证书展示**: 比赛证书和纪念品
- **路线风景**: 跑步路线的美景分享

#### 联系方式 (pages/contact/)
- 多种联系方式展示
- 社交媒体链接
- 在线留言功能

## 🎵 特色功能

### 详情弹窗系统
- **内容展示**: 书籍、电影、音乐的详细信息
- **背景毛玻璃**: 优雅的视觉效果
- **响应式设计**: 适配各种屏幕尺寸
- **交互动画**: 平滑的打开/关闭效果

### 音乐交互功能
- **专辑封面**: 旋转和悬停效果
- **心情标签**: 筛选不同情绪的音乐
- **推荐理由**: 个人感悟和推荐语
- **播放列表**: 音乐集合展示

### 留言板系统
- **访客留言**: 支持匿名留言功能
- **实时展示**: 动态更新留言内容
- **互动交流**: 促进访客参与

### 背景效果系统
- **渐变背景**: 柔和的色彩过渡
- **动态效果**: 背景颜色动画
- **页面适配**: 不同页面的主题背景

### 响应式设计
- **桌面端**: 左右分栏布局，完整功能展示
- **平板端**: 上下堆叠布局，保持功能完整性
- **手机端**: 单列布局 + 移动端优化

## 🔄 内容更新

### 快速添加新记录指南

本框架支持轻松添加新的书籍、电影、音乐和马拉松记录。每种类型的记录需要3个步骤：

#### 📚 添加新书籍

**步骤1：准备图片素材**
```
images/books/book-X.jpg          # 封面图 (建议尺寸: 200x267px)
images/details/书名.png          # 详情展示图 (建议尺寸: 600x400px)
```

**步骤2：编辑 `data/books.json`**
```json
{
  "id": 5,                       # 新的唯一ID
  "title": "书名",
  "author": "作者",
  "finishDate": "2024-02-01",    # 完成日期
  "review": "读后感...",         # 简短评价
  "rating": 4.5,                 # 评分 (1-5)
  "cover": "images/books/book-5.jpg",
  "status": "finished",          # reading/finished
  "genre": "文学小说",
  "pages": 300
}
```

**步骤3：添加详情弹窗数据到 `js/details.js`**
```javascript
5: {
    title: '书名',
    detailImage: '../../images/details/书名.png',
    meta: ['个性化标签1', '个性化标签2', '个性化标签3'],
    thoughts: '散文风格的个人感悟和回忆...'
}
```

#### 🎬 添加新电影

**步骤1：准备图片素材**
```
images/movies/movie-X.jpg        # 海报图
images/details/电影名.png        # 详情展示图
```

**步骤2：编辑 `data/movies.json`**
```json
{
  "id": 5,
  "title": "电影名",
  "originalTitle": "Original Title",
  "director": "导演",
  "year": 2024,
  "genre": ["剧情", "冒险"],
  "rating": 4.5,
  "watchDate": "2024-02-01",
  "review": "观影感受...",
  "poster": "images/movies/movie-5.jpg",
  "duration": 120,
  "country": "国家",
  "language": "语言"
}
```

**步骤3：添加详情弹窗数据到 `js/details.js`**
```javascript
movies: {
    5: {
        title: '电影名',
        detailImage: '../../images/details/电影名.png',
        meta: ['个性化标签1', '个性化标签2', '个性化标签3'],
        thoughts: '散文风格的观影感悟...'
    }
}
```

#### 🎵 添加新音乐

**步骤1：准备图片素材**
```
images/music/album-X.jpg         # 专辑封面
images/details/歌名.png          # 详情展示图
```

**步骤2：编辑 `data/music.json`**
```json
{
  "id": 4,
  "songName": "歌名",
  "artist": "艺术家",
  "album": "专辑名",
  "genre": "音乐类型",
  "releaseYear": 2024,
  "mood": "心情标签",
  "reason": "推荐理由...",
  "albumCover": "images/music/album-4.jpg",
  "addDate": "2024-02-01",
  "playCount": 0,
  "language": "语言"
}
```

**步骤3：添加详情弹窗数据到 `js/details.js`**
```javascript
music: {
    4: {
        title: '歌名',
        detailImage: '../../images/details/歌名.png',
        meta: ['个性化标签1', '个性化标签2', '个性化标签3'],
        thoughts: '散文风格的音乐感悟...'
    }
}
```

#### 🏃‍♂️ 添加新马拉松记录

**步骤1：准备图片素材**
```
images/marathon/证书名.jpg       # 完赛证书
images/marathon/scene-赛事-X.jpg # 现场照片
```

**步骤2：编辑 `data/marathon.json`**
```json
{
  "id": 3,
  "name": "赛事名称",
  "date": "2024-02-01",
  "location": "城市",
  "distance": "距离描述",
  "time": "2:30:00",
  "ranking": 50,
  "totalParticipants": 1000,
  "weather": "天气描述",
  "experience": "参赛体验和感想...",
  "certificate": "images/marathon/证书名.jpg",
  "photos": [
    "images/marathon/scene-赛事-1.jpg",
    "images/marathon/scene-赛事-2.jpg"
  ]
}
```

### 💡 添加技巧

1. **ID管理**：每种类型使用独立的ID序列，新记录使用下一个可用ID
2. **图片优化**：建议压缩图片以提高加载速度
3. **路径检查**：确保所有图片路径正确无误
4. **内容风格**：
   - JSON中的review/reason：简洁客观的介绍
   - details.js中的thoughts：散文风格的个人感悟
   - meta标签：避免通用信息，使用个性化标签

### 更新流程

1. 按照上述步骤添加相应文件和数据
2. 在浏览器中测试页面显示效果
3. 确认详情弹窗功能正常工作
4. 提交更改到Git仓库

### 数据格式

- 所有数据使用JSON格式存储
- 支持评分、日期、标签等丰富字段
- 详细格式参见 `data/README.md`

## 🛠 技术栈

- **前端框架**: 原生HTML5 + CSS3 + JavaScript (ES6+)
- **样式技术**: 
  - 自定义CSS + CSS Grid + Flexbox
  - 毛玻璃效果 (backdrop-filter)
  - CSS动画和过渡效果
- **交互功能**:
  - 原生JavaScript DOM操作
  - 异步数据加载 (fetch API)
  - 事件驱动的交互逻辑
- **响应式设计**: 移动优先的媒体查询
- **字体**: Google Fonts (Nunito)
- **图标**: 自定义SVG图标
- **数据存储**: JSON文件数据驱动
- **部署**: 静态网站托管 (GitHub Pages)

## 🌐 部署信息

- **当前域名**: https://cheng-hun-gu-ren.github.io/life/
- **自定义域名**: life.chenggao.top (配置中)
- **CDN加速**: Cloudflare
- **部署平台**: GitHub Pages
- **分支**: main (默认部署分支)

## 👤 个人信息

- **昵称**: 晨昏故人
- **年龄**: 22岁
- **城市**: 深圳
- **职业**: 金融工程研究生
- **联系方式**: wechat: chgr_CarpeDiem
- **公众号**: 晨昏故人

## 🔗 相关链接

- **学术主页**: https://portfolio.chgr-cuhksz-gao.cn/
- **求职主页**: https://career.chenggao.top (开发中)
- **GitHub仓库**: https://github.com/Cheng-hun-gu-ren/life

## 📝 开发历程

### 阶段1-4: 基础架构 (2024-01-30)
- 项目初始化，创建设计稿和目录结构
- 实现基础的HTML结构和CSS样式
- 完成响应式布局和基础交互

### 阶段5: 详情弹窗系统 (最近完成)
- 实现书籍、电影、音乐的详情弹窗功能
- 添加毛玻璃效果和优雅的交互动画
- 完善移动端适配和用户体验

### 阶段6: 留言板功能 (最近完成)
- 在兴趣爱好页面添加访客留言功能
- 实现匿名留言和实时展示
- 增强页面互动性和社交属性

### 当前状态
- ✅ 核心功能完整实现
- ✅ 响应式设计完善
- ✅ 详情展示系统完成
- ✅ 交互功能齐全
- 🔄 持续优化用户体验和内容更新

## 🤝 贡献

这是个人项目，主要用于展示个人生活动态。如有建议或发现问题，欢迎交流。

## 📄 许可证

本项目仅用于个人展示，请勿商业使用。
