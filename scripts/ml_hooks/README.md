# ML工程师专用Hooks系统

本目录包含专为**大模型调参、高阶RAG、数据处理和分析**工作设计的自动化hooks脚本。

## 🎯 系统架构

### Hooks配置文件
- **位置**: `.claude/settings.json`
- **作用**: 定义Claude Code工具执行时的自动化动作
- **覆盖范围**: 文件编辑、命令执行、任务通知、会话结束

### 核心脚本

#### 1. `experiment_tracker.py` - 实验追踪系统
**触发时机**: 每次文件编辑后 (PostToolUse: Edit|Write|MultiEdit)

**功能特性**:
- 自动检测实验类型 (超参数调优、模型架构、数据处理、RAG优化等)
- 记录Git提交信息和变更文件
- 分析项目结构和文件组成
- 维护实验日志 (`experiments/experiment_log.json`)
- 自动更新README的实验统计部分

**实验类型识别**:
- `hyperparameter_tuning`: 检测到config、params相关文件
- `model_architecture`: 检测到model、network相关文件  
- `data_processing`: 检测到data、dataset相关文件
- `rag_optimization`: 检测到rag、embedding相关文件
- `code_improvement`: 其他代码优化

#### 2. `rag_performance_monitor.py` - RAG系统性能监控
**触发时机**: 每次Bash命令执行后 (PostToolUse: Bash)

**功能特性**:
- API端点健康检查 (chat、search、health endpoints)
- 自动化RAG性能测试 (5个标准测试查询)
- 响应时间和质量评分监控
- RAG相关文件结构分析
- 性能历史记录和趋势分析
- 自动更新README的RAG性能指标

**监控指标**:
- 端点在线状态和响应时间
- 查询成功率和平均响应时间
- 响应质量评分 (基于内容长度和关键词)
- 文件统计 (RAG文件、配置文件、数据文件)

#### 3. `data_quality_monitor.py` - 数据质量监控
**触发时机**: 每次文件编辑后 (PostToolUse: Edit|Write|MultiEdit)

**功能特性**:
- 自动发现数据文件 (.json, .csv, .yaml等)
- JSON文件结构和完整性验证
- 数据记录数量和模式一致性检查
- 文件哈希值变更检测
- 数据质量评分计算
- 自动更新README的数据质量指标

**质量检查内容**:
- JSON格式有效性
- 数据模式一致性
- 必需字段完整性
- 重复记录检测
- 文件大小和记录统计

## 📊 自动化文档更新

### README标记区域
hooks系统会自动更新README.md中的以下标记区域：

```markdown
<!-- ML-EXPERIMENTS:START -->
## 🔬 ML实验追踪 (自动更新)
[实验统计和历史记录]
<!-- ML-EXPERIMENTS:END -->

<!-- RAG-PERFORMANCE:START -->
## 🤖 RAG系统性能监控 (自动更新)  
[RAG系统状态和性能指标]
<!-- RAG-PERFORMANCE:END -->

<!-- DATA-QUALITY:START -->
## 📊 数据质量监控 (自动更新)
[数据文件质量和统计信息]
<!-- DATA-QUALITY:END -->
```

### 生成的文件结构
```
experiments/
├── experiment_log.json          # 实验历史记录
rag_performance/
├── performance_history.json     # RAG性能历史
data_quality/
├── quality_history.json         # 数据质量历史
└── latest_detailed_report.json  # 最新详细报告
```

## 🚀 使用指南

### 初次设置
1. 确保Python环境可用
2. 安装依赖 (如果需要): `pip install requests numpy`
3. hooks会在首次运行时自动创建必要的目录

### 工作流程
1. **编辑文件** → 触发实验追踪 + 数据质量检查
2. **执行命令** → 触发RAG性能监控  
3. **任务完成** → 自动更新README文档
4. **查看报告** → 检查生成的日志和指标

### 自定义配置
在项目根目录创建 `rag_config.json`:
```json
{
  "api_base": "https://dashscope.aliyuncs.com/compatible-mode/v1",
  "api_endpoints": {
    "chat": "http://localhost:3000/api/rag/chat",
    "search": "http://localhost:3000/api/rag/search",
    "health": "http://localhost:3000/api/rag/health"
  }
}
```

## 🔧 故障排除

### 常见问题
1. **Python脚本执行失败**: 检查Python环境和工作目录
2. **README更新失败**: 确保README.md存在且可写
3. **API监控失败**: 检查RAG服务器是否运行
4. **权限问题**: 确保scripts目录有执行权限

### 调试模式
在任何脚本中添加 `--debug` 参数以获得详细输出：
```bash
python scripts/ml_hooks/experiment_tracker.py --debug
```

## 📈 性能影响

- **实验追踪**: 轻量级，通常 < 100ms
- **RAG监控**: 取决于API响应时间，通常 1-3s
- **数据质量检查**: 取决于数据文件大小，通常 < 500ms

## 🔄 版本历史

- **v1.0** (2024-08-28): 初始版本，支持基础实验追踪
- **v1.1** (2024-08-28): 添加RAG性能监控
- **v1.2** (2024-08-28): 添加数据质量监控和README自动更新

---

> 🧠 这套hooks系统专为ML工程师的日常工作流程设计，帮助自动化实验管理、系统监控和文档维护。