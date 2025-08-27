# CSS样式文件说明

本目录包含网站的所有样式文件，采用模块化管理。

## 📁 文件结构

```
css/
├── style.css          # 主样式文件
├── responsive.css     # 响应式样式
└── animations.css     # 动画效果
```

## 🎨 style.css - 主样式文件

### 包含内容
- 全局样式重置
- 网站配色方案
- 布局样式
- 组件样式
- 字体定义

### 主要样式块
```css
/* 全局样式 */
:root { /* CSS变量定义 */ }
* { /* 重置样式 */ }
body { /* 页面主体 */ }

/* 布局 */
.container { /* 主容器 */ }
.sidebar { /* 侧边栏 */ }
.main-content { /* 主内容区 */ }

/* 组件 */
.card { /* 卡片组件 */ }
.button { /* 按钮组件 */ }
.tab { /* 标签页组件 */ }
```

## 📱 responsive.css - 响应式样式

### 断点设置
- **桌面端**: > 1024px
- **平板端**: 768px - 1024px  
- **手机端**: < 768px

### 响应式策略
```css
/* 桌面端 */
@media (min-width: 1025px) {
    /* 左右分栏布局 */
}

/* 平板端 */
@media (max-width: 1024px) and (min-width: 769px) {
    /* 上下堆叠布局 */
}

/* 手机端 */
@media (max-width: 768px) {
    /* 单列布局 */
    /* 抽屉菜单 */
}
```

## ✨ animations.css - 动画效果

### 动画类型
- 页面切换动画
- 悬停效果
- 点击反馈
- 滚动动画
- 特殊交互动画

### 动画示例
```css
/* 淡入动画 */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* 卡片悬停 */
.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

/* 按钮点击 */
.button:active {
    transform: scale(0.95);
}
```

## 🎨 配色方案

### CSS变量定义
```css
:root {
    /* 主色调 */
    --color-primary: #4ECDC4;      /* 薄荷绿 */
    --color-secondary: #45B7D1;    /* 天空蓝 */
    --color-accent: #FFA07A;       /* 温暖橙 */
    
    /* 背景色 */
    --bg-main: #F8FFFE;           /* 极浅薄荷色 */
    --bg-card: #FFFFFF;           /* 纯白 */
    
    /* 文字色 */
    --text-primary: #2C3E50;      /* 深蓝灰 */
    --text-secondary: #7F8C8D;    /* 中灰 */
    
    /* 边框色 */
    --border-light: #E8F4FD;      /* 浅蓝 */
    --border-medium: #B8E6B8;     /* 薄荷绿 */
}
```

## 🔤 字体方案

### Google Fonts引入
```css
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap');
```

### 字体使用
```css
body {
    font-family: 'Nunito', 'Microsoft YaHei', sans-serif;
}

.title {
    font-weight: 700;
    font-size: 2rem;
}

.subtitle {
    font-weight: 600;
    font-size: 1.2rem;
}

.text {
    font-weight: 400;
    font-size: 1rem;
}
```

## 🎯 组件样式规范

### 卡片组件
```css
.card {
    background: var(--bg-card);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
}
```

### 按钮组件
```css
.btn {
    padding: 10px 20px;
    border-radius: 25px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary {
    background: var(--color-primary);
    color: white;
}
```

### 标签页组件
```css
.tab-container {
    border-bottom: 2px solid var(--border-light);
}

.tab-item {
    padding: 10px 20px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.3s ease;
}

.tab-item.active {
    border-bottom-color: var(--color-primary);
    color: var(--color-primary);
}
```

## 📐 布局规范

### 网格系统
```css
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.row {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -10px;
}

.col {
    flex: 1;
    padding: 0 10px;
}
```

### 间距系统
```css
/* 间距变量 */
:root {
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
}
```

## 💡 编写规范

### CSS组织原则
1. **从一般到具体**: 全局样式 → 布局 → 组件 → 页面特定
2. **按功能分组**: 相关样式写在一起
3. **使用CSS变量**: 方便维护和主题切换
4. **语义化命名**: 使用有意义的类名

### 命名规范
- 使用BEM方法: `.block__element--modifier`
- 组件前缀: `.c-` (如 `.c-card`)
- 工具类前缀: `.u-` (如 `.u-center`)
- 状态前缀: `.is-` (如 `.is-active`)

### 代码格式
```css
/* 选择器 */
.selector {
    property: value;
    property: value;
}

/* 多个选择器 */
.selector1,
.selector2,
.selector3 {
    property: value;
}
```

## 🔄 维护说明

### 更新流程
1. 修改对应CSS文件
2. 测试在不同设备上的显示效果
3. 确保与整体设计保持一致
4. 检查是否影响其他组件

### 性能优化
- 合并相似样式
- 使用CSS变量减少重复
- 压缩CSS文件用于生产环境
- 使用autoprefixer添加浏览器前缀