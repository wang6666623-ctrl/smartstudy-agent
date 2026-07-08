// ========================================
// 智学助手 SmartStudy Agent — 知识库浏览器
// ========================================

// 知识库数据（从 knowledge-base 目录加载的静态映射）
const KNOWLEDGE_BASE = {
  "ai-intro": {
    name: "人工智能导论",
    chapters: [
      {
        id: "ch01", title: "第1章：绪论",
        points: [
          { id: "kp-001", name: "人工智能的定义", difficulty: "easy" },
          { id: "kp-002", name: "图灵测试", difficulty: "easy" },
          { id: "kp-003", name: "人工智能发展简史", difficulty: "easy" },
          { id: "kp-004", name: "中文房间实验", difficulty: "medium" }
        ]
      },
      {
        id: "ch02", title: "第2章：搜索技术",
        points: [
          { id: "kp-005", name: "无信息搜索（盲目搜索）", difficulty: "medium" },
          { id: "kp-006", name: "启发式搜索", difficulty: "medium" },
          { id: "kp-007", name: "A* 搜索算法", difficulty: "hard" },
          { id: "kp-008", name: "启发式函数设计", difficulty: "medium" },
          { id: "kp-009", name: "IDA* 与迭代加深搜索", difficulty: "hard" },
          { id: "kp-010", name: "对抗搜索（博弈树搜索）", difficulty: "hard" }
        ]
      },
      {
        id: "ch03", title: "第3章：知识表示与推理",
        points: [
          { id: "kp-011", name: "知识表示概述", difficulty: "medium" },
          { id: "kp-012", name: "一阶谓词逻辑", difficulty: "hard" },
          { id: "kp-013", name: "语义网络", difficulty: "medium" },
          { id: "kp-014", name: "产生式系统", difficulty: "medium" },
          { id: "kp-015", name: "专家系统", difficulty: "medium" }
        ]
      },
      {
        id: "ch04", title: "第4章：机器学习基础",
        points: [
          { id: "kp-016", name: "机器学习概述", difficulty: "medium" },
          { id: "kp-017", name: "监督学习", difficulty: "medium" },
          { id: "kp-018", name: "无监督学习", difficulty: "medium" },
          { id: "kp-019", name: "强化学习", difficulty: "hard" },
          { id: "kp-020", name: "过拟合与正则化", difficulty: "medium" },
          { id: "kp-021", name: "模型评估方法", difficulty: "medium" },
          { id: "kp-022", name: "决策树与随机森林", difficulty: "medium" },
          { id: "kp-023", name: "支持向量机(SVM)", difficulty: "hard" }
        ]
      },
      {
        id: "ch05", title: "第5章：深度学习",
        points: [
          { id: "kp-024", name: "深度学习概述", difficulty: "medium" },
          { id: "kp-025", name: "神经网络基础", difficulty: "hard" },
          { id: "kp-026", name: "优化算法", difficulty: "hard" },
          { id: "kp-027", name: "卷积神经网络(CNN)", difficulty: "hard" },
          { id: "kp-028", name: "Transformer架构", difficulty: "hard" },
          { id: "kp-029", name: "生成对抗网络(GAN)", difficulty: "hard" },
          { id: "kp-030", name: "扩散模型", difficulty: "hard" }
        ]
      },
      {
        id: "ch06", title: "第6章：自然语言处理",
        points: [
          { id: "kp-031", name: "大语言模型(LLM)", difficulty: "medium" },
          { id: "kp-032", name: "BERT与预训练", difficulty: "hard" },
          { id: "kp-033", name: "词向量与文本表示", difficulty: "medium" },
          { id: "kp-034", name: "序列到序列模型(Seq2Seq)", difficulty: "medium" },
          { id: "kp-035", name: "RAG与检索增强生成", difficulty: "medium" }
        ]
      },
      {
        id: "ch07", title: "第7章：计算机视觉",
        points: [
          { id: "kp-036", name: "计算机视觉概述", difficulty: "medium" },
          { id: "kp-037", name: "目标检测", difficulty: "hard" },
          { id: "kp-038", name: "图像分割", difficulty: "hard" },
          { id: "kp-039", name: "多模态模型", difficulty: "medium" }
        ]
      },
      {
        id: "ch08", title: "第8章：大模型与AIGC",
        points: [
          { id: "kp-040", name: "GPT系列技术演进", difficulty: "medium" },
          { id: "kp-041", name: "提示工程", difficulty: "medium" },
          { id: "kp-042", name: "AI Agent（智能体）", difficulty: "hard" },
          { id: "kp-043", name: "AIGC应用生态", difficulty: "easy" },
          { id: "kp-044", name: "大模型安全与伦理", difficulty: "medium" },
          { id: "kp-045", name: "知识图谱", difficulty: "medium" }
        ]
      }
    ]
  },
  "general": {
    name: "通用学习方法论",
    chapters: [
      {
        id: "gen01", title: "高效学习方法",
        points: [
          { id: "gp-001", name: "费曼学习法", difficulty: "easy" },
          { id: "gp-002", name: "间隔重复", difficulty: "easy" },
          { id: "gp-003", name: "主动回忆", difficulty: "easy" },
          { id: "gp-004", name: "番茄工作法", difficulty: "easy" }
        ]
      },
      {
        id: "gen02", title: "时间管理与自律",
        points: [
          { id: "gp-005", name: "时间管理四象限", difficulty: "easy" },
          { id: "gp-006", name: "SMART目标法", difficulty: "easy" },
          { id: "gp-007", name: "康奈尔笔记法", difficulty: "easy" },
          { id: "gp-008", name: "心流状态与深度学习", difficulty: "medium" }
        ]
      }
    ]
  }
};

// 知识点详细内容（部分静态数据，完整内容在 knowledge-base 文件中）
const KP_DETAILS = {
  "kp-001": { definition: "人工智能（Artificial Intelligence, AI）是研究、开发用于模拟、延伸和扩展人的智能的理论、方法、技术及应用系统的一门新的技术科学。", keyPoints: ["AI的目标是让机器能像人一样思考、学习、决策", "强AI vs 弱AI：强AI具备通用智能，弱AI专注于特定任务", "图灵测试是判断机器是否具有智能的经典方法", "当前AI主要是弱AI（狭义AI）"], prerequisites: ["无"], related: ["图灵测试(KP-002)", "AI发展史(KP-003)"] },
  "kp-007": { definition: "结合了实际代价 g(n) 和启发式估计 h(n) 的最优优先搜索算法，f(n) = g(n) + h(n)。", keyPoints: ["f(n) 是经过节点n的最优路径的估计总代价", "当 h(n) ≤ h*(n)（可纳），A*保证找到最优解", "当 h(n) 满足一致性（单调性），A*不会重复扩展节点", "A*是最优的：在可纳启发式下，不会扩展比必要更多的节点"], prerequisites: ["无信息搜索(KP-005)", "启发式搜索(KP-006)"], related: ["IDA*(KP-009)", "启发式函数设计(KP-008)"] },
  "kp-016": { definition: "机器学习是通过数据经验自动改进计算机算法性能的研究领域。", keyPoints: ["三大范式：监督学习、无监督学习、强化学习", "核心三要素：数据、模型、优化算法", "汤姆·米切尔的经典定义：从经验E中学习，在任务T上以性能度量P提升", "与传统编程的区别：传统编程是'规则+数据→输出'，ML是'数据+答案→规则'"], prerequisites: ["AI定义(KP-001)"], related: ["监督学习(KP-017)", "无监督学习(KP-018)", "强化学习(KP-019)"] },
  "kp-042": { definition: "能够自主感知环境、制定计划、调用工具并执行行动来完成目标的AI系统。", keyPoints: ["核心组成：LLM大脑 + 工具调用 + 记忆系统 + 规划模块", "ReAct模式：Reasoning（推理）+ Acting（行动）交替进行", "工具使用：搜索、代码执行、API调用、数据库查询", "记忆类型：短期记忆（对话上下文）和长期记忆（外部存储）", "多Agent协作：多个Agent分工协作完成复杂任务"], prerequisites: ["大语言模型(KP-031)", "提示工程(KP-041)"], related: ["LLM(KP-031)", "提示工程(KP-041)", "RAG(KP-035)"] },
};

const DIFFICULTY_MAP = { easy: '简单', medium: '中等', hard: '困难' };
const DIFFICULTY_CLASS = { easy: 'badge-easy', medium: 'badge-medium', hard: 'badge-hard' };

function initKB() {
  const treeEl = document.getElementById('kbTree');
  const detailEl = document.getElementById('kbDetail');
  const searchInput = document.getElementById('kbSearchInput');

  // Build tree for each course
  let treeHTML = '';
  for (const [courseId, course] of Object.entries(KNOWLEDGE_BASE)) {
    treeHTML += `<div class="kb-tree-item chapter" style="color: var(--accent-hover); font-size: 1rem;">📘 ${course.name}</div>`;
    for (const chapter of course.chapters) {
      treeHTML += `<div class="kb-tree-item chapter">${chapter.title}</div>`;
      for (const kp of chapter.points) {
        treeHTML += `<div class="kb-tree-item kp-item" data-kp="${kp.id}" data-course="${courseId}">${kp.id.toUpperCase()}: ${kp.name}</div>`;
      }
    }
  }
  treeEl.innerHTML = treeHTML;

  // Click handler for knowledge points
  treeEl.addEventListener('click', (e) => {
    const item = e.target.closest('.kp-item');
    if (!item) return;

    treeEl.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
    item.classList.add('active');

    const kpId = item.dataset.kp;
    const detail = KP_DETAILS[kpId];
    const kpData = findKPData(kpId);

    if (detail && kpData) {
      detailEl.innerHTML = `
        <div class="kb-detail-content">
          <h3>${kpId.toUpperCase()}: ${kpData.name}</h3>
          <span class="badge ${DIFFICULTY_CLASS[kpData.difficulty]}">${DIFFICULTY_MAP[kpData.difficulty]}</span>

          <div class="field" style="margin-top: 16px;">
            <div class="field-label">📖 定义</div>
            <div class="field-value">${detail.definition}</div>
          </div>

          <div class="field">
            <div class="field-label">🔑 核心要点</div>
            <div class="field-value">
              <ol>
                ${detail.keyPoints.map(p => `<li>${p}</li>`).join('')}
              </ol>
            </div>
          </div>

          <div class="field">
            <div class="field-label">📋 前置知识</div>
            <div class="field-value">${detail.prerequisites.join('、') || '无'}</div>
          </div>

          <div class="field">
            <div class="field-label">🔗 关联知识点</div>
            <div class="field-value">${detail.related.join('、') || '无'}</div>
          </div>
        </div>
      `;
    } else {
      detailEl.innerHTML = `
        <div class="kb-detail-content">
          <h3>${kpId.toUpperCase()}: ${kpData ? kpData.name : '未知知识点'}</h3>
          <p style="color: var(--text-muted);">详细内容请查看 knowledge-base/templates/ 目录下的完整知识卡片文件。</p>
        </div>
      `;
    }
  });

  // Search
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const items = treeEl.querySelectorAll('.kp-item');
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? '' : 'none';
    });
    // Show/hide chapters based on whether they have visible children
    const chapters = treeEl.querySelectorAll('.chapter');
    chapters.forEach(ch => {
      let next = ch.nextElementSibling;
      let hasVisible = false;
      while (next && !next.classList.contains('chapter')) {
        if (next.style.display !== 'none') hasVisible = true;
        next = next.nextElementSibling;
      }
      ch.style.display = query ? (hasVisible ? '' : 'none') : '';
    });
  });
}

function findKPData(kpId) {
  for (const course of Object.values(KNOWLEDGE_BASE)) {
    for (const chapter of course.chapters) {
      for (const kp of chapter.points) {
        if (kp.id === kpId) return kp;
      }
    }
  }
  return null;
}

// Export for use by chat.js
window.KNOWLEDGE_BASE = KNOWLEDGE_BASE;
window.KP_DETAILS = KP_DETAILS;
window.findKPData = findKPData;

document.addEventListener('DOMContentLoaded', initKB);
