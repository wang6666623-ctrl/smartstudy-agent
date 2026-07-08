// ========================================
// 智学助手 SmartStudy Agent — 知识库浏览器
// ========================================

// 知识库数据（大学物理 上）
const KNOWLEDGE_BASE = {
  "university-physics-1": {
    name: "大学物理（上）",
    chapters: [
      {
        id: "ch01", title: "第1章：质点运动学",
        points: [
          { id: "kp-001", name: "参考系与坐标系", difficulty: "easy" },
          { id: "kp-002", name: "位置矢量与位移", difficulty: "easy" },
          { id: "kp-003", name: "速度与加速度", difficulty: "medium" },
          { id: "kp-004", name: "典型运动", difficulty: "medium" }
        ]
      },
      {
        id: "ch02", title: "第2章：质点动力学",
        points: [
          { id: "kp-005", name: "牛顿第一定律（惯性定律）", difficulty: "easy" },
          { id: "kp-006", name: "牛顿第二定律", difficulty: "medium" },
          { id: "kp-007", name: "牛顿第三定律", difficulty: "easy" },
          { id: "kp-008", name: "常见力与受力分析", difficulty: "medium" },
          { id: "kp-009", name: "非惯性系与惯性力", difficulty: "hard" }
        ]
      },
      {
        id: "ch03", title: "第3章：功和能",
        points: [
          { id: "kp-010", name: "功与功率", difficulty: "medium" },
          { id: "kp-011", name: "动能定理", difficulty: "medium" },
          { id: "kp-012", name: "保守力与势能", difficulty: "medium" },
          { id: "kp-013", name: "功能原理与机械能守恒", difficulty: "medium" },
          { id: "kp-014", name: "质心运动定理", difficulty: "medium" }
        ]
      },
      {
        id: "ch04", title: "第4章：动量与角动量",
        points: [
          { id: "kp-015", name: "动量定理与动量守恒", difficulty: "medium" },
          { id: "kp-016", name: "变质量系统", difficulty: "hard" },
          { id: "kp-017", name: "角动量定理", difficulty: "medium" },
          { id: "kp-018", name: "碰撞", difficulty: "medium" }
        ]
      },
      {
        id: "ch05", title: "第5章：刚体力学",
        points: [
          { id: "kp-019", name: "刚体运动学", difficulty: "medium" },
          { id: "kp-020", name: "转动定律", difficulty: "medium" },
          { id: "kp-021", name: "转动惯量", difficulty: "medium" },
          { id: "kp-022", name: "刚体转动动能与功", difficulty: "medium" },
          { id: "kp-023", name: "角动量守恒（刚体）", difficulty: "medium" }
        ]
      },
      {
        id: "ch06", title: "第6章：流体力学",
        points: [
          { id: "kp-024", name: "流体静力学", difficulty: "medium" },
          { id: "kp-025", name: "理想流体的伯努利方程", difficulty: "medium" },
          { id: "kp-026", name: "黏性流体与雷诺数", difficulty: "hard" }
        ]
      },
      {
        id: "ch07", title: "第7章：振动",
        points: [
          { id: "kp-027", name: "简谐振动", difficulty: "medium" },
          { id: "kp-028", name: "阻尼振动", difficulty: "medium" },
          { id: "kp-029", name: "受迫振动与共振", difficulty: "medium" },
          { id: "kp-030", name: "简谐振动的合成", difficulty: "medium" }
        ]
      },
      {
        id: "ch08", title: "第8章：波动",
        points: [
          { id: "kp-031", name: "机械波的基本概念", difficulty: "medium" },
          { id: "kp-032", name: "简谐波（平面简谐波）", difficulty: "medium" },
          { id: "kp-033", name: "波的叠加与干涉", difficulty: "medium" },
          { id: "kp-034", name: "驻波", difficulty: "medium" }
        ]
      },
      {
        id: "ch09", title: "第9章：光学",
        points: [
          { id: "kp-035", name: "几何光学基础", difficulty: "easy" },
          { id: "kp-036", name: "光的干涉", difficulty: "hard" },
          { id: "kp-037", name: "光的偏振", difficulty: "medium" },
          { id: "kp-038", name: "光的衍射", difficulty: "hard" },
          { id: "kp-039", name: "光栅衍射", difficulty: "hard" }
        ]
      },
      {
        id: "ch10", title: "第10章：气体动理论",
        points: [
          { id: "kp-040", name: "理想气体模型与压强公式", difficulty: "medium" },
          { id: "kp-041", name: "温度与能量均分定理", difficulty: "medium" },
          { id: "kp-042", name: "麦克斯韦速率分布", difficulty: "hard" },
          { id: "kp-043", name: "平均自由程与输运过程", difficulty: "hard" }
        ]
      },
      {
        id: "ch11", title: "第11章：热力学基础",
        points: [
          { id: "kp-044", name: "热力学第一定律", difficulty: "medium" },
          { id: "kp-045", name: "热力学过程分析", difficulty: "medium" },
          { id: "kp-046", name: "热力学第二定律", difficulty: "medium" },
          { id: "kp-047", name: "卡诺循环与热机效率", difficulty: "medium" },
          { id: "kp-048", name: "熵与熵增原理", difficulty: "hard" }
        ]
      },
      {
        id: "ch12", title: "第12章：狭义相对论",
        points: [
          { id: "kp-049", name: "狭义相对论基本假设", difficulty: "medium" },
          { id: "kp-050", name: "洛伦兹变换", difficulty: "hard" },
          { id: "kp-051", name: "时间膨胀与长度收缩", difficulty: "medium" },
          { id: "kp-052", name: "相对论动力学与质能关系", difficulty: "medium" }
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

// 知识点详细内容（大学物理核心知识点）
const KP_DETAILS = {
  "kp-006": { definition: "物体加速度与合外力成正比、与质量成反比，F = ma。这是经典力学的核心方程。", keyPoints: ["矢量形式：F = ma = m(dv/dt)", "分量形式：Fx=max, Fy=may, Fz=maz", "自然坐标：Ft=m(dv/dt), Fn=m(v²/ρ)", "解题步骤：选对象→隔离→受力分析→建坐标系→列方程→求解"], prerequisites: ["牛顿第一定律(KP-005)", "速度与加速度(KP-003)"], related: ["牛顿第三定律(KP-007)", "常见力(KP-008)"] },
  "kp-013": { definition: "外力做功和非保守内力做功之和等于系统机械能增量；只有保守力做功时机械能守恒：E_k + E_p = 常量。", keyPoints: ["功能原理：W_ext + W_nc_int = ΔE", "守恒条件：只有保守内力做功", "解题步骤：选系统→分析力→判断守恒→列方程", "能量法解题常比动力学法更简洁"], prerequisites: ["动能定理(KP-011)", "保守力与势能(KP-012)"], related: ["动能定理(KP-011)", "动量守恒(KP-015)", "碰撞(KP-018)"] },
  "kp-015": { definition: "合外力的冲量等于系统动量的增量；合外力为零时系统动量守恒。p = mv，动量守恒是自然界最普遍的守恒律之一。", keyPoints: ["冲量-动量定理：∫F·dt = Δp", "守恒条件：F_ext = 0", "守恒定律比牛顿定律更基本，适用范围更广", "应用：火箭推进、碰撞问题"], prerequisites: ["牛顿第二定律(KP-006)", "牛顿第三定律(KP-007)"], related: ["碰撞(KP-018)", "角动量(KP-017)"] },
  "kp-027": { definition: "物体在平衡位置附近做 x = Acos(ωt + φ) 形式的周期性往复运动，是最基本的振动形式。", keyPoints: ["动力学方程：d²x/dt² + ω²x = 0", "三个特征量：振幅A、角频率ω、初相位φ", "能量：E总 = ½kA²（守恒）", "弹簧振子 ω=√(k/m)，单摆（小角）ω=√(g/l)"], prerequisites: ["常见力(KP-008)", "机械能守恒(KP-013)"], related: ["阻尼振动(KP-028)", "受迫振动(KP-029)"] },
  "kp-044": { definition: "系统内能的增量 = 吸收的热量 + 外界对系统做功，dU = δQ + δW。能量守恒在热现象中的体现。", keyPoints: ["内能U是态函数，Q和W是过程量", "C_p - C_V = R（理想气体迈耶公式）", "绝热过程：pV^γ = 常数", "热力学第一定律与机械能守恒统一"], prerequisites: ["温度与能均分定理(KP-041)", "功与功率(KP-010)"], related: ["热力学第二定律(KP-046)", "卡诺循环(KP-047)"] },
  "kp-047": { definition: "工作于两个热源之间的理想可逆循环，由两个等温过程和两个绝热过程组成。效率 η_C = 1 - T₂/T₁。", keyPoints: ["四个步骤：等温膨胀→绝热膨胀→等温压缩→绝热压缩", "效率仅与高低温热源温度有关", "卡诺定理：可逆热机效率最高", "制冷系数：ε = T₂/(T₁-T₂)"], prerequisites: ["热力学过程(KP-045)", "热力学第二定律(KP-046)"], related: ["熵(KP-048)"] },
  "kp-050": { definition: "满足狭义相对论两个基本假设的时空坐标变换公式，x' = γ(x-vt), t' = γ(t-vx/c²)，其中 γ = 1/√(1-v²/c²)。", keyPoints: ["v≪c 时 γ≈1，回到伽利略变换", "速度变换保证光速不变", "洛伦兹变换保证物理定律协变性", "闵可夫斯基时空：时空间隔为洛伦兹不变量"], prerequisites: ["狭义相对论基本假设(KP-049)"], related: ["时间膨胀(KP-051)", "质能关系(KP-052)"] },
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
          <p style="color: var(--text-muted);">详细内容请查看 knowledge-base/templates/university-physics/ 目录下的完整知识卡片文件，共包含52个结构化知识点。</p>
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

window.KNOWLEDGE_BASE = KNOWLEDGE_BASE;
window.KP_DETAILS = KP_DETAILS;
window.findKPData = findKPData;

document.addEventListener('DOMContentLoaded', initKB);
