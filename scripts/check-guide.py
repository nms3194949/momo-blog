#!/usr/bin/env python3
"""理財百科檢查：python3 scripts/check-guide.py src/content/guide/<slug> [更多資料夾]
不帶參數就檢查全部。push 前必跑，有錯會列出並以非 0 結束。"""
import glob, os, re, sys

import yaml

TAGS = {'資產配置', '配息基金', '現金規劃', '美債與利率', '市場判讀', '投資觀念'}
CATS = {'名詞解釋', '常見疑問', '比較選擇', '試算觀念'}
BANNED = ['保證', '穩賺', '穩定配息', '推薦買進', '抄底', '必漲', '保單基金', '投資型保單', '財務顧問', '理財顧問', '市場無法預測']

dirs = sys.argv[1:] or sorted(glob.glob('src/content/guide/*'))
errors = []
for d in dirs:
    f = os.path.join(d, 'index.md')
    name = os.path.basename(d.rstrip('/'))
    if not os.path.exists(f):
        errors.append(f'{name}: 找不到 index.md'); continue
    s = open(f, encoding='utf-8').read()
    parts = s.split('---', 2)
    fm = yaml.safe_load(parts[1]); body = parts[2]
    e = []
    for k in ['title', 'description', 'summary', 'date', 'category', 'faq', 'sources']:
        if not fm.get(k): e.append(f'缺 {k}')
    if len(fm.get('description') or '') > 160: e.append(f"description {len(fm['description'])} 字，超過 160")
    if fm.get('category') not in CATS: e.append(f"category 只能是 {CATS}")
    tags = fm.get('tags') or []
    if not (1 <= len(tags) <= 2 and set(tags) <= TAGS): e.append(f'tags 要從 6 個主題挑 1–2 個：{tags}')
    if len(fm.get('faq') or []) < 3: e.append('FAQ 至少 3 題')
    if len([x for x in fm.get('sources') or [] if x.get('url')]) < 2: e.append('sources 至少 2 個附網址的來源')
    if '## MOMO 的配置觀點' not in body: e.append('缺「## MOMO 的配置觀點」')
    if body.count('\n## ') < 3: e.append('## 小標題太少')
    n = len(re.sub(r'\s', '', body))
    if n < 1200: e.append(f'內文只有 {n} 字，太短')
    text = body + str(fm.get('summary')) + str(fm.get('faq'))
    for w in BANNED:
        if w in text: e.append(f'出現禁用詞「{w}」')
    for m in re.findall(r'(\d+(?:\.\d+)?)\s*%\s*(?:的)?(?:年化)?報酬', text):
        if float(m) > 6: e.append(f'報酬率假設 {m}% 超過 6%（如果是歷史數據請確認有標註來源與期間）')
    bad = re.findall(r'[一-鿿]\*\*[「『（(]|[」』）)]\*\*[一-鿿]', body)
    if bad: e.append(f'粗體會失效：{bad}')
    if '配息' in body and '本金' not in body: e.append('提到配息但沒有提醒「配息可能來自本金」')
    for link in re.findall(r'\]\((\.\./[^)]+)\)', body):
        target = os.path.normpath(os.path.join(d, link))
        if not os.path.exists(os.path.join(target, 'index.md')): e.append(f'內部連結不存在：{link}')
    if e: errors += [f'{name}: {x}' for x in e]
    else: print(f"OK {name}｜{fm['date']}｜{fm['category']}｜{tags}｜內文 {n} 字")

if errors:
    print('\n'.join(errors)); sys.exit(1)
