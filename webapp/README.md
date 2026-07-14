# 🎓 智学助手 SmartStudy — Web 版

大学物理（上）AI 学习伴侣，基于 DeepSeek 大模型驱动，覆盖 12 章 52 个知识点。

## 五大核心能力

| 能力 | 说明 | 使用方式 |
|------|------|---------|
| 📖 资料速读 | 上传课件/笔记，自动提取知识点 | 展开"上传课件"→选择文件→点击分析 |
| ❓ 智能答疑 | 三层递进式解答物理问题 | 直接输入问题，如"牛顿第二定律怎么理解？" |
| 📅 复习规划 | 根据考试日期生成复习计划 | "帮我制定大学物理复习计划，7月30日考试" |
| 📝 笔记整理 | 零散笔记→结构化笔记+闪卡 | "帮我把这些笔记整理一下"并粘贴内容 |
| ⏰ DDL管理 | 追踪作业和考试截止日期 | "物理作业7月20日截止，帮我记一下" |

## 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 配置 API Key

编辑 `.streamlit/secrets.toml`，将 `your-deepseek-api-key-here` 替换为你的 DeepSeek API Key：

```toml
DEEPSEEK_API_KEY = "sk-xxxxxxxxxxxxxxxx"
```

### 3. 启动应用

```bash
cd webapp
streamlit run app.py
```

浏览器会自动打开 `http://localhost:8501`

## 部署到 Streamlit Cloud

1. 将项目推送到 GitHub 公开仓库
2. 访问 [share.streamlit.io](https://share.streamlit.io)
3. 连接你的 GitHub 仓库，选择 `webapp/` 目录
4. 在 Dashboard → Settings → Secrets 中添加：
   ```
   DEEPSEEK_API_KEY = "sk-xxxxxxxxxxxxxxxx"
   ```
5. 部署后获得公网 URL，发给老师即可

## 获取 DeepSeek API Key

1. 访问 [platform.deepseek.com](https://platform.deepseek.com)
2. 注册/登录账号
3. 在 API Keys 页面创建 Key
4. 充值少量金额（DeepSeek 价格低廉，几块钱可测很久）

## 项目结构

```
webapp/
├── app.py               # 主应用入口
├── config.py             # 配置管理
├── system_prompt.py      # 系统提示词 + 知识库
├── tools.py              # Function Calling 工具
├── requirements.txt      # 依赖列表
├── .streamlit/
│   └── secrets.toml      # API Key 配置
└── README.md             # 本文件
```

## 技术栈

- **框架**: Streamlit
- **LLM**: DeepSeek API (deepseek-chat)
- **知识库**: 52 张知识卡片嵌入系统提示词 (~8K tokens)
- **工具系统**: OpenAI-compatible Function Calling

## 给老师的使用说明

- 在聊天框中直接输入问题即可开始对话
- 所有物理问题的回答会标注知识来源（如"根据《大学物理》第2章 KP-006"）
- 侧边栏显示学习进度和 DDL 概览
- 点击"清除对话"可以重新开始
