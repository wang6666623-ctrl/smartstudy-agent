---
name: speed-read
description: 资料速读 — 上传课件/论文/教材，自动提取知识点、生成层次化摘要和知识卡片
model: opus
tools:
  - Read
  - Write
  - Bash
  - Grep
---

# 资料速读 Skill

快速解析教学文档，提取结构化知识点，生成知识卡片和思维导图大纲。

## 触发条件
- 用户上传或指定文件路径（PDF/PPTX/DOCX/MD）
- 用户说"帮我看看这个"、"总结一下"、"提取重点"

## 处理流程

### Step 1: 文件解析
- PDF：使用 Read 工具直接读取
- PPTX：使用 Bash 解压并提取 XML 文本
- DOCX：使用 Bash + python-docx 提取文本
- MD/TXT：直接 Read

### Step 2: 知识提取
调用 `prompts/extraction.md` 中的提示词进行：
- 章节结构识别
- 概念提取（名称、定义、要点、示例）
- 难点标注

### Step 3: 结构化输出
生成以下产出物并写入文件：
1. **知识卡片** → `knowledge-base/templates/{课程名}/knowledge-cards.md`
2. **层次化摘要** → `knowledge-base/templates/{课程名}/summary.md`
3. **思维导图大纲** → `knowledge-base/templates/{课程名}/mindmap.md`

### Step 4: 更新索引
将新知识点注册到 `knowledge-base/index.json`

## 输出示例

```markdown
# 📖 《人工智能导论》第三章 知识卡片

## KP-001: 启发式搜索
- **定义**：利用启发式信息引导搜索方向，提高搜索效率的方法
- **要点**：
  1. 启发式函数 h(n) 估算从节点 n 到目标的最小代价
  2. A* 算法 = g(n) + h(n)，当 h(n) 可纳时保证最优
  3. h(n) ≤ h*(n) 时可纳
- **难度**：中等
- **前置知识**：无信息搜索（BFS/DFS）
- **关联**：贪心搜索、IDA*

---
```

## 注意事项
- 优先保留原始定义和公式，不做改写
- 图表内容用文字描述保留
- 标注不确定的内容为 `[待确认]`
