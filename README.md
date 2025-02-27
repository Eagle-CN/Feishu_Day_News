# Feishu_Day_News
基于飞书API和AI功能的每日新闻采集播报

## 飞书应用权限设置步骤

1. 访问 [飞书开放平台](https://open.feishu.cn/app)
2. 选择你的应用
3. 点击左侧"权限管理"，搜索并添加以下权限：
   - `bitable:record:read` (读取多维表格记录)
   - `bitable:record:write` (写入多维表格记录)
   - `bitable:table:read` (读取多维表格元信息)
   - `bitable:table:write` (写入多维表格元信息)
   - `bitable:app:read` (读取多维表格应用)
   - `bitable:app:write` (写入多维表格应用)

4. 点击左侧"安全设置"：
   - 添加 `http://localhost:3000` 到"网页域名"
   - 添加 `https://open.feishu.cn` 到"重定向 URL"

5. 点击左侧"版本管理与发布"：
   - 创建新版本
   - 填写更新说明（如："添加多维表格权限"）
   - 发布版本

6. **重要**：点击左侧"应用发布"：
   - 选择"企业自建应用"
   - 点击"创建版本"
   - 提交发布申请

7. **最重要**：重新安装应用到工作区
   - 点击右上角"安装应用"
   - 选择要安装的工作区
   - 确认所有权限
   - 等待管理员审批（如果你不是管理员）

8. 打开多维表格，点击右上角"..."：
   - 选择"添加协作者"
   - 搜索并选择你的应用
   - 授予"编辑者"权限

9. 验证权限：
   - 访问 http://localhost:3000/api/check-auth 确认权限正常
   - 如果返回 403，请检查上述步骤是否都完成
