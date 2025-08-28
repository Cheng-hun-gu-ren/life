#!/usr/bin/env python3
"""
RAG系统性能监控Hook脚本
用于自动监控RAG系统性能和质量指标
"""

import json
import os
import time
import requests
from datetime import datetime
import numpy as np

class RAGPerformanceMonitor:
    def __init__(self):
        self.project_dir = os.getenv('CLAUDE_PROJECT_DIR', os.getcwd())
        self.performance_log = os.path.join(self.project_dir, 'rag_performance', 'performance_history.json')
        self.config_file = os.path.join(self.project_dir, 'rag_config.json')
        self.ensure_directories()
        
    def ensure_directories(self):
        """确保必要的目录存在"""
        os.makedirs(os.path.dirname(self.performance_log), exist_ok=True)
        
    def load_rag_config(self):
        """加载RAG配置"""
        default_config = {
            "api_base": "https://dashscope.aliyuncs.com/compatible-mode/v1",
            "embedding_model": "text-embedding-v2", 
            "chat_model": "qwen-turbo",
            "api_endpoints": {
                "chat": "http://localhost:3000/api/rag/chat",
                "search": "http://localhost:3000/api/rag/search", 
                "health": "http://localhost:3000/api/rag/health"
            }
        }
        
        if os.path.exists(self.config_file):
            try:
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                return {**default_config, **config}
            except:
                pass
        
        return default_config
    
    def test_api_endpoints(self, config):
        """测试API端点可用性"""
        endpoint_status = {}
        
        for name, url in config.get('api_endpoints', {}).items():
            try:
                start_time = time.time()
                response = requests.get(url, timeout=5)
                response_time = (time.time() - start_time) * 1000  # ms
                
                endpoint_status[name] = {
                    "status": "online" if response.status_code == 200 else "error",
                    "status_code": response.status_code,
                    "response_time_ms": round(response_time, 2)
                }
            except Exception as e:
                endpoint_status[name] = {
                    "status": "offline",
                    "error": str(e),
                    "response_time_ms": None
                }
        
        return endpoint_status
    
    def run_performance_test(self, config):
        """运行RAG性能测试"""
        test_queries = [
            "推荐几本心理学相关的书籍",
            "有什么治愈系的音乐推荐吗？", 
            "想看一部让人深思的电影",
            "最近读了什么有趣的书？",
            "介绍一下你的教育背景"
        ]
        
        performance_metrics = {
            "total_queries": len(test_queries),
            "successful_queries": 0,
            "failed_queries": 0,
            "average_response_time": 0,
            "response_times": [],
            "response_quality_scores": []
        }
        
        chat_endpoint = config.get('api_endpoints', {}).get('chat')
        if not chat_endpoint:
            return performance_metrics
        
        for query in test_queries:
            try:
                start_time = time.time()
                
                response = requests.post(chat_endpoint, 
                    json={"message": query, "conversationId": "test"},
                    timeout=10
                )
                
                response_time = (time.time() - start_time) * 1000  # ms
                
                if response.status_code == 200:
                    performance_metrics["successful_queries"] += 1
                    performance_metrics["response_times"].append(response_time)
                    
                    # 简单的响应质量评分 (基于响应长度和结构)
                    response_data = response.json()
                    response_text = response_data.get('response', '')
                    quality_score = min(100, len(response_text) / 5)  # 基础评分
                    if '推荐' in response_text or '建议' in response_text:
                        quality_score += 20
                    if len(response_text) > 100:
                        quality_score += 10
                    
                    performance_metrics["response_quality_scores"].append(quality_score)
                else:
                    performance_metrics["failed_queries"] += 1
                    
            except Exception as e:
                performance_metrics["failed_queries"] += 1
                print(f"查询失败: {query} - {e}")
        
        # 计算平均响应时间
        if performance_metrics["response_times"]:
            performance_metrics["average_response_time"] = round(
                np.mean(performance_metrics["response_times"]), 2
            )
            performance_metrics["average_quality_score"] = round(
                np.mean(performance_metrics["response_quality_scores"]), 2
            )
        
        return performance_metrics
    
    def analyze_rag_files(self):
        """分析RAG相关文件"""
        rag_analysis = {
            "rag_files_found": [],
            "config_files": [],
            "data_files": [],
            "api_files": []
        }
        
        for root, dirs, files in os.walk(self.project_dir):
            # 跳过隐藏目录和node_modules
            dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'node_modules']
            
            for file in files:
                file_lower = file.lower()
                file_path = os.path.join(root, file)
                
                if any(keyword in file_lower for keyword in ['rag', 'embedding', 'vector', 'retrieval']):
                    rag_analysis["rag_files_found"].append(file_path)
                
                if any(keyword in file_lower for keyword in ['config', 'settings']) and file_lower.endswith(('.json', '.yaml', '.yml')):
                    rag_analysis["config_files"].append(file_path)
                
                if file_lower.endswith('.json') and any(keyword in file_lower for keyword in ['data', 'books', 'movies', 'music']):
                    rag_analysis["data_files"].append(file_path)
                
                if file_lower.endswith('.js') and any(keyword in file_lower for keyword in ['api', 'service', 'route']):
                    rag_analysis["api_files"].append(file_path)
        
        return rag_analysis
    
    def generate_performance_report(self):
        """生成性能报告"""
        config = self.load_rag_config()
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "config": config,
            "endpoint_status": self.test_api_endpoints(config),
            "performance_metrics": self.run_performance_test(config),
            "file_analysis": self.analyze_rag_files()
        }
        
        # 保存性能历史
        history = []
        if os.path.exists(self.performance_log):
            try:
                with open(self.performance_log, 'r', encoding='utf-8') as f:
                    history = json.load(f)
            except:
                history = []
        
        history.append(report)
        history = history[-30:]  # 保留最近30次记录
        
        with open(self.performance_log, 'w', encoding='utf-8') as f:
            json.dump(history, f, indent=2, ensure_ascii=False)
        
        return report
    
    def update_readme_rag_metrics(self, report):
        """更新README中的RAG指标"""
        readme_path = os.path.join(self.project_dir, 'README.md')
        if not os.path.exists(readme_path):
            return
        
        try:
            endpoints = report['endpoint_status']
            metrics = report['performance_metrics']
            
            online_endpoints = sum(1 for ep in endpoints.values() if ep.get('status') == 'online')
            total_endpoints = len(endpoints)
            
            success_rate = round((metrics['successful_queries'] / metrics['total_queries']) * 100, 1) if metrics['total_queries'] > 0 else 0
            
            rag_section = f"""<!-- RAG-PERFORMANCE:START -->
## 🤖 RAG系统性能监控 (自动更新)

### 系统状态
- **API端点状态**: {online_endpoints}/{total_endpoints} 在线
- **健康检查**: {'✅ 正常' if online_endpoints == total_endpoints else '⚠️ 部分异常'}
- **最后检测**: {report['timestamp'][:19].replace('T', ' ')}

### 性能指标
- **查询成功率**: {success_rate}% ({metrics['successful_queries']}/{metrics['total_queries']})
- **平均响应时间**: {metrics.get('average_response_time', 0)}ms
- **平均质量评分**: {metrics.get('average_quality_score', 0)}/100

### 端点详情
{chr(10).join([f"- **{name}**: {info['status']} ({info.get('response_time_ms', 'N/A')}ms)" for name, info in endpoints.items()])}

### 文件统计  
- **RAG相关文件**: {len(report['file_analysis']['rag_files_found'])}个
- **配置文件**: {len(report['file_analysis']['config_files'])}个
- **数据文件**: {len(report['file_analysis']['data_files'])}个
<!-- RAG-PERFORMANCE:END -->"""
            
            with open(readme_path, 'r', encoding='utf-8') as f:
                readme_content = f.read()
            
            # 替换或添加RAG性能部分
            import re
            pattern = r'<!-- RAG-PERFORMANCE:START -->.*?<!-- RAG-PERFORMANCE:END -->'
            if re.search(pattern, readme_content, re.DOTALL):
                readme_content = re.sub(pattern, rag_section, readme_content, flags=re.DOTALL)
            else:
                readme_content += '\n\n' + rag_section
            
            with open(readme_path, 'w', encoding='utf-8') as f:
                f.write(readme_content)
            
            print("✅ README RAG指标已更新")
            
        except Exception as e:
            print(f"❌ 更新README RAG指标时出错: {e}")

def main():
    """主函数"""
    monitor = RAGPerformanceMonitor()
    
    print("🔍 开始RAG系统性能监控...")
    
    # 生成性能报告
    report = monitor.generate_performance_report()
    
    # 更新README
    monitor.update_readme_rag_metrics(report)
    
    # 输出摘要
    endpoints = report['endpoint_status']
    metrics = report['performance_metrics']
    
    online_count = sum(1 for ep in endpoints.values() if ep.get('status') == 'online')
    success_rate = round((metrics['successful_queries'] / metrics['total_queries']) * 100, 1) if metrics['total_queries'] > 0 else 0
    
    print(f"📊 RAG性能监控完成:")
    print(f"   - 端点状态: {online_count}/{len(endpoints)} 在线")
    print(f"   - 查询成功率: {success_rate}%")
    print(f"   - 平均响应时间: {metrics.get('average_response_time', 0)}ms")

if __name__ == "__main__":
    main()