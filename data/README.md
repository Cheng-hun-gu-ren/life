# 数据文件说明

本目录用于存放网站的所有动态数据文件，采用JSON格式便于JavaScript读取和更新。

## 📁 文件结构

```
data/
├── books.json          # 书籍数据
├── movies.json         # 电影数据
├── music.json          # 音乐数据
└── marathon.json       # 马拉松数据
```

## 📚 books.json - 书籍数据

### 数据结构
```json
{
  "currentReading": [
    {
      "id": 1,
      "title": "书名",
      "author": "作者",
      "isbn": "978-7-xxxx-xxxx-x",
      "progress": 60,
      "startDate": "2024-01-15",
      "thoughts": "阅读感想，一句话概括",
      "rating": 4.5,
      "cover": "images/books/book-1.jpg",
      "status": "reading",
      "genre": "科幻",
      "pages": 320
    }
  ],
  "recentlyFinished": [
    {
      "id": 2,
      "title": "已读完的书名",
      "author": "作者",
      "finishDate": "2024-01-10",
      "review": "详细的读后感",
      "rating": 4.0,
      "cover": "images/books/book-2.jpg",
      "status": "finished"
    }
  ]
}
```

### 字段说明
- `id`: 唯一标识符
- `title`: 书名
- `author`: 作者
- `isbn`: 国际标准书号（可选）
- `progress`: 阅读进度（0-100）
- `startDate`: 开始阅读日期
- `thoughts`: 简短感想
- `rating`: 个人评分（1-5星）
- `cover`: 封面图片路径
- `status`: 状态（reading/finished/paused）
- `genre`: 类型
- `pages`: 总页数

## 🎬 movies.json - 电影数据

### 数据结构
```json
{
  "recentWatched": [
    {
      "id": 1,
      "title": "电影名",
      "originalTitle": "Original Title",
      "director": "导演",
      "year": 2024,
      "genre": ["科幻", "动作"],
      "rating": 4.5,
      "watchDate": "2024-01-20",
      "review": "观后感，一到两句话",
      "poster": "images/movies/movie-1.jpg",
      "duration": 142,
      "country": "美国",
      "language": "英语"
    }
  ]
}
```

### 字段说明
- `id`: 唯一标识符
- `title`: 中文片名
- `originalTitle`: 原片名
- `director`: 导演
- `year`: 上映年份
- `genre`: 类型数组
- `rating`: 个人评分（1-5星）
- `watchDate`: 观看日期
- `review`: 观后感
- `poster`: 海报图片路径
- `duration`: 时长（分钟）
- `country`: 制片国家
- `language`: 语言

## 🎵 music.json - 音乐数据

### 数据结构
```json
{
  "currentListening": [
    {
      "id": 1,
      "songName": "歌曲名称",
      "artist": "艺术家",
      "album": "专辑名称",
      "genre": "流行",
      "releaseYear": 2024,
      "mood": "开心",
      "reason": "推荐理由，为什么喜欢这首歌",
      "albumCover": "images/music/album-1.jpg",
      "addDate": "2024-01-25",
      "playCount": 15,
      "language": "中文"
    }
  ],
  "playlists": [
    {
      "id": 1,
      "name": "我的最爱",
      "description": "最喜欢的歌曲合集",
      "cover": "images/music/playlist-cover.jpg",
      "songCount": 25,
      "createDate": "2024-01-01",
      "updateDate": "2024-01-25"
    }
  ]
}
```

### 字段说明
- `id`: 唯一标识符
- `songName`: 歌曲名称
- `artist`: 艺术家/歌手
- `album`: 专辑名称
- `genre`: 音乐类型
- `releaseYear`: 发行年份
- `mood`: 听歌心情（开心/忧伤/激昂/放松）
- `reason`: 推荐理由
- `albumCover`: 专辑封面路径
- `addDate`: 添加日期
- `playCount`: 播放次数
- `language`: 语言

## 🏃‍♂️ marathon.json - 马拉松数据

### 数据结构
```json
{
  "races": [
    {
      "id": 1,
      "name": "深圳马拉松",
      "date": "2024-01-14",
      "location": "深圳",
      "distance": "全马",
      "time": "4:32:15",
      "ranking": 1523,
      "totalParticipants": 8000,
      "weather": "晴天，18°C",
      "experience": "第一次全马，虽然累但很有成就感",
      "certificate": "images/marathon/certificate-shenzhen-2024.jpg",
      "medal": "images/marathon/medal-shenzhen-2024.jpg",
      "photos": [
        "images/marathon/scene-shenzhen-1.jpg",
        "images/marathon/scene-shenzhen-2.jpg"
      ]
    }
  ],
  "statistics": {
    "totalRaces": 5,
    "totalDistance": 150.5,
    "bestTime": "4:15:30",
    "averageTime": "4:28:45",
    "favoriteDistance": "半马"
  },
  "trainingLog": [
    {
      "date": "2024-01-30",
      "distance": 10.5,
      "time": "52:30",
      "pace": "5:00",
      "location": "深圳湾公园",
      "weather": "多云",
      "feeling": "状态不错，配速稳定",
      "type": "日常训练"
    }
  ]
}
```

### 字段说明

#### 比赛记录 (races)
- `id`: 唯一标识符
- `name`: 赛事名称
- `date`: 比赛日期
- `location`: 举办地点
- `distance`: 比赛距离（全马/半马/10K等）
- `time`: 完赛时间
- `ranking`: 排名
- `totalParticipants`: 总参赛人数
- `weather`: 天气情况
- `experience`: 参赛感受
- `certificate`: 证书图片路径
- `medal`: 奖牌图片路径
- `photos`: 相关照片数组

#### 统计数据 (statistics)
- `totalRaces`: 总参赛次数
- `totalDistance`: 总跑步距离（公里）
- `bestTime`: 最好成绩
- `averageTime`: 平均时间
- `favoriteDistance`: 最喜欢的距离

#### 训练日志 (trainingLog)
- `date`: 训练日期
- `distance`: 跑步距离
- `time`: 用时
- `pace`: 配速
- `location`: 跑步地点
- `weather`: 天气
- `feeling`: 感受
- `type`: 训练类型

## 🔄 更新维护

### 数据更新流程
1. 编辑对应的JSON文件
2. 添加新记录时，确保id唯一
3. 更新图片路径时，确保文件存在
4. 保持JSON格式正确性

### 数据验证
- 使用JSON校验工具检查格式
- 确保必需字段不为空
- 检查图片路径是否正确
- 验证日期格式统一

### 备份建议
- 定期备份数据文件
- 使用版本控制跟踪变更
- 在重大更新前创建备份点