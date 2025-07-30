# 自定义图标素材说明

本目录用于存放网站的自定义图标文件。

## 🎨 命名规范

```
{类别}-{名称}.svg
```

### 示例
- `music-note.svg` - 音符图标
- `book-open.svg` - 打开的书本图标
- `running-person.svg` - 跑步小人图标
- `movie-film.svg` - 电影胶片图标
- `heart-like.svg` - 爱心图标
- `star-rating.svg` - 星星评分图标

## 🎯 图标分类

### 音乐相关图标
- `music-note.svg` - 音符图标
- `music-headphone.svg` - 耳机图标
- `music-play.svg` - 播放按钮
- `music-mood-happy.svg` - 开心音符
- `music-mood-sad.svg` - 忧伤音符
- `music-mood-energetic.svg` - 激昂音符
- `music-mood-relaxed.svg` - 放松音符

### 兴趣爱好图标
- `book-open.svg` - 打开的书本
- `book-reading.svg` - 阅读状态
- `running-person.svg` - 跑步小人
- `running-track.svg` - 跑道图标
- `movie-film.svg` - 电影胶片
- `movie-popcorn.svg` - 爆米花

### 装饰性图标
- `star-solid.svg` - 实心星星
- `star-outline.svg` - 空心星星
- `heart-solid.svg` - 实心爱心
- `heart-outline.svg` - 空心爱心
- `cloud-cute.svg` - 可爱云朵
- `arrow-cute.svg` - 可爱箭头

### 导航图标
- `home.svg` - 首页
- `about.svg` - 关于
- `contact.svg` - 联系
- `external-link.svg` - 外部链接

## 🎨 设计规范

### 尺寸要求
- **标准尺寸**：24px × 24px
- **大图标**：48px × 48px
- **小图标**：16px × 16px
- **矢量格式**：SVG，可无损缩放

### 设计风格
- **风格**：可爱卡通风格
- **线条**：圆润，无尖锐边角
- **颜色**：使用网站配色方案
- **一致性**：保持所有图标风格统一

### 色彩方案
- **主色**：#4ECDC4 (薄荷绿)
- **辅助色**：#45B7D1 (天空蓝)
- **强调色**：#FFA07A (温暖橙)
- **中性色**：#7F8C8D (中灰)

## 💡 设计建议

### 音乐图标特色
- 音符带有可爱的表情
- 耳机采用圆润设计
- 播放按钮使用圆角三角形
- 心情图标结合音符和表情

### 兴趣爱好图标特色
- 书本图标带翻页动感
- 跑步小人有运动轨迹
- 电影图标结合胶片和爆米花元素
- 整体保持活泼可爱的感觉

### 装饰图标特色
- 星星可以有闪烁效果的设计
- 云朵采用软绵绵的造型
- 爱心可以有渐变色彩
- 箭头带有圆润的曲线

## 🛠 技术要求

### SVG优化
- 清理多余的代码和注释
- 使用相对路径
- 合并可合并的路径
- 保持代码简洁易读

### 响应式设计
- 确保在不同尺寸下显示正常
- 线条粗细适中，缩小后依然清晰
- 细节不要过多，避免缩小后看不清

### 浏览器兼容
- 确保主流浏览器支持
- 提供PNG格式后备方案（如需要）
- 测试在不同设备上的显示效果

## 🔄 使用说明

### CSS引用方式
```css
.icon {
    width: 24px;
    height: 24px;
    background-image: url('images/icons/music-note.svg');
    background-size: contain;
    background-repeat: no-repeat;
}
```

### HTML内联方式
```html
<svg class="icon">
    <use href="images/icons/music-note.svg#icon"></use>
</svg>
```

## 📝 制作工具推荐

- **Adobe Illustrator** - 专业矢量图形设计
- **Figma** - 在线协作设计工具
- **Sketch** - Mac平台设计工具
- **Inkscape** - 免费开源矢量工具
- **Canva** - 在线简易设计工具

## 🔄 更新维护

- 保持图标风格的一致性
- 定期检查图标在不同尺寸下的显示效果
- 根据网站功能更新，及时添加新图标
- 优化SVG代码，保持文件精简