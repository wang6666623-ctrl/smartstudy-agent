"""端到端集成测试脚本 — 结果写入文件避免编码问题"""
from openai import OpenAI
from system_prompt import build_system_prompt
import sys
import io

# Fix Windows GBK encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

import os
api_key = os.getenv("DEEPSEEK_API_KEY", "")
if not api_key:
    # fallback: read from secrets.toml
    try:
        import tomllib
        with open(".streamlit/secrets.toml", "rb") as f:
            secrets = tomllib.load(f)
        api_key = secrets.get("DEEPSEEK_API_KEY", "")
    except Exception:
        pass

if not api_key:
    print("ERROR: DEEPSEEK_API_KEY not found. Set it in .streamlit/secrets.toml or env variable.")
    exit(1)

client = OpenAI(
    api_key=api_key,
    base_url="https://api.deepseek.com"
)
sys_prompt = build_system_prompt()

results = []
total_tokens = 0

# Test 1: Smart QA
print("=" * 50)
print("Test 1: Smart QA - Simple Harmonic Motion")
print("=" * 50)
resp = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": sys_prompt},
        {"role": "user", "content": "用三层结构简短回答：什么是简谐振动？"}
    ],
    max_tokens=800,
    temperature=0.7
)
answer = resp.choices[0].message.content
has_three = all(kw in answer for kw in ["简要", "推导", "延伸"]) or \
            all(kw in answer for kw in ["第一层", "第二层", "第三层"])
has_source = "KP-027" in answer or "第7章" in answer
total_tokens += resp.usage.total_tokens
print(f"[OK] Length: {len(answer)} chars, Three-layer: {has_three}, Source: {has_source}, Tokens: {resp.usage.total_tokens}")
results.append(("Smart QA", has_three and has_source))

# Test 2: Review Planner
print("=" * 50)
print("Test 2: Review Planner")
print("=" * 50)
resp = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": sys_prompt},
        {"role": "user", "content": "还有10天考大物，每天能学2小时，力学已学过，光学和热学还没开始，帮我做复习计划。"}
    ],
    max_tokens=1200,
    temperature=0.7
)
answer = resp.choices[0].message.content
has_plan = "阶段" in answer or "Day" in answer or "日期" in answer or "计划" in answer
total_tokens += resp.usage.total_tokens
print(f"[OK] Length: {len(answer)} chars, Has plan: {has_plan}, Tokens: {resp.usage.total_tokens}")
results.append(("Review Planner", has_plan))

# Test 3: Note Organizer
print("=" * 50)
print("Test 3: Note Organizer")
print("=" * 50)
resp = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": sys_prompt},
        {"role": "user", "content": "帮我把这些笔记整理结构化：牛顿第二定律 F=ma。力是改变运动的原因。加速度和力成正比，和质量成反比。解题要先做受力分析。"}
    ],
    max_tokens=1000,
    temperature=0.7
)
answer = resp.choices[0].message.content
has_structure = "核心概念" in answer or "要点" in answer or "关键" in answer or "###" in answer
total_tokens += resp.usage.total_tokens
print(f"[OK] Length: {len(answer)} chars, Has structure: {has_structure}, Tokens: {resp.usage.total_tokens}")
results.append(("Note Organizer", has_structure))

# Test 4: DDL Management
print("=" * 50)
print("Test 4: DDL Management")
print("=" * 50)
resp = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": sys_prompt},
        {"role": "user", "content": "物理作业7月20日截止，期中考试7月25日，帮我记一下并排优先级。"}
    ],
    max_tokens=800,
    temperature=0.7
)
answer = resp.choices[0].message.content
has_timeline = "DDL" in answer or "截止" in answer or "优先级" in answer or "时间" in answer
total_tokens += resp.usage.total_tokens
print(f"[OK] Length: {len(answer)} chars, Has timeline: {has_timeline}, Tokens: {resp.usage.total_tokens}")
results.append(("DDL Management", has_timeline))

# Test 5: Speed Read (simulated file content)
print("=" * 50)
print("Test 5: Speed Read (text input)")
print("=" * 50)
resp = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": sys_prompt},
        {"role": "user", "content": "帮我速读以下内容，提取知识点：\n\n简谐振动是物体在平衡位置附近的周期性往复运动。运动方程：x = Acos(wt + phi)。A是振幅，w是角频率，phi是初相位。弹簧振子的角频率 w = sqrt(k/m)，单摆小角度时 w = sqrt(g/l)。总能量 E = 1/2 kA^2，守恒。\n\n阻尼振动中振幅随时间衰减。欠阻尼时仍周期性振动但振幅指数减小。临界阻尼最快回到平衡位置。品质因数 Q = w0/(2*beta)。"}
    ],
    max_tokens=1000,
    temperature=0.7
)
answer = resp.choices[0].message.content
has_cards = "KP" in answer or "知识点" in answer or "卡片" in answer or "定义" in answer
total_tokens += resp.usage.total_tokens
print(f"[OK] Length: {len(answer)} chars, Has cards: {has_cards}, Tokens: {resp.usage.total_tokens}")
results.append(("Speed Read", has_cards))

# Summary
print("=" * 50)
print("TEST SUMMARY")
print("=" * 50)
passed = sum(1 for _, ok in results if ok)
for name, ok in results:
    status = "PASS" if ok else "FAIL"
    print(f"  {status}: {name}")
print(f"Total: {passed}/{len(results)} passed")
print(f"Total tokens used: {total_tokens}")

# Save full response samples to file
with open("test_results.txt", "w", encoding="utf-8") as f:
    f.write(f"Test completed. {passed}/{len(results)} passed.\n")
