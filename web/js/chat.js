// ========================================
// 智学助手 SmartStudy Agent — 对话模块
// ========================================

// 用于生成演示回复的知识
const DEMO_RESPONSES = {
  speedRead: {
    keywords: ['课件', '总结', '重点', '提取', '文件', '资料', '速读'],
    response: `好的！我已经分析了这份资料，以下是提取的知识卡片：

---

## 📖 资料分析结果

### 📊 概览
- **文档类型**：教学课件
- **知识点数量**：12个
- **难度分布**：简单 3个 | 中等 6个 | 困难 3个

### 🔑 核心知识点

| # | 知识点 | 难度 | 重要度 |
|---|--------|------|--------|
| 1 | {概念1} | 🟢 简单 | ★★★ |
| 2 | {概念2} | 🟡 中等 | ★★★ |
| 3 | {概念3} | 🔴 困难 | ★★☆ |

### 📋 层次化摘要
1. **概述层**：本章主要讨论...
2. **核心层**：重点掌握...
3. **扩展层**：了解...

> 💡 完整知识卡片已保存到知识库，你可以随时问我这些知识点的相关问题！`
  },

  smartQA: {
    keywords: ['什么是', '为什么', '如何', '解释', '怎么', '区别', '意思'],
    response: `好问题！让我来分层解答：

---

## ❓ 关于"{topic}"

### 🎯 简要回答
{simple_answer}

### 📖 详细推导
{detailed_explanation}

核心要点：
1. **要点一**：...
2. **要点二**：...
3. **要点三**：...

### 💡 延伸思考
- 🤔 思考题：如果改变{条件}，会有什么影响？
- 📚 推荐阅读：《大学物理（上）》第{x}章
- 🔗 实际应用：该原理在{场景}中有广泛应用

> 📌 *以上内容参考自知识库 KP-xxx，基于《大学物理（上）》知识体系*`
  },

  reviewPlan: {
    keywords: ['计划', '复习', '备考', '规划', '安排', '考试'],
    response: `好的！根据你的情况，我为你制定了复习计划：

---

## 📅 {课程名称} 复习计划

**目标日期**：2026-07-22（14天后）
**每日时长**：2.5小时

### 📊 四阶段规划

| 阶段 | 日期 | 天数 | 任务 |
|------|------|------|------|
| 🔵 基础巩固 | 7/8-7/13 | 6天 | 逐章复习，覆盖全部知识点 |
| 🟡 重点突破 | 7/14-7/17 | 4天 | 攻克难点和薄弱环节 |
| 🟠 综合演练 | 7/18-7/20 | 3天 | 综合题训练+模拟 |
| 🔴 冲刺 | 7/21 | 1天 | 查漏补缺 |

### 📋 Day 1-2 详细安排
**Day 1（7/8）**：
- [ ] 第1章 绪论（1h） — 复习AI定义、图灵测试
- [ ] 第2章 搜索技术-上（1h） — BFS/DFS/A*
- [ ] 当日回顾（30min）

> 💡 计划会根据你的实际进度动态调整，随时告诉我进展！`
  },

  noteOrganizer: {
    keywords: ['笔记', '整理', '归纳', '总结一下', '梳理'],
    response: `已整理完毕！以下是将你的零散笔记结构化后的结果：

---

## 📝 结构化笔记

### 一、{主题1}

#### 核心概念
- **定义**：...
- **关键特征**：...

#### 要点梳理
1. ...
2. ...
3. ...

#### 易错提醒
⚠️ 注意区分 X 和 Y...

---

### 📇 复习闪卡（共生成 5 张）

**Q1**: {问题1}
**A1**: {答案1}

**Q2**: {问题2}
**A2**: {答案2}

---

> 📁 结构化笔记已保存，闪卡可导入 Anki 使用`
  },

  ddlTracker: {
    keywords: ['作业', '截止', 'DDL', '什么时候交', '任务', '考试时间'],
    response: `我来帮你梳理当前的 DDL：

---

## ⏰ DDL 时间线

### 🔴 本周紧急

| 优先级 | 截止 | 课程 | 任务 | 剩余 | 预估 |
|--------|------|------|------|------|------|
| 🔴 高 | 7/10 | 大学物理 | 实验三报告 | 2天 | 4h |
| 🟡 中 | 7/12 | 高等数学 | 编程作业 | 4天 | 3h |

### 🟡 下周关注

| 优先级 | 截止 | 课程 | 任务 | 剩余 | 预估 |
|--------|------|------|------|------|------|
| 🟡 中 | 7/15 | 英语 | 阅读作业 | 7天 | 2h |

### ⚠️ 冲突检测
- 7/10 有 2 个任务到期，建议优先完成实验三报告
- 总预估工作量：9h，剩余可支配时间：12h ✅

> 🔔 我已设置提前3天和1天的提醒，放心备考！`
  }
};

// 根据用户输入匹配响应类型
function matchResponseType(input) {
  const lower = input.toLowerCase();
  for (const [type, config] of Object.entries(DEMO_RESPONSES)) {
    for (const kw of config.keywords) {
      if (lower.includes(kw)) return type;
    }
  }
  return 'general';
}

function generateResponse(input) {
  const type = matchResponseType(input);
  if (DEMO_RESPONSES[type]) {
    let resp = DEMO_RESPONSES[type].response;
    // Extract a topic from the input
    const topic = input.replace(/[？?。。！!，,]/g, '').substring(0, 30);

    if (type === 'smartQA') {
      resp = resp.replace('{topic}', topic);
      resp = resp.replace('{simple_answer}', `这是对"${topic}"的简要回答。该概念是大学物理（上）课程中的重要知识点，理解它对后续学习非常关键。`);
      resp = resp.replace('{detailed_explanation}', `让我们深入理解"${topic}"。首先回顾一下相关的前置知识（物理量的定义和基本定律），然后从定义出发，逐步推导其核心原理。在这个过程中，我们需要特别注意以下几点...`);
    }
    if (type === 'reviewPlan') {
      resp = resp.replace('{课程名称}', '《大学物理（上）》');
    }
    return resp;
  }

  // General response
  return `你好！我是智学助手 🧠

我注意到你提到了"**${input.substring(0, 40)}${input.length > 40 ? '...' : ''}**"

我可以帮你：
- 📖 **资料速读** — 上传课件，提取知识卡片
- ❓ **智能答疑** — 任何知识性问题，分层解答
- 📅 **复习规划** — 制定科学的备考计划
- 📝 **笔记整理** — 碎片化笔记变结构化知识
- ⏰ **DDL管理** — 追踪作业和考试时间

请告诉我你具体需要什么帮助？`;
}

// Chat functionality
function initChat() {
  const messagesEl = document.getElementById('chatMessages');
  const inputEl = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const quickBtns = document.querySelectorAll('.quick-btn');

  // Send message
  function sendMessage(text) {
    if (!text.trim()) return;

    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.innerHTML = `
      <div class="message-avatar">👤</div>
      <div class="message-content"><p>${escapeHTML(text)}</p></div>
    `;
    messagesEl.appendChild(userMsg);

    // Scroll to bottom
    messagesEl.scrollTop = messagesEl.scrollHeight;

    // Clear input
    inputEl.value = '';
    inputEl.style.height = 'auto';

    // Simulate typing delay then respond
    setTimeout(() => {
      const response = generateResponse(text);
      const agentMsg = document.createElement('div');
      agentMsg.className = 'message agent';
      agentMsg.innerHTML = `
        <div class="message-avatar">🧠</div>
        <div class="message-content">${formatMarkdown(response)}</div>
      `;
      messagesEl.appendChild(agentMsg);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }, 800 + Math.random() * 1200);
  }

  // Event listeners
  sendBtn.addEventListener('click', () => sendMessage(inputEl.value));

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputEl.value);
    }
  });

  // Auto-resize textarea
  inputEl.addEventListener('input', () => {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 150) + 'px';
  });

  // Quick action buttons
  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.dataset.prompt;
      inputEl.value = prompt;
      sendMessage(prompt);
    });
  });

  // File attach (demo)
  document.getElementById('attachBtn').addEventListener('click', () => {
    document.getElementById('fileInput').click();
  });

  document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      sendMessage(`请帮我分析这个文件：${file.name}（演示模式：文件已接收，智学助手正在分析中…）`);
    }
  });
}

// Simple HTML escaping
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Simple markdown-to-HTML conversion
function formatMarkdown(md) {
  if (!md) return '';
  let html = escapeHTML(md);

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');
  // Tables (simplified)
  html = html.replace(/\|(.+)\|/g, (match) => {
    const cells = match.split('|').filter(c => c.trim());
    if (cells.every(c => /^[-:]+$/.test(c.trim()))) return ''; // Separator row
    const tag = match.includes('|---') ? '' :
      '<tr>' + cells.map(c => {
        const trimmed = c.trim();
        return (/^\s*[-:]+\s*$/.test(trimmed)) ? '' : `<td>${trimmed}</td>`;
      }).join('') + '</tr>';
    return tag;
  });
  // Line breaks
  html = html.replace(/\n/g, '<br>');

  return html;
}

document.addEventListener('DOMContentLoaded', initChat);
