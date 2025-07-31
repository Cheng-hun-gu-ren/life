# 留言板设置指南

## ✅ 前端配置已完成

前端代码已配置完成，使用以下信息：
- **Form Endpoint**: `https://formspree.io/f/mgvzzlog`
- **reCAPTCHA Site Key**: `6Ld4e5UrAAAAAE0VzEqhNEvSnWbA1j0AEykHXrBN`

## 🔧 需要在Formspree后台完成的配置

### 第一步：登录Formspree并找到你的表单

1. **访问Formspree**
   - 登录 https://formspree.io/
   - 找到表单ID为 `mgvzzlog` 的表单

### 第二步：配置reCAPTCHA Secret Key

1. **进入表单设置**
   - 点击你的表单
   - 进入 "Settings" 标签页

2. **启用reCAPTCHA**
   - 找到 "CAPTCHA" 或"Spam Protection" 部分
   - 确保CAPTCHA已启用
   - 点击 "Adjust settings" 或 "Configure"

3. **选择Custom reCAPTCHA**
   - 在CAPTCHA solution中选择 "Custom reCAPTCHA"
   - 在提供的字段中粘贴你的Secret Key：
   ```
   6Ld4e5UrAAAAAOuxU-bgtIRXBeWJKrg6RQ27WK8s
   ```
   - 保存设置

### 第三步：验证配置

1. **检查设置**
   - 确认表单接收邮箱是：`224040166@link.cuhk.edu.cn`
   - 确认reCAPTCHA已正确配置
   - 保存所有设置

## 🎯 配置摘要

| 配置项 | 值 | 位置 |
|--------|----|----|
| Form Endpoint | `https://formspree.io/f/mgvzzlog` | ✅ 已配置在HTML中 |
| reCAPTCHA Site Key | `6Ld4e5UrAAAAAE0VzEqhNEvSnWbA1j0AEykHXrBN` | ✅ 已配置在HTML中 |
| reCAPTCHA Secret Key | `6Ld4e5UrAAAAAOuxU-bgtIRXBeWJKrg6RQ27WK8s` | ⚠️ 需要在Formspree后台配置 |
| 接收邮箱 | `224040166@link.cuhk.edu.cn` | ⚠️ 需要在Formspree后台确认 |

## 第三步：测试表单

1. **本地测试**
   - 在浏览器中打开 `pages/contact/index.html`
   - 填写留言表单
   - 完成reCAPTCHA验证
   - 点击发送

2. **检查邮件**
   - 查看 `224040166@link.cuhk.edu.cn` 邮箱
   - 应该会收到包含以下信息的邮件：
     - 昵称（如果填写了）
     - 邮箱（如果填写了）
     - 留言内容
     - 提交时间

## 第四步：自定义设置（可选）

1. **邮件模板**
   - 在Formspree控制面板中可以自定义邮件模板
   - 设置邮件主题格式
   - 自定义收到留言的通知格式

2. **重定向页面**
   - 可以设置表单提交成功后的跳转页面
   - 或者保持当前的弹窗提示方式

3. **垃圾邮件过滤**
   - 启用Formspree的额外垃圾邮件过滤功能
   - 设置黑名单关键词

## 功能特点

✅ **已实现的功能：**
- 匿名留言（昵称和邮箱可选）
- 必填留言内容验证
- reCAPTCHA垃圾邮件防护
- 玻璃态现代化UI设计
- 表单验证和错误提示
- 提交成功的动画反馈
- 响应式移动端适配
- 加载状态指示

✅ **安全特性：**
- 你的邮箱地址不在前端代码中暴露
- reCAPTCHA防止自动化垃圾邮件
- 客户端和服务端双重验证
- HTTPS加密传输

## 免费配额

- **Formspree免费版**：每月50次提交
- **reCAPTCHA**：完全免费
- 对于个人网站来说，这个配额通常足够使用

## 故障排除

如果遇到问题：
1. 检查浏览器控制台是否有错误信息
2. 确认Formspree表单ID和reCAPTCHA站点密钥是否正确
3. 检查域名是否已添加到reCAPTCHA设置中
4. 查看Formspree控制面板的提交日志

完成设置后，访问者就可以通过联系方式页面给你发送匿名留言了！