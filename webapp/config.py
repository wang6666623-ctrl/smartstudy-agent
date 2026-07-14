"""
智学助手 Web 应用 — 配置文件
"""
import os
import streamlit as st

# ============================================================
# API 配置
# ============================================================
DEEPSEEK_API_KEY = st.secrets.get("DEEPSEEK_API_KEY", os.getenv("DEEPSEEK_API_KEY", ""))
DEEPSEEK_BASE_URL = "https://api.deepseek.com"
DEEPSEEK_MODEL = "deepseek-chat"  # 或 deepseek-reasoner

# ============================================================
# 路径配置
# ============================================================
import pathlib
BASE_DIR = pathlib.Path(__file__).parent.parent
KNOWLEDGE_BASE_DIR = BASE_DIR / "knowledge-base"
PROMPTS_DIR = BASE_DIR / "prompts"
MEMORY_DIR = BASE_DIR / "memory"
OUTPUT_DIR = BASE_DIR / "output"

# 确保输出目录存在
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ============================================================
# 知识库文件路径
# ============================================================
KB_INDEX_PATH = KNOWLEDGE_BASE_DIR / "index.json"
KB_CARDS_PATH = KNOWLEDGE_BASE_DIR / "templates" / "university-physics" / "knowledge-cards.md"
KB_SUMMARY_PATH = KNOWLEDGE_BASE_DIR / "templates" / "university-physics" / "summary.md"
KB_MINDMAP_PATH = KNOWLEDGE_BASE_DIR / "templates" / "university-physics" / "mindmap.md"
KB_GRAPH_PATH = KNOWLEDGE_BASE_DIR / "knowledge-graph.json"

# ============================================================
# 记忆文件路径
# ============================================================
USER_PROFILE_PATH = MEMORY_DIR / "user-profile.json"
LEARNING_LOG_PATH = MEMORY_DIR / "learning-log.json"
DDL_TRACKER_PATH = MEMORY_DIR / "ddl-tracker.json"

# ============================================================
# 应用配置
# ============================================================
APP_TITLE = "🎓 智学助手 SmartStudy"
APP_ICON = "📚"
MAX_HISTORY_LENGTH = 30  # 保留最近 N 轮对话
MAX_FILE_SIZE_MB = 10    # 上传文件大小限制
