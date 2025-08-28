#!/usr/bin/env python3
"""
数据质量监控Hook脚本
用于自动监控数据文件质量和完整性
"""

import json
import os
import hashlib
from datetime import datetime
from pathlib import Path

class DataQualityMonitor:
    def __init__(self):
        self.project_dir = os.getenv('CLAUDE_PROJECT_DIR', os.getcwd())
        self.quality_log = os.path.join(self.project_dir, 'data_quality', 'quality_history.json')
        self.ensure_directories()
        
    def ensure_directories(self):
        """确保必要的目录存在"""
        os.makedirs(os.path.dirname(self.quality_log), exist_ok=True)
        
    def discover_data_files(self):
        """发现项目中的数据文件"""
        data_files = []
        data_extensions = {'.json', '.csv', '.txt', '.yaml', '.yml'}
        
        for root, dirs, files in os.walk(self.project_dir):
            # 跳过隐藏目录、node_modules、.git等
            dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['node_modules', 'dist', 'build']]
            
            for file in files:
                file_path = os.path.join(root, file)
                file_ext = Path(file).suffix.lower()
                
                if file_ext in data_extensions:
                    # 特别关注data目录、配置文件和明显的数据文件
                    if ('data' in root.lower() or 
                        any(keyword in file.lower() for keyword in ['data', 'config', 'books', 'movies', 'music', 'marathon']) or
                        file.lower().startswith(('data_', 'config_'))):
                        data_files.append(file_path)
        
        return data_files
    
    def analyze_json_file(self, filepath):
        """分析JSON文件质量"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            analysis = {
                "status": "valid",
                "file_size_bytes": os.path.getsize(filepath),
                "data_type": type(data).__name__,
                "total_records": 0,
                "schema_info": {},
                "data_issues": []
            }
            
            if isinstance(data, list):
                analysis["total_records"] = len(data)
                if data:  # 非空列表
                    # 分析第一个元素的结构
                    first_item = data[0]
                    if isinstance(first_item, dict):
                        analysis["schema_info"] = {
                            "fields": list(first_item.keys()),
                            "field_count": len(first_item.keys())
                        }
                        
                        # 检查数据一致性
                        for i, item in enumerate(data[:10]):  # 检查前10条
                            if not isinstance(item, dict):
                                analysis["data_issues"].append(f"Record {i}: Not a dictionary")
                            elif set(item.keys()) != set(first_item.keys()):
                                analysis["data_issues"].append(f"Record {i}: Schema mismatch")
                            
                            # 检查必需字段
                            for field in ['id', 'title', 'name']:
                                if field in item and (item[field] is None or item[field] == ""):
                                    analysis["data_issues"].append(f"Record {i}: Empty {field}")
            
            elif isinstance(data, dict):
                analysis["schema_info"] = {
                    "keys": list(data.keys()),
                    "key_count": len(data.keys())
                }
            
            return analysis
            
        except json.JSONDecodeError as e:
            return {
                "status": "invalid_json",
                "error": str(e),
                "file_size_bytes": os.path.getsize(filepath) if os.path.exists(filepath) else 0
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "file_size_bytes": os.path.getsize(filepath) if os.path.exists(filepath) else 0
            }
    
    def calculate_file_hash(self, filepath):
        """计算文件哈希值用于变更检测"""
        try:
            with open(filepath, 'rb') as f:
                content = f.read()
                return hashlib.md5(content).hexdigest()
        except:
            return None
    
    def generate_quality_report(self):
        """生成数据质量报告"""
        data_files = self.discover_data_files()
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "total_files": len(data_files),
            "files_analyzed": 0,
            "files_with_issues": 0,
            "file_details": {},
            "summary": {
                "valid_files": 0,
                "invalid_files": 0,
                "total_records": 0,
                "total_size_bytes": 0
            }
        }
        
        for filepath in data_files:
            try:
                # 基本文件信息
                file_info = {
                    "filepath": filepath,
                    "filename": os.path.basename(filepath),
                    "last_modified": datetime.fromtimestamp(os.path.getmtime(filepath)).isoformat(),
                    "file_hash": self.calculate_file_hash(filepath)
                }
                
                # 根据文件类型进行分析
                if filepath.endswith('.json'):
                    analysis = self.analyze_json_file(filepath)
                    file_info.update(analysis)
                else:
                    # 对于其他文件类型的基本分析
                    file_info.update({
                        "status": "analyzed",
                        "file_size_bytes": os.path.getsize(filepath),
                        "file_type": "other"
                    })
                
                report["file_details"][filepath] = file_info
                report["files_analyzed"] += 1
                
                # 更新统计信息
                if file_info.get("status") == "valid":
                    report["summary"]["valid_files"] += 1
                    report["summary"]["total_records"] += file_info.get("total_records", 0)
                else:
                    report["summary"]["invalid_files"] += 1
                
                if file_info.get("data_issues"):
                    report["files_with_issues"] += 1
                
                report["summary"]["total_size_bytes"] += file_info.get("file_size_bytes", 0)
                
            except Exception as e:
                report["file_details"][filepath] = {
                    "filepath": filepath,
                    "status": "error",
                    "error": str(e)
                }
        
        # 保存质量历史
        self.save_quality_history(report)
        
        return report
    
    def save_quality_history(self, report):
        """保存质量检查历史"""
        history = []
        if os.path.exists(self.quality_log):
            try:
                with open(self.quality_log, 'r', encoding='utf-8') as f:
                    history = json.load(f)
            except:
                history = []
        
        # 添加当前报告（只保存摘要信息以节省空间）
        summary_report = {
            "timestamp": report["timestamp"],
            "total_files": report["total_files"],
            "files_with_issues": report["files_with_issues"],
            "summary": report["summary"],
            "file_count_by_type": self.count_files_by_type(report["file_details"])
        }
        
        history.append(summary_report)
        history = history[-20:]  # 保留最近20次记录
        
        with open(self.quality_log, 'w', encoding='utf-8') as f:
            json.dump(history, f, indent=2, ensure_ascii=False)
        
        # 同时保存详细报告
        detailed_report_path = os.path.join(
            os.path.dirname(self.quality_log), 
            'latest_detailed_report.json'
        )
        with open(detailed_report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
    
    def count_files_by_type(self, file_details):
        """按文件类型统计文件数量"""
        type_count = {}
        for filepath, info in file_details.items():
            ext = Path(filepath).suffix.lower()
            type_count[ext] = type_count.get(ext, 0) + 1
        return type_count
    
    def update_readme_data_metrics(self, report):
        """更新README中的数据质量指标"""
        readme_path = os.path.join(self.project_dir, 'README.md')
        if not os.path.exists(readme_path):
            return
        
        try:
            summary = report["summary"]
            quality_score = round((summary["valid_files"] / summary["valid_files"] + summary["invalid_files"]) * 100, 1) if (summary["valid_files"] + summary["invalid_files"]) > 0 else 100
            
            # 文件大小格式化
            def format_size(bytes):
                if bytes < 1024:
                    return f"{bytes}B"
                elif bytes < 1024 * 1024:
                    return f"{bytes/1024:.1f}KB"
                else:
                    return f"{bytes/(1024*1024):.1f}MB"
            
            data_section = f"""<!-- DATA-QUALITY:START -->
## 📊 数据质量监控 (自动更新)

### 数据概览
- **数据文件总数**: {report['total_files']}个
- **数据记录总数**: {summary['total_records']:,}条
- **数据总大小**: {format_size(summary['total_size_bytes'])}
- **数据质量评分**: {quality_score}/100

### 质量状态
- **正常文件**: {summary['valid_files']}个 ✅
- **异常文件**: {summary['invalid_files']}个 {'⚠️' if summary['invalid_files'] > 0 else '✅'}
- **存在问题的文件**: {report['files_with_issues']}个
- **最后检测**: {report['timestamp'][:19].replace('T', ' ')}

### 文件类型分布
{chr(10).join([f"- **{ext or '无扩展名'}**: {count}个" for ext, count in self.count_files_by_type(report['file_details']).items()])}
<!-- DATA-QUALITY:END -->"""
            
            with open(readme_path, 'r', encoding='utf-8') as f:
                readme_content = f.read()
            
            # 替换或添加数据质量部分
            import re
            pattern = r'<!-- DATA-QUALITY:START -->.*?<!-- DATA-QUALITY:END -->'
            if re.search(pattern, readme_content, re.DOTALL):
                readme_content = re.sub(pattern, data_section, readme_content, flags=re.DOTALL)
            else:
                readme_content += '\n\n' + data_section
            
            with open(readme_path, 'w', encoding='utf-8') as f:
                f.write(readme_content)
            
            print("✅ README数据质量指标已更新")
            
        except Exception as e:
            print(f"❌ 更新README数据质量指标时出错: {e}")

def main():
    """主函数"""
    monitor = DataQualityMonitor()
    
    print("📊 开始数据质量检查...")
    
    # 生成质量报告
    report = monitor.generate_quality_report()
    
    # 更新README
    monitor.update_readme_data_metrics(report)
    
    # 输出摘要
    summary = report["summary"]
    quality_score = round((summary["valid_files"] / (summary["valid_files"] + summary["invalid_files"])) * 100, 1) if (summary["valid_files"] + summary["invalid_files"]) > 0 else 100
    
    print(f"📈 数据质量检查完成:")
    print(f"   - 检查文件: {report['files_analyzed']}/{report['total_files']}")
    print(f"   - 质量评分: {quality_score}/100")
    print(f"   - 数据记录: {summary['total_records']:,}条")
    print(f"   - 问题文件: {report['files_with_issues']}个")

if __name__ == "__main__":
    main()