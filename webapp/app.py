"""
智学助手 Web 应用 — 主入口
Streamlit + DeepSeek API 驱动的大学物理 AI 学习伴侣
"""
import streamlit as st
import json
import time
from datetime import datetime
from openai import OpenAI

from config import (
    DEEPSEEK_API_KEY, DEEPSEEK_BASE_URL, DEEPSEEK_MODEL,
    APP_TITLE, APP_ICON, MAX_HISTORY_LENGTH, MAX_FILE_SIZE_MB,
    USER_PROFILE_PATH, DDL_TRACKER_PATH
)
from system_prompt import build_system_prompt
from tools import TOOLS, execute_tool


# ============================================================
# 页面配置
# ============================================================
st.set_page_config(
    page_title=APP_TITLE,
    page_icon=APP_ICON,
    layout="wide",
    initial_sidebar_state="expanded"
)

# 自定义 CSS
st.markdown("""
<style>
    /* 聊天消息样式 */
    .stChatMessage { border-radius: 12px; }
    /* 侧边栏按钮 */
    .stButton button { width: 100%; border-radius: 8px; margin-bottom: 4px; }
    /* 标题样式 */
    .main-title { font-size: 1.8rem; font-weight: bold; margin-bottom: 0.5rem; }
</style>
""", unsafe_allow_html=True)


# ============================================================
# 会话状态初始化
# ============================================================
def init_session_state():
    """初始化 Streamlit session state"""
    defaults = {
        "messages": [],           # 对话历史
        "system_prompt": "",      # 系统提示词（懒加载）
        "user_name": "同学",       # 用户称呼
        "total_tokens": 0,        # 累计 token 消耗
        "ddls": [],               # DDL 缓存
        "conversation_count": 0,  # 本轮对话次数
    }
    for key, val in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = val

    # 懒加载系统提示词
    if not st.session_state.system_prompt:
        with st.spinner("正在加载知识库…"):
            st.session_state.system_prompt = build_system_prompt()


def load_user_profile() -> dict:
    """加载用户画像"""
    if USER_PROFILE_PATH.exists():
        try:
            return json.loads(USER_PROFILE_PATH.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, KeyError):
            pass
    return {"profile": {"name": "同学", "major": "理工科"}, "current_courses": []}


def load_ddls() -> list:
    """加载 DDL 列表"""
    if DDL_TRACKER_PATH.exists():
        try:
            data = json.loads(DDL_TRACKER_PATH.read_text(encoding="utf-8"))
            return data.get("active_ddls", [])
        except (json.JSONDecodeError, KeyError):
            pass
    return []


# ============================================================
# DeepSeek API 客户端
# ============================================================
def get_client() -> OpenAI:
    """获取 DeepSeek API 客户端"""
    return OpenAI(
        api_key=DEEPSEEK_API_KEY,
        base_url=DEEPSEEK_BASE_URL
    )


def call_deepseek(messages: list, use_tools: bool = True) -> dict:
    """
    调用 DeepSeek API，支持流式输出和 tool calling

    返回: {"content": str, "tool_calls": list | None, "tokens": int}
    """
    client = get_client()

    kwargs = {
        "model": DEEPSEEK_MODEL,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 4096,
        "stream": True,
    }
    if use_tools:
        kwargs["tools"] = TOOLS
        kwargs["tool_choice"] = "auto"

    response = client.chat.completions.create(**kwargs)

    # 收集流式响应
    full_content = ""
    tool_calls_data = []
    final_tokens = 0
    placeholder = st.empty()

    for chunk in response:
        delta = chunk.choices[0].delta

        # 处理文本内容
        if delta.content:
            full_content += delta.content
            placeholder.markdown(full_content + "▌")

        # 处理 tool calls（流式累积）
        if delta.tool_calls:
            for tc_delta in delta.tool_calls:
                # 确保 tool_calls_data 有足够的槽位
                while len(tool_calls_data) <= tc_delta.index:
                    tool_calls_data.append({
                        "id": "",
                        "type": "function",
                        "function": {"name": "", "arguments": ""}
                    })
                if tc_delta.id:
                    tool_calls_data[tc_delta.index]["id"] = tc_delta.id
                if tc_delta.function:
                    if tc_delta.function.name:
                        tool_calls_data[tc_delta.index]["function"]["name"] = tc_delta.function.name
                    if tc_delta.function.arguments:
                        tool_calls_data[tc_delta.index]["function"]["arguments"] += tc_delta.function.arguments

        # 获取 token 用量
        if hasattr(chunk, 'usage') and chunk.usage:
            final_tokens = chunk.usage.total_tokens

    # 清除光标
    if full_content:
        placeholder.markdown(full_content)
    else:
        placeholder.empty()

    # 如果有 tool calls，显示提示
    if tool_calls_data and not full_content:
        tool_names = [tc["function"]["name"] for tc in tool_calls_data if tc["function"]["name"]]
        placeholder.info(f"🔧 正在执行：{', '.join(tool_names)}…")

    return {
        "content": full_content,
        "tool_calls": tool_calls_data if tool_calls_data else None,
        "tokens": final_tokens
    }


def process_tool_calls(tool_calls: list) -> list:
    """执行 tool calls 并返回结果消息"""
    tool_results = []
    for tc in tool_calls:
        name = tc["function"]["name"]
        try:
            args = json.loads(tc["function"]["arguments"])
        except json.JSONDecodeError:
            args = {}

        result = execute_tool(name, args)
        tool_results.append({
            "role": "tool",
            "tool_call_id": tc["id"],
            "content": result
        })

        # 在聊天中显示工具调用结果
        with st.chat_message("assistant"):
            st.caption(f"🔧 {name}")
            st.success(result)

    return tool_results


# ============================================================
# 文件上传处理
# ============================================================
def handle_file_upload(uploaded_file) -> str:
    """处理上传的文件，返回文本内容"""
    if uploaded_file is None:
        return ""

    file_size_mb = uploaded_file.size / (1024 * 1024)
    if file_size_mb > MAX_FILE_SIZE_MB:
        st.error(f"文件过大（{file_size_mb:.1f}MB），限制 {MAX_FILE_SIZE_MB}MB")
        return ""

    try:
        filename = uploaded_file.name.lower()

        if filename.endswith('.txt') or filename.endswith('.md'):
            content = uploaded_file.read().decode('utf-8')
            return f"📄 **{uploaded_file.name}** ({file_size_mb:.1f}MB)\n\n{content}"

        elif filename.endswith('.pdf'):
            # 尝试用 PyPDF2 解析
            try:
                from io import BytesIO
                from PyPDF2 import PdfReader
                reader = PdfReader(BytesIO(uploaded_file.read()))
                text_parts = []
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        text_parts.append(text)
                content = "\n\n".join(text_parts)
                return f"📄 **{uploaded_file.name}** (PDF, {len(reader.pages)}页)\n\n{content}"
            except ImportError:
                return f"📄 **{uploaded_file.name}** — ⚠️ PDF 解析需要 PyPDF2 库。请先用 TXT/MD 格式上传，或直接粘贴文本内容。"

        else:
            # 尝试按文本读取
            try:
                content = uploaded_file.read().decode('utf-8')
                return f"📄 **{uploaded_file.name}** ({file_size_mb:.1f}MB)\n\n{content}"
            except UnicodeDecodeError:
                return f"📄 **{uploaded_file.name}** — ⚠️ 不支持的文件格式，请使用 TXT/MD/PDF 格式。"

    except Exception as e:
        return f"❌ 文件读取失败：{str(e)}"


# ============================================================
# UI 渲染
# ============================================================

def render_sidebar():
    """渲染侧边栏"""
    with st.sidebar:
        st.markdown("## 🎓 智学助手")
        st.markdown("大学物理 AI 学习伴侣")
        st.divider()

        # 用户信息
        profile = load_user_profile()
        user_name = profile.get("profile", {}).get("name", "同学")
        st.markdown(f"👤 **{user_name}**")
        st.markdown(f"📚 大学物理（上）| 12章 · 52知识点")

        # 学习进度
        courses = profile.get("current_courses", [])
        if courses:
            course = courses[0]
            completed = len(course.get("progress", {}).get("completed_kps", []))
            total = course.get("total_knowledge_points", 52)
            st.progress(completed / total, text=f"学习进度：{completed}/{total} KPs")

        st.divider()

        # 快捷操作
        st.markdown("### ⚡ 快捷操作")
        col1, col2 = st.columns(2)
        with col1:
            if st.button("📖 答疑", help="问一个物理问题"):
                st.session_state.pending_action = "请帮我解答一个大学物理问题"
                st.rerun()
            if st.button("📅 复习", help="制定复习计划"):
                st.session_state.pending_action = "请帮我制定大学物理的复习计划"
                st.rerun()
        with col2:
            if st.button("📝 笔记", help="整理笔记"):
                st.session_state.pending_action = "请帮我把以下课堂笔记整理成结构化笔记"
                st.rerun()
            if st.button("⏰ DDL", help="管理截止日期"):
                st.session_state.pending_action = "请帮我查看当前的DDL并管理任务"
                st.rerun()

        st.divider()

        # DDL 概览
        st.markdown("### ⏰ DDL 概览")
        ddls = load_ddls()
        if ddls:
            urgent = [d for d in ddls if d.get("priority") == "高"]
            if urgent:
                st.warning(f"🔴 {len(urgent)} 个紧急任务")
            for ddl in ddls[:5]:
                st.caption(f"• {ddl.get('deadline','')} — {ddl.get('title','')}")
            if len(ddls) > 5:
                st.caption(f"…还有 {len(ddls)-5} 个任务")
        else:
            st.caption("暂无活跃 DDL ✓")

        st.divider()

        # 操作区
        if st.button("🗑️ 清除对话", use_container_width=True):
            st.session_state.messages = []
            st.session_state.conversation_count = 0
            st.rerun()

        st.caption(f"模型：{DEEPSEEK_MODEL}")
        st.caption(f"累计 Token：{st.session_state.total_tokens:,}")


def main():
    """主函数"""
    init_session_state()
    render_sidebar()

    # 主区域
    st.markdown('<p class="main-title">🎓 智学助手 SmartStudy</p>', unsafe_allow_html=True)
    st.caption("大学物理 AI 学习伴侣 — 支持智能答疑、资料速读、复习规划、笔记整理、DDL 管理")

    # 渲染历史消息
    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

    # 文件上传区域（侧边栏和聊天输入之间）
    with st.expander("📎 上传课件/笔记（支持 TXT/MD/PDF）", expanded=False):
        uploaded_file = st.file_uploader(
            "选择文件",
            type=["txt", "md", "pdf"],
            label_visibility="collapsed",
            key="file_uploader"
        )
        if uploaded_file:
            file_content = handle_file_upload(uploaded_file)
            if file_content:
                st.text_area("文件内容预览", file_content, height=150, disabled=True)
                if st.button("📖 分析这个文件", type="primary"):
                    # 将文件内容作为用户消息发送
                    user_msg = f"请帮我速读以下文件内容，提取知识点并生成知识卡片：\n\n{file_content}"
                    st.session_state.messages.append({"role": "user", "content": user_msg[:500] + "…" if len(user_msg) > 500 else user_msg})
                    st.session_state[f"full_file_msg"] = user_msg
                    st.rerun()

    # 聊天输入
    user_input = st.chat_input("输入你的问题…（例如：牛顿第二定律怎么理解？）")

    # 处理快捷操作触发的 pending action
    pending = st.session_state.pop("pending_action", None)
    if pending:
        user_input = pending

    if not user_input:
        return

    # 处理之前上传的完整文件消息
    full_file_msg = st.session_state.pop("full_file_msg", None)
    if full_file_msg:
        user_input = full_file_msg

    # 添加用户消息
    st.session_state.messages.append({"role": "user", "content": user_input})
    st.session_state.conversation_count += 1

    with st.chat_message("user"):
        st.markdown(user_input)

    # 调用 DeepSeek API
    with st.chat_message("assistant"):
        try:
            # 构建消息列表
            system_msg = [{"role": "system", "content": st.session_state.system_prompt}]
            # 保留最近 N 轮对话
            recent_messages = st.session_state.messages[-(MAX_HISTORY_LENGTH * 2):]
            messages = system_msg + recent_messages

            # 第一轮调用
            result = call_deepseek(messages, use_tools=True)

            # 累加 token
            if result["tokens"]:
                st.session_state.total_tokens += result["tokens"]

            # 处理 tool calls
            if result["tool_calls"] and not result["content"]:
                # 追加 assistant 消息（含 tool calls）
                assistant_msg = {
                    "role": "assistant",
                    "content": None,
                    "tool_calls": result["tool_calls"]
                }
                messages.append(assistant_msg)

                # 执行工具
                tool_results = process_tool_calls(result["tool_calls"])
                messages.extend(tool_results)

                # 第二轮调用（带工具结果）
                with st.spinner("正在生成回复…"):
                    result2 = call_deepseek(messages, use_tools=False)

                if result2["tokens"]:
                    st.session_state.total_tokens += result2["tokens"]

                final_content = result2["content"] or "抱歉，处理过程中出现了问题，请再试一次。"
                st.markdown(final_content)
                st.session_state.messages.append({"role": "assistant", "content": final_content})

            elif result["content"]:
                # 纯文本回复
                st.session_state.messages.append({"role": "assistant", "content": result["content"]})
            else:
                st.warning("未收到有效回复，请重试。")

        except Exception as e:
            error_msg = str(e)
            if "401" in error_msg or "authentication" in error_msg.lower():
                st.error("❌ API Key 验证失败。请检查 `.streamlit/secrets.toml` 中的 DEEPSEEK_API_KEY 是否正确。")
            elif "timeout" in error_msg.lower():
                st.error("⏱️ 请求超时，请重试。")
            elif "rate" in error_msg.lower():
                st.warning("⏳ API 调用频率限制，请稍后再试。")
            else:
                st.error(f"❌ 调用失败：{error_msg}")

    # 限制对话历史长度
    if len(st.session_state.messages) > MAX_HISTORY_LENGTH * 4:
        st.session_state.messages = st.session_state.messages[-(MAX_HISTORY_LENGTH * 2):]


# ============================================================
# 入口
# ============================================================
if __name__ == "__main__":
    main()
