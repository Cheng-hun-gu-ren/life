#!/usr/bin/env python3
"""
ML实验追踪Hook脚本
用于自动记录模型训练、调参和实验结果
"""

import json
import os
import sys
from datetime import datetime
import subprocess

class MLExperimentTracker:
    def __init__(self):
        self.project_dir = os.getenv('CLAUDE_PROJECT_DIR', os.getcwd())
        self.experiment_log = os.path.join(self.project_dir, 'experiments', 'experiment_log.json')
        self.ensure_directories()
    
    def ensure_directories(self):
        """确保必要的目录存在"""
        os.makedirs(os.path.dirname(self.experiment_log), exist_ok=True)
        os.makedirs(os.path.join(self.project_dir, 'metrics'), exist_ok=True)
        os.makedirs(os.path.join(self.project_dir, 'models'), exist_ok=True)
    
    def detect_experiment_type(self, files_changed):
        """检测实验类型"""
        if not files_changed:
            return "unknown"
        
        file_list = files_changed.lower()
        if any(keyword in file_list for keyword in ['config', 'hyperparameters', 'params']):
            return "hyperparameter_tuning"
        elif any(keyword in file_list for keyword in ['model', 'architecture', 'network']):
            return "model_architecture" 
        elif any(keyword in file_list for keyword in ['data', 'dataset', 'preprocessing']):
            return "data_processing"
        elif any(keyword in file_list for keyword in ['rag', 'embedding', 'retrieval']):
            return "rag_optimization"
        else:
            return "code_improvement"
    
    def get_git_info(self):
        """获取Git信息"""
        try:
            commit_hash = subprocess.check_output(['git', 'rev-parse', 'HEAD']).decode().strip()[:8]
            commit_msg = subprocess.check_output(['git', 'log', '-1', '--pretty=format:%s']).decode().strip()
            author = subprocess.check_output(['git', 'log', '-1', '--pretty=format:%an']).decode().strip()
            return commit_hash, commit_msg, author
        except:
            return "unknown", "unknown", "unknown"
    
    def log_experiment(self, files_changed=None):
        """记录实验信息"""
        commit_hash, commit_msg, author = self.get_git_info()
        experiment_type = self.detect_experiment_type(files_changed or "")
        
        experiment_data = {
            "timestamp": datetime.now().isoformat(),
            "commit_hash": commit_hash,
            "commit_message": commit_msg,
            "author": author,
            "experiment_type": experiment_type,
            "files_changed": files_changed or "unknown",
            "project_structure": self.analyze_project_structure(),
            "notes": f"自动记录的{experiment_type}实验"
        }
        
        # 读取现有日志
        experiments = []
        if os.path.exists(self.experiment_log):
            try:
                with open(self.experiment_log, 'r', encoding='utf-8') as f:
                    experiments = json.load(f)
            except:
                experiments = []
        
        # 添加新实验
        experiments.append(experiment_data)
        
        # 保持最新的50条记录
        experiments = experiments[-50:]
        
        # 保存日志
        with open(self.experiment_log, 'w', encoding='utf-8') as f:
            json.dump(experiments, f, indent=2, ensure_ascii=False)
        
        print(f"✅ 实验记录已保存: {experiment_type} ({commit_hash})")
        return experiment_data
    
    def analyze_project_structure(self):
        """分析项目结构"""
        structure = {
            "has_config_files": False,
            "has_model_files": False, 
            "has_data_files": False,
            "has_notebook_files": False,
            "has_rag_files": False
        }
        
        for root, dirs, files in os.walk(self.project_dir):
            # 跳过隐藏目录
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            
            for file in files:
                file_lower = file.lower()
                if any(ext in file_lower for ext in ['config.json', 'config.yaml', 'params.py']):
                    structure["has_config_files"] = True
                if any(ext in file_lower for ext in ['.pt', '.pth', '.pkl', '.h5', '.model']):
                    structure["has_model_files"] = True
                if any(ext in file_lower for ext in ['.csv', '.json', 'dataset']):
                    structure["has_data_files"] = True
                if file_lower.endswith('.ipynb'):
                    structure["has_notebook_files"] = True
                if any(keyword in file_lower for keyword in ['rag', 'embedding', 'vector', 'retrieval']):
                    structure["has_rag_files"] = True
        
        return structure
    
    def update_readme_metrics(self):
        """更新README中的实验指标"""
        readme_path = os.path.join(self.project_dir, 'README.md')
        if not os.path.exists(readme_path):
            return
        
        try:
            # 读取实验日志
            if os.path.exists(self.experiment_log):
                with open(self.experiment_log, 'r', encoding='utf-8') as f:
                    experiments = json.load(f)
                
                # 生成实验统计
                total_experiments = len(experiments)
                latest_experiment = experiments[-1] if experiments else None
                experiment_types = {}
                for exp in experiments:
                    exp_type = exp.get('experiment_type', 'unknown')
                    experiment_types[exp_type] = experiment_types.get(exp_type, 0) + 1
                
                # 更新README
                metrics_section = f"""<!-- ML-EXPERIMENTS:START -->
## 🔬 ML实验追踪 (自动更新)

### 实验统计
- **总实验数**: {total_experiments}
- **最新实验**: {latest_experiment['experiment_type'] if latest_experiment else 'None'} ({latest_experiment['timestamp'][:10] if latest_experiment else 'N/A'})
- **实验类型分布**:
  {chr(10).join([f"  - {k}: {v}次" for k, v in experiment_types.items()])}

### 最近实验记录
| 时间 | 类型 | 提交信息 | Hash |
|------|------|----------|------|
{chr(10).join([f"| {exp['timestamp'][:10]} | {exp['experiment_type']} | {exp['commit_message'][:50]}... | {exp['commit_hash']} |" for exp in experiments[-5:]])}
<!-- ML-EXPERIMENTS:END -->"""
                
                with open(readme_path, 'r', encoding='utf-8') as f:
                    readme_content = f.read()
                
                # 替换或添加实验部分
                import re
                pattern = r'<!-- ML-EXPERIMENTS:START -->.*?<!-- ML-EXPERIMENTS:END -->'
                if re.search(pattern, readme_content, re.DOTALL):
                    readme_content = re.sub(pattern, metrics_section, readme_content, flags=re.DOTALL)
                else:
                    readme_content += '\n\n' + metrics_section
                
                with open(readme_path, 'w', encoding='utf-8') as f:
                    f.write(readme_content)
                
                print("✅ README实验指标已更新")
        
        except Exception as e:
            print(f"❌ 更新README时出错: {e}")

def main():
    """主函数"""
    tracker = MLExperimentTracker()
    
    # 获取文件变更信息
    files_changed = os.getenv('CLAUDE_FILE_PATHS', '')
    
    # 记录实验
    experiment = tracker.log_experiment(files_changed)
    
    # 更新README
    tracker.update_readme_metrics()
    
    print(f"🎯 ML实验追踪完成: {experiment['experiment_type']}")

if __name__ == "__main__":
    main()