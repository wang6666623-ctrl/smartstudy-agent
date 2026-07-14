"""
智学助手 Web 应用 — DeepSeek Function Calling 工具定义
"""
import json
import os
from datetime import datetime
from config import DDL_TRACKER_PATH, OUTPUT_DIR


# ============================================================
# 工具定义（OpenAI/DeepSeek function calling 格式）
# ============================================================

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "save_ddl",
            "description": "保存一个作业或考试的 DDL（截止日期）。当用户提到作业截止时间、考试日期等信息时调用此工具进行保存。",
            "parameters": {
                "type": "object",
                "properties": {
                    "course": {
                        "type": "string",
                        "description": "课程名称，如'大学物理（上）'"
                    },
                    "task_type": {
                        "type": "string",
                        "enum": ["作业", "实验", "考试", "报告", "其他"],
                        "description": "任务类型"
                    },
                    "title": {
                        "type": "string",
                        "description": "任务标题，如'第三章作业'、'期中考试'"
                    },
                    "deadline": {
                        "type": "string",
                        "description": "截止日期，格式为 YYYY-MM-DD，如'2026-07-20'"
                    },
                    "estimated_hours": {
                        "type": "number",
                        "description": "预估所需小时数，如 3.0 表示3小时"
                    },
                    "priority": {
                        "type": "string",
                        "enum": ["高", "中", "低"],
                        "description": "优先级：高（2天内截止）、中（1周内）、低（超过1周）"
                    },
                    "notes": {
                        "type": "string",
                        "description": "额外备注（可选）"
                    }
                },
                "required": ["course", "task_type", "title", "deadline", "estimated_hours", "priority"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "list_ddls",
            "description": "列出当前所有活跃的 DDL（作业、考试等截止日期）。当用户问'我有哪些任务'、'还有什么要做的'、'看看DDL'时调用。",
            "parameters": {
                "type": "object",
                "properties": {
                    "filter_status": {
                        "type": "string",
                        "enum": ["全部", "活跃", "已完成"],
                        "description": "筛选状态，默认'活跃'"
                    }
                },
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "save_note",
            "description": "将整理好的结构化笔记或知识卡片保存到文件。当用户要求保存笔记、导出知识卡片时调用。",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {
                        "type": "string",
                        "description": "笔记标题，如'大学物理第三章笔记'"
                    },
                    "content": {
                        "type": "string",
                        "description": "笔记的完整 Markdown 内容"
                    },
                    "note_type": {
                        "type": "string",
                        "enum": ["结构化笔记", "知识卡片", "复习计划", "闪卡集", "其他"],
                        "description": "笔记类型"
                    }
                },
                "required": ["title", "content", "note_type"]
            }
        }
    }
]


# ============================================================
# 工具处理函数
# ============================================================

def handle_save_ddl(args: dict) -> str:
    """处理 save_ddl 工具调用"""
    # 读取现有 DDL
    ddls = []
    if DDL_TRACKER_PATH.exists():
        try:
            data = json.loads(DDL_TRACKER_PATH.read_text(encoding="utf-8"))
            ddls = data.get("active_ddls", [])
        except (json.JSONDecodeError, KeyError):
            ddls = []

    # 创建新 DDL 记录
    new_ddl = {
        "id": f"ddl-{len(ddls)+1:03d}",
        "course": args.get("course", ""),
        "task_type": args.get("task_type", "其他"),
        "title": args.get("title", ""),
        "deadline": args.get("deadline", ""),
        "estimated_hours": args.get("estimated_hours", 2.0),
        "priority": args.get("priority", "中"),
        "notes": args.get("notes", ""),
        "status": "活跃",
        "created_at": datetime.now().isoformat()
    }

    ddls.append(new_ddl)

    # 持久化保存
    save_data = {
        "active_ddls": ddls,
        "completed_ddls": [],
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    DDL_TRACKER_PATH.write_text(json.dumps(save_data, ensure_ascii=False, indent=2), encoding="utf-8")

    return f"✅ DDL 已保存：{new_ddl['title']}（{new_ddl['course']}），截止 {new_ddl['deadline']}"


def handle_list_ddls(args: dict = None) -> str:
    """处理 list_ddls 工具调用"""
    if not DDL_TRACKER_PATH.exists():
        return "📭 当前没有任何 DDL 记录。你可以告诉我你的作业和考试安排，我来帮你管理！"

    try:
        data = json.loads(DDL_TRACKER_PATH.read_text(encoding="utf-8"))
        active = data.get("active_ddls", [])
    except (json.JSONDecodeError, KeyError):
        return "📭 DDL 数据读取失败，请重新添加。"

    if not active:
        return "📭 当前没有任何活跃的 DDL。干得不错！"

    # 按截止日期排序
    active.sort(key=lambda x: x.get("deadline", "9999-99-99"))

    result = "## ⏰ 当前 DDL 列表\n\n"
    result += "| 优先级 | 截止日期 | 课程 | 任务 | 预估耗时 |\n"
    result += "|--------|---------|------|------|----------|\n"

    priority_emoji = {"高": "🔴", "中": "🟡", "低": "🟢"}
    for ddl in active:
        p = priority_emoji.get(ddl.get("priority", "中"), "⚪")
        result += f"| {p} | {ddl.get('deadline','')} | {ddl.get('course','')} | {ddl.get('title','')} | {ddl.get('estimated_hours','')}h |\n"

    return result


def handle_save_note(args: dict) -> str:
    """处理 save_note 工具调用"""
    title = args.get("title", "未命名笔记")
    content = args.get("content", "")
    note_type = args.get("note_type", "其他")

    # 生成安全文件名
    safe_title = "".join(c for c in title if c.isalnum() or c in " _-（）()")
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    filename = f"{safe_title}-{timestamp}.md"
    filepath = OUTPUT_DIR / filename

    # 写入文件
    full_content = f"# {title}\n\n> 类型：{note_type} | 生成时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n---\n\n{content}"
    filepath.write_text(full_content, encoding="utf-8")

    return f"✅ 笔记已保存！文件：`{filename}`（位于 output/ 目录）\n\n{content[:500]}{'...' if len(content) > 500 else ''}"


def execute_tool(tool_name: str, tool_args: dict) -> str:
    """执行工具调用并返回结果"""
    handlers = {
        "save_ddl": handle_save_ddl,
        "list_ddls": handle_list_ddls,
        "save_note": handle_save_note
    }

    handler = handlers.get(tool_name)
    if handler:
        return handler(tool_args)
    else:
        return f"❌ 未知工具：{tool_name}"
