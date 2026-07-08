# 🧠 智学助手 (SmartStudy Agent)

> 面向大学生的多功能AI学习伴侣智能体
>
> 《人工智能导论》课程设计大作业 — 备选方向一：学习辅助与日常效率类 Agent/Skill

---

## 项目简介

智学助手是一个基于大语言模型的AI学习伴侣，专为大学生日常学习场景设计。它具备五大核心能力，帮助学生更高效地学习。

### ⚡ 五大能力

| 能力 | 说明 |
|------|------|
| 📖 **资料速读** | 上传课件/论文，自动提取知识点和摘要 |
| ❓ **智能答疑** | 基于知识库的分层解答，引导式教学 |
| 📅 **复习规划** | 四阶段科学备考计划，自适应调整 |
| 📝 **笔记整理** | 碎片化笔记→结构化知识+闪卡 |
| ⏰ **DDL管理** | 时间线+优先级排序+冲突检测 |

### 🧠 智能体特征

| 特征 | 实现 |
|------|------|
| 自主感知 | 意图路由自动识别用户需求 |
| 工具调用 | 文件处理、搜索、知识库、日历管理 |
| 规划决策 | 复杂任务自动拆解为子任务序列 |
| 记忆能力 | 用户画像+学习日志+对话历史持久化 |

## 快速开始

### Claude Code 使用
```
用 study-assistant 帮我分析这个课件
```

### Web 界面
直接在浏览器打开 `web/index.html`

## 项目结构

```
├── .claude/
│   ├── agents/          # 智能体定义（3个Agent）
│   └── skills/          # 能力模块（5个Skill）
├── prompts/             # 分层提示词系统（7个提示词文件）
├── knowledge-base/      # 三层知识库（索引+内容+关系图）
├── memory/              # 用户记忆模块
├── web/                 # Web演示界面
├── tests/               # 测试用例与结果
├── docs/                # 设计文档与用户指南
└── report/              # 课程设计报告
```

## 技术栈

- **LLM 基座**：Claude API (Fable 5)
- **智能体框架**：Claude Code Agent + Skill
- **知识库**：Markdown + JSON 结构化存储
- **Web 界面**：纯静态 HTML/CSS/JS（暗色主题）
- **记忆系统**：JSON 文件持久化

## 可访问链接

- 🌐 Web 演示：[https://wang6666623-ctrl.github.io/smartstudy-agent/](https://wang6666623-ctrl.github.io/smartstudy-agent/)
- 📁 项目仓库：[https://github.com/wang6666623-ctrl/smartstudy-agent](https://github.com/wang6666623-ctrl/smartstudy-agent)

---

*© 2026 智学助手 | 华南理工大学 人工智能导论 课程设计*
