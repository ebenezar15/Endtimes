"""Builds the Last Things study workbook (English) as HTML from the app's content, for printing to PDF."""
import json, re, html, math, sys, os

ROOT = '/home/user/Endtimes'
OUT = os.path.dirname(os.path.abspath(__file__))
def J(p): return json.load(open(f'{ROOT}/{p}', encoding='utf-8'))
def e(s): return html.escape(str(s or ''))
def first(s, n=2):
    """First n sentences."""
    parts = re.split(r'(?<=[.!?])\s+(?=[A-Z“"(])', str(s or '').strip())
    return ' '.join(parts[:n])

S = {k: J(f'content/studies/{k}.json') for k in ['olivet','fulfilled','josephus','signs','dating','seventy-weeks','judgments','warnings','israel','israel-history','kingdom-hope','rapture','new-creation','claims','prophecy-qa','deep-dives']}
MILL = J('content/positions/millennial.json'); HERM = J('content/positions/hermeneutic.json'); GLOSS = J('content/glossary.json')

# Key ideas from the app's "study in one minute"
ki_src = open(f'{ROOT}/src/components/studies/keyIdeasData.ts', encoding='utf-8').read()
KEY = {}
for m in re.finditer(r"^\s{2}'?([a-z-]+)'?: \(\) => \[(.*?)^\s{2}\],", ki_src, re.S | re.M):
    items = re.findall(r"title: t\('((?:[^'\\]|\\.)*)'\), text: t\('((?:[^'\\]|\\.)*)'\)(?:, ref: '([^']*)')?", m.group(2))
    KEY[m.group(1)] = [(a.replace("\\'", "'"), b.replace("\\'", "'"), c) for a, b, c in items]

ANSWERS = []  # (chapter, qnum, letter, explain)
COLORS = ['#0f766e', '#b45309', '#b91c1c', '#6d28d9', '#1d4ed8', '#047857', '#9d174d', '#a16207']
chap_no = [0]
toc = []

def chapter(title, sub, key=None, color=None):
    chap_no[0] += 1
    n = chap_no[0]; c = color or COLORS[(n - 1) % len(COLORS)]
    toc.append((n, title))
    h = f'<section class="chap" style="--c:{c}"><div class="opener"><div class="num">{n:02d}</div><div><p class="kicker">Chapter {n}</p><h1>{e(title)}</h1><p class="sub">{e(sub)}</p></div></div>'
    if key and key in KEY:
        h += '<div class="minute"><p class="lbl">The study in one minute</p><div class="ki">'
        for i, (a, b, r) in enumerate(KEY[key]):
            h += f'<div class="kic"><span class="dot">{i+1}</span><b>{e(a)}</b><p>{e(b)}</p>{f"<em>{e(r)}</em>" if r else ""}</div>'
        h += '</div></div>'
    return h

def end(): return '</section>'
def h2(t): return f'<h2>{e(t)}</h2>'
def p(t): return f'<p>{e(t)}</p>'
def box(title, body, kind='note'): return f'<div class="box {kind}"><p class="bt">{e(title)}</p>{body}</div>'
def refs(rs): return f'<span class="refs">{e(" · ".join(rs))}</span>' if rs else ''
def lines(n=3): return '<div class="lines">' + '<i></i>' * n + '</div>'

def quiz(name, items, k=6):
    n = chap_no[0]
    h = '<div class="ex"><p class="extitle">✎ Check your understanding</p><ol class="mc">'
    for i, q in enumerate(items[:k]):
        h += f'<li><p>{e(q["q"])}</p><ul>' + ''.join(f'<li><span class="cb"></span>{chr(65+j)}. {e(o)}</li>' for j, o in enumerate(q['options'])) + '</ul></li>'
        ANSWERS.append((n, name, i + 1, chr(65 + q['answer']), q.get('explain', '')))
    return h + '</ol></div>'

def lookup(items):
    h = '<div class="ex"><p class="extitle">✎ Look it up and write</p><ol class="lu">'
    for ref, prompt in items:
        h += f'<li><p><b>{e(ref)}</b>: {e(prompt)}</p>{lines(2)}</li>'
    return h + '</ol></div>'

def discuss(qs):
    return '<div class="ex disc"><p class="extitle">💬 Discuss or journal</p><ol>' + ''.join(f'<li>{e(q)}{lines(2)}</li>' for q in qs) + '</ol></div>'

def table(head, rows, cls=''):
    h = f'<table class="{cls}"><thead><tr>' + ''.join(f'<th>{e(x)}</th>' for x in head) + '</tr></thead><tbody>'
    for r in rows: h += '<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>'
    return h + '</tbody></table>'

# ---------- SVG helpers ----------
def vline(events, color):
    """Vertical two-column timeline: [(yearlabel, title, text)]."""
    h = f'<div class="vline" style="--t:{color}">'
    for y, t_, x in events:
        h += f'<div class="ve"><span class="vy">{e(y)}</span><div><b>{e(t_)}</b>{f"<p>{e(x)}</p>" if x else ""}</div></div>'
    return h + '</div>'

def yl(y): return f'{-y} BC' if y < 0 else f'AD {y}'

def svg_timeline(events, y0, y1, w=680, label_key='label', year_key='year', color='#0f766e', title=''):
    """Horizontal timeline with alternating labels."""
    H = 230; L = 40; R = w - 40
    X = lambda y: L + (y - y0) / (y1 - y0) * (R - L)
    s = f'<svg viewBox="0 0 {w} {H}" class="dia"><line x1="{L}" x2="{R}" y1="115" y2="115" stroke="{color}" stroke-width="4" stroke-linecap="round"/>'
    for i, ev in enumerate(events):
        x = X(ev[year_key]); up = i % 2 == 0; lvl = (i // 2) % 3
        ty = 95 - lvl * 26 if up else 140 + lvl * 26
        s += f'<line x1="{x:.1f}" x2="{x:.1f}" y1="115" y2="{ty + (6 if up else -12)}" stroke="{color}" stroke-opacity=".45"/><circle cx="{x:.1f}" cy="115" r="5" fill="#fff" stroke="{color}" stroke-width="2.5"/>'
        yr = ev.get('yl') or (f'{-ev[year_key]} BC' if ev[year_key] < 0 else f'AD {ev[year_key]}')
        lab = ev[label_key]; lab = lab if len(lab) < 34 else lab[:32] + '…'
        anchor = 'start' if x < L + 60 else 'end' if x > R - 60 else 'middle'
        s += f'<text x="{x:.1f}" y="{ty}" text-anchor="{anchor}" font-size="9.5"><tspan font-weight="700" fill="{color}">{e(yr)}</tspan><tspan x="{x:.1f}" dy="11" fill="#1f2937">{e(lab)}</tspan></text>'
    return s + '</svg>'

def svg_lanes(lanes, w=680):
    """Rows of chevrons: [(label, color, [steps])]."""
    rowh = 62; H = rowh * len(lanes) + 10
    s = f'<svg viewBox="0 0 {w} {H}" class="dia">'
    for r, (lab, col, steps) in enumerate(lanes):
        y = 10 + r * rowh
        s += f'<text x="0" y="{y+10}" font-size="11" font-weight="800" fill="{col}">{e(lab)}</text>'
        n = len(steps); bw = (w - 4) / n
        for i, st in enumerate(steps):
            x = i * bw
            pts = f'{x},{y+16} {x+bw-10},{y+16} {x+bw},{y+36} {x+bw-10},{y+56} {x},{y+56} {x+10},{y+36}'
            s += f'<polygon points="{pts}" fill="{col}" fill-opacity="{0.12 + 0.1*(i%2)}" stroke="{col}"/>'
            words = st.split(); l1 = ''; l2 = ''
            for wd in words:
                if len(l1 + ' ' + wd) <= max(10, int(bw / 6.2)) and not l2: l1 = (l1 + ' ' + wd).strip()
                else: l2 = (l2 + ' ' + wd).strip()
            if len(l2) > int(bw / 6): l2 = l2[: int(bw / 6) - 1] + '…'
            s += f'<text x="{x+bw/2+3:.1f}" y="{y+34 if l2 else y+40}" text-anchor="middle" font-size="9" fill="#111827">{e(l1)}</text>'
            if l2: s += f'<text x="{x+bw/2+3:.1f}" y="{y+46}" text-anchor="middle" font-size="9" fill="#111827">{e(l2)}</text>'
    return s + '</svg>'

def svg_trib(views, w=680):
    H = 40 + 34 * len(views); L = 190; R = w - 20; X = lambda v: L + v / 7 * (R - L)
    s = f'<svg viewBox="0 0 {w} {H}" class="dia"><text x="{L}" y="14" font-size="10" fill="#6b7280">Year 0</text><text x="{(L+R)/2}" y="14" text-anchor="middle" font-size="10" fill="#6b7280">3½ years</text><text x="{R}" y="14" text-anchor="end" font-size="10" fill="#6b7280">7 years</text>'
    for i, v in enumerate(views):
        y = 26 + i * 34
        s += f'<text x="0" y="{y+15}" font-size="10.5" font-weight="700" fill="#111827">{e(v["name"])}</text>'
        s += f'<rect x="{L}" y="{y+4}" width="{R-L}" height="16" rx="8" fill="#e5e7eb"/>'
        ws = v.get('wrathStart');
        if isinstance(ws, (int, float)): s += f'<rect x="{X(ws):.1f}" y="{y+4}" width="{R-X(ws):.1f}" height="16" rx="8" fill="#fca5a5"/>'
        ra = v.get('rapture')
        if isinstance(ra, (int, float)): s += f'<circle cx="{X(ra):.1f}" cy="{y+12}" r="8" fill="#0f766e"/><text x="{X(ra):.1f}" y="{y+15.5}" text-anchor="middle" font-size="9" fill="#fff" font-weight="800">R</text>'
    return s + '</svg>'

def svg_weeks(w=680):
    L, R = 20, w - 20; tot = 70; X = lambda k: L + k / tot * (R - L)
    s = f'<svg viewBox="0 0 {w} 150" class="dia">'
    for a, b, col, lab in [(0, 7, '#b45309', '7 weeks (49 years)'), (7, 69, '#0f766e', '62 weeks (434 years)'), (69, 70, '#b91c1c', '1 week')]:
        s += f'<rect x="{X(a):.1f}" y="40" width="{X(b)-X(a)-2:.1f}" height="34" rx="6" fill="{col}" fill-opacity=".85"/><text x="{(X(a)+X(b))/2:.1f}" y="62" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">{e(lab) if b-a>2 else "70th"}</text>'
    for k, t1, t2 in [(0, '457 BC', 'Decree to Ezra'), (7, '408 BC', 'City rebuilt'), (69, 'AD 27', 'Messiah anointed'), (70, 'AD 34', 'Gospel to the Gentiles')]:
        s += f'<line x1="{X(k):.1f}" x2="{X(k):.1f}" y1="34" y2="80" stroke="#111827"/><text x="{X(k):.1f}" y="{28 if k!=70 else 100}" text-anchor="{"start" if k==0 else "end" if k>=69 else "middle"}" font-size="10" font-weight="700">{t1}</text><text x="{X(k):.1f}" y="{94 if k!=70 else 112}" text-anchor="{"start" if k==0 else "end" if k>=69 else "middle"}" font-size="9" fill="#374151">{t2}</text>'
    s += f'<text x="{X(69.5):.1f}" y="132" text-anchor="end" font-size="9.5" fill="#b91c1c">Cross in the middle (AD 30/31) · city destroyed AD 70</text>'
    return s + '</svg>'

def svg_sevens(series, w=680):
    sets = [('seal', 'Seals', '#1d4ed8'), ('trumpet', 'Trumpets', '#b45309'), ('bowl', 'Bowls', '#b91c1c')]
    cw = (w - 70) / 7; H = 3 * 92 + 10
    s = f'<svg viewBox="0 0 {w} {H}" class="dia">'
    for r, (k, lab, col) in enumerate(sets):
        y = r * 92 + 4
        s += f'<text x="0" y="{y+46}" font-size="11" font-weight="800" fill="{col}">{lab}</text>'
        for it in [x for x in series if x['set'] == k]:
            x = 66 + (it['n'] - 1) * cw
            s += f'<rect x="{x:.1f}" y="{y}" width="{cw-5:.1f}" height="86" rx="7" fill="{col}" fill-opacity=".08" stroke="{col}"/><text x="{x+8:.1f}" y="{y+15}" font-size="12" font-weight="900" fill="{col}">{it["n"]}</text><text x="{x+cw-10:.1f}" y="{y+14}" text-anchor="end" font-size="8" fill="#6b7280">{e(it.get("when",""))}</text>'
            words = it['image'].split(); line = ''; ly = y + 30
            for wd in words:
                if len(line + ' ' + wd) > 17:
                    s += f'<text x="{x+6:.1f}" y="{ly}" font-size="8.3" fill="#111827">{e(line)}</text>'; ly += 10; line = wd
                    if ly > y + 82: break
                else: line = (line + ' ' + wd).strip()
            if ly <= y + 82: s += f'<text x="{x+6:.1f}" y="{ly}" font-size="8.3" fill="#111827">{e(line)}</text>'
    return s + '</svg>'

def svg_spark(tr, w=200, h=70):
    pts = tr['points']; xs = [q['year'] for q in pts]; vs = [q['value'] for q in pts]
    x0, x1 = min(xs), max(xs); v0, v1 = min(vs), max(vs) or 1
    X = lambda x: 8 + (x - x0) / ((x1 - x0) or 1) * (w - 16); Y = lambda v: h - 16 - (v - v0) / ((v1 - v0) or 1) * (h - 30)
    path = ' '.join(f'{"M" if i==0 else "L"}{X(q["year"]):.1f},{Y(q["value"]):.1f}' for i, q in enumerate(pts))
    return (f'<svg viewBox="0 0 {w} {h}" class="spark"><path d="{path}" fill="none" stroke="#047857" stroke-width="2.5"/>'
            + ''.join(f'<circle cx="{X(q["year"]):.1f}" cy="{Y(q["value"]):.1f}" r="2.5" fill="#047857"/>' for q in pts)
            + f'<text x="8" y="{h-3}" font-size="8" fill="#6b7280">{x0}: {vs[0]}</text><text x="{w-8}" y="{h-3}" text-anchor="end" font-size="8" fill="#6b7280">{x1}: {vs[-1]}</text></svg>')

def svg_tabernacle(w=680):
    s = f'<svg viewBox="0 0 {w} 170" class="dia">'
    s += '<rect x="20" y="20" width="640" height="130" rx="8" fill="#fef3c7" stroke="#b45309"/><text x="40" y="42" font-size="11" font-weight="800" fill="#b45309">Outer court: land and sea, the inhabited world</text>'
    s += '<rect x="300" y="55" width="330" height="80" rx="6" fill="#ccfbf1" stroke="#0f766e"/><text x="315" y="75" font-size="11" font-weight="800" fill="#0f766e">Holy place: the visible heavens</text><text x="315" y="90" font-size="9" fill="#134e4a">lampstand = lights · bread · incense</text>'
    s += '<rect x="520" y="70" width="95" height="55" rx="4" fill="#fde68a" stroke="#a16207" stroke-width="2"/><text x="567" y="94" text-anchor="middle" font-size="10" font-weight="800" fill="#713f12">Most Holy:</text><text x="567" y="108" text-anchor="middle" font-size="9" fill="#713f12">God’s throne room</text>'
    s += '<text x="40" y="120" font-size="9.5" fill="#78350f">Psalm 78:69 · Exodus 39-40 · Hebrews 8:5; 9:24</text>'
    return s + '</svg>'

def svg_balance(early, late, w=680):
    t = early + late or 1; mid = w / 2
    s = f'<svg viewBox="0 0 {w} 120" class="dia"><polygon points="{mid-14},110 {mid+14},110 {mid},84" fill="#374151"/>'
    tilt = (late - early) / t * 12
    s += f'<g transform="rotate({tilt:.1f} {mid} 84)"><line x1="{mid-250}" x2="{mid+250}" y1="84" y2="84" stroke="#374151" stroke-width="4"/>'
    s += f'<rect x="{mid-300}" y="40" width="110" height="40" rx="8" fill="#0f766e"/><text x="{mid-245}" y="58" text-anchor="middle" fill="#fff" font-size="11" font-weight="800">Before AD 70</text><text x="{mid-245}" y="72" text-anchor="middle" fill="#fff" font-size="10">weight {early}</text>'
    s += f'<rect x="{mid+190}" y="40" width="110" height="40" rx="8" fill="#6d28d9"/><text x="{mid+245}" y="58" text-anchor="middle" fill="#fff" font-size="11" font-weight="800">About AD 95</text><text x="{mid+245}" y="72" text-anchor="middle" fill="#fff" font-size="10">weight {late}</text></g>'
    return s + '</svg>'

def svg_olive(w=680):
    s = f'<svg viewBox="0 0 {w} 200" class="dia"><path d="M340 190 C336 150 344 120 340 60" stroke="#b45309" stroke-width="14" fill="none" stroke-linecap="round"/>'
    for d, col, dash in [('M340 130 C300 110 260 100 210 95', '#0f766e', ''), ('M340 100 C380 80 420 70 470 62', '#0f766e', ''), ('M340 150 C300 145 270 148 230 158', '#9ca3af', '6 6'), ('M340 120 C390 115 430 118 480 128', '#b91c1c', ''), ('M340 80 C320 60 300 45 280 30', '#b91c1c', '')]:
        s += f'<path d="{d}" stroke="{col}" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="{dash}"/>'
    s += '<text x="200" y="86" font-size="10" font-weight="700" fill="#0f766e">believing remnant</text><text x="482" y="58" font-size="10" font-weight="700" fill="#0f766e">remnant</text><text x="486" y="130" font-size="10" font-weight="700" fill="#b91c1c">grafted-in Gentiles</text><text x="150" y="172" font-size="10" fill="#6b7280">broken off by unbelief (can be grafted back by faith)</text><text x="340" y="198" text-anchor="middle" font-size="10" font-weight="700" fill="#b45309">Root: the promise to Abraham (Romans 11:16-18)</text>'
    return s + '</svg>'

# ---------- Build ----------
B = []
# Cover
B.append('''<section class="cover"><div class="cv-in"><p class="cv-k">A study workbook</p><h1>Last Things</h1><p class="cv-s">Views of the end, traced through Scripture and history</p>
<svg viewBox="0 0 400 220" class="cv-art"><defs><radialGradient id="g"><stop offset="0" stop-color="#fbbf24" stop-opacity=".7"/><stop offset="1" stop-color="#fbbf24" stop-opacity="0"/></radialGradient></defs><circle cx="200" cy="90" r="90" fill="url(#g)"/>''' +
 ''.join(f'<line x1="200" y1="90" x2="{200+math.cos(i/16*6.283)*150:.0f}" y2="{90+math.sin(i/16*6.283)*150:.0f}" stroke="#fbbf24" stroke-opacity=".35"/>' for i in range(16)) +
 '''<path d="M176 70 l8 -24 l16 16 l16 -16 l8 24 z" fill="#fbbf24"/><rect x="172" y="80" width="56" height="60" rx="6" fill="#134e4a" stroke="#fbbf24" stroke-width="2"/><ellipse cx="200" cy="190" rx="160" ry="18" fill="#14b8a6" fill-opacity=".35" stroke="#5eead4"/></svg>
<p class="cv-f">Matthew 24 · Daniel · Revelation · Israel · the kingdom · the new creation</p><p class="cv-b">A partial preterist and postmillennial reading, with every major view set out fairly</p></div></section>''')

# How to use
B.append('''<section class="page"><h1 class="plain">How to use this workbook</h1>
<div class="grid3"><div class="how"><b>1 · Read</b><p>Each chapter opens with “the study in one minute”, then the key texts, diagrams and tables.</p></div><div class="how"><b>2 · Look up</b><p>Keep a Bible open. Every reference is given so you can read it in context; this workbook paraphrases rather than quotes.</p></div><div class="how"><b>3 · Practise</b><p>Answer the ✎ exercises, then check yourself in the answer key at the back. Use 💬 prompts for groups.</p></div></div>
<div class="box key"><p class="bt">The approach</p><p>The workbook follows the reading of the Last Things app: much of the prophecy Jesus gave his own generation was fulfilled in the fall of Jerusalem in AD 70; Christ reigns now; the gospel will fill the earth; and Christ will return bodily to raise the dead, judge, and make all things new. Where Christians differ, each view is set out in its own terms.</p></div>
<h2>Five questions to ask of any prophecy</h2>''' +
 ''.join(f'<div class="five"><span>{q["id"].upper()}</span><div><b>{e(q["question"])}</b><p>{e(first(q["answer"],2))}</p>{refs(q.get("refs",[])[:3])}</div></div>' for q in S['fulfilled']['keys']) +
 '<h2>Ten reading principles</h2><ol class="cols2">' + ''.join(f'<li><b>{e(x["title"])}.</b> {e(first(x["text"],1))}</li>' for x in S['prophecy-qa']['principles']) + '</ol></section>')
TOC_AT = len(B); B.append('')  # placeholder

# 1 Views
h = chapter('The views of the end', 'Millennial and interpretive positions, side by side')
h += h2('Four millennial views') + '<div class="cards4">' + ''.join(f'<div class="pc" style="border-color:{x["color"]}"><b style="color:{x["color"]}">{e(x["name"])}</b><p>{e(x["tagline"])}</p></div>' for x in MILL) + '</div>'
rap = S['rapture']
h += h2('The order of events in each view') + svg_lanes([
  ('Dispensational premillennial', '#6d28d9', ['Rapture', '7-year tribulation', 'Second coming', '1,000-year reign', 'Final rebellion', 'Judgement', 'New creation']),
  ('Historic premillennial', '#1d4ed8', ['Church age', 'Tribulation', 'Second coming', '1,000-year reign', 'Final rebellion', 'Judgement', 'New creation']),
  ('Amillennial', '#b45309', ['Ascension', 'Thousand years = church age', 'Brief final rebellion', 'Return, one resurrection', 'Judgement, new creation']),
  ('Postmillennial (partial preterist)', '#0f766e', ['Ascension: Christ reigns', 'AD 70: old age ends', 'Gospel fills the earth', 'Return, resurrection, judgement', 'Handover, new creation'])])
h += h2('How Scripture is read: interpretive positions') + table(['Position', 'In one line'], [[f'<b>{e(x["name"])}</b>', e(x['tagline'])] for x in HERM])
h += h2('Common ground') + '<div class="grid3">' + ''.join(f'<div class="how"><b>{e(x["title"])}</b><p>{e(first(x["text"],1))}</p>{refs(x.get("refs",[])[:2])}</div>' for x in rap['commonGround']) + '</div>'
h += discuss(['Which view did you grow up with? What texts did it lean on most?', 'Why is it important to describe another view the way its own holders would?'])
B.append(h + end())

# 2 Matthew 24
ol, fu = S['olivet'], S['fulfilled']
h = chapter('Matthew 24 and AD 70', 'The Olivet Discourse read in its first-century setting', 'olivet')
h += h2('The setting') + '<div class="grid2">' + ''.join(f'<div class="how"><b>{e(c["title"])}</b><p>{e(first(c["text"],2))}</p></div>' for c in ol['context'][:6]) + '</div>'
h += h2('From the prophecy to the fall: AD 30-73') + vline([(yl(x['year']), x['label'], first(x['text'],1)) for x in fu['timeline']][:20], '#b91c1c')
h += h2('The discourse, unit by unit') + table(['Passage', 'Unit', 'What it meant'], [[e(u['ref']), f'<b>{e(u["title"])}</b>', e(first(u['summary'], 1))] for u in ol['units']], 'sm')
h += h2('“This generation”') + p(first(ol['generation']['text'], 3)) + table(['Text', 'How Matthew uses genea'], [[e(u['ref']), e(first(u['text'], 1))] for u in ol['generation']['uses'][:6]], 'sm')
h += h2('The prophets’ symbols decoded') + table(['Image', 'Meaning in the prophets'], [[f'<b>{e(x["image"][:70])}</b><br>{refs([x["ref"]])}', e(first(x['meaning'], 1))] for x in fu['symbols'][:9]], 'sm')
h += h2('The time texts') + '<div class="chips">' + ''.join(f'<span class="chip"><b>{e(x["ref"])}</b> “{e(x["phrase"])}”</span>' for x in fu['timeTexts'][:14]) + '</div>'
h += quiz('Matthew 24', fu['quiz'], 6)
h += lookup([('Matthew 24:1-3', 'What did the disciples ask, and what had Jesus just said?'), ('Luke 21:20-22', 'What sign does Luke give, and what were the disciples to do?'), ('Matthew 23:36', 'Where else does Jesus use “this generation”?')])
B.append(h + end())

# 3 Josephus
jo = S['josephus']
h = chapter('Josephus and the fall of Jerusalem', 'An eyewitness account of the war, read with care', 'josephus')
h += h2('The war in scenes') + vline([(x['date'].split('(')[0].strip(), x['title'], first(x['narrative'],1)) for x in jo['scenes'][:16]], '#b45309')
h += h2('Omens before the fall') + '<div class="grid2">' + ''.join(f'<div class="how"><b>{e(x["title"])}</b><p>{e(first(x["note"],1))}</p><em>{e(x["cite"])}</em></div>' for x in jo['portents']) + '</div>'
h += box('Read him well', '<ul>' + ''.join(f'<li><b>{e(c["title"])}.</b> {e(first(c["text"],1))}</li>' for c in jo['caveats']) + '</ul>', 'warn')
h += discuss(['Which details in Josephus most closely match Jesus’ warnings in Luke 19:41-44 and 21:20-24?', 'Why should we treat Josephus as a vital but not infallible witness?'])
B.append(h + end())

# 4 Signs
sg = S['signs']
h = chapter('Signs of the times', 'Every age saw the signs; every date has failed', 'signs')
h += h2('A graveyard of predictions') + vline([(yl(x['year']), x['who'], first(x['outcome'],1)) for x in S['prophecy-qa']['predictions'][:14]], '#6d28d9')
h += table(['When', 'Who', 'Claim', 'Outcome'], [[e(x['yearLabel']), e(x['who']), e(first(x['claim'],1)), e(first(x['outcome'],1))] for x in sg['history'][:14]], 'sm')
h += h2('Principles') + '<ol class="cols2">' + ''.join(f'<li><b>{e(x["title"])}.</b> {e(first(x["text"],1))}</li>' for x in sg['principles']) + '</ol>'
h += discuss(['Why do people in every generation believe they are the last?', 'How does Matthew 24:36 guard us against date-setting?'])
B.append(h + end())

# 5 Dating
da = S['dating']
h = chapter('Dating Revelation', 'Written before AD 70, or about AD 95?', 'dating')
h += '<div class="grid2">' + ''.join(f'<div class="how"><b>{e(s_["label"])}</b><p><em>{e(s_["date"])}</em></p><p>{e(first(s_["summary"],2))}</p></div>' for s_ in da['sides']) + '</div>'
ew = sum(x.get('weight', 1) for x in da['evidence'] if x['side'] == 'early'); lw = sum(x.get('weight', 1) for x in da['evidence'] if x['side'] == 'late')
h += h2('The evidence on the scales') + svg_balance(ew, lw) + '<p class="cap">Weights are the app’s rough strength ratings for each piece of evidence (1-3), summed. Most modern scholars favour the late date; the internal evidence is the early date’s strongest ground.</p>'
h += table(['Side', 'Evidence', 'The reply'], [[('Early' if x['side']=='early' else 'Late'), f'<b>{e(x["title"])}</b>', e(first(x.get('counter',''),1))] for x in da['evidence'][:14]], 'sm')
h += box('Verdict', p(first(da['verdict'], 3)), 'key')
h += lookup([('Revelation 11:1-2', 'What is John told to measure? Is it standing?'), ('Revelation 17:10', 'How many kings had fallen when John wrote?')])
B.append(h + end())

# 6 Seventy weeks
sw = S['seventy-weeks']
h = chapter('Daniel’s seventy weeks', 'Daniel 9:24-27 and the end-time timeline')
h += h2('The count, without a gap') + svg_weeks()
h += h2('Six goals, and where each was kept') + table(['Goal (Daniel 9:24)', 'Kept', 'Text'], [[f'<b>{e(g["goal"])}</b>', e(first(g['kept'],1)), e(g['keptRef'])] for g in sw['goals']], 'sm')
h += h2('Four ways to count') + table(['Model', 'Weeks 1-69', 'The 70th week', 'Strength'], [[f'<b>{e(m["name"])}</b>', e(m['sixtyNine']), e(first(m['seventieth'],1)), e(first(m['strength'],1))] for m in sw['models']], 'sm')
h += h2('Common fallacies') + table(['Fallacy', 'Problem', 'Reply'], [[f'<b>{e(f["name"])}</b>', e(first(f['problem'],1)), e(first(f['reply'],1))] for f in sw['fallacies'][:8]], 'sm')
h += quiz('Seventy weeks', sw['quiz'], 6)
B.append(h + end())

# 7 Revelation & judgements
ju = S['judgments']
h = chapter('Revelation: seals, trumpets and bowls', 'Twenty-one judgements read in their first-century setting', 'revelation')
h += h2('All twenty-one on one board') + svg_sevens(ju['series'])
h += h2('The new exodus') + table(['Egypt’s plague', 'Trumpet', 'Bowl', 'Note'], [[e(x['plague']), str(x.get('trumpet') or '–'), str(x.get('bowl') or '–'), e(first(x['note'],1))] for x in ju['exodus']], 'sm')
h += h2('Near or far: what was still future to John?') + '<div class="zones"><div style="--z:#b91c1c"><b>Fulfilled</b><p>AD 30-70 and the fall of pagan Rome: the temple, the flight from Judea, “this generation”, John’s tribulation, five kings fallen and one reigning (Revelation 17:10).</p></div><div style="--z:#0f766e"><b>Christ reigns</b><p>The thousand years: the present age of the gospel, Satan bound as to the nations (Revelation 20:1-6).</p></div><div style="--z:#6d28d9"><b>Still future</b><p>After the thousand years: Christ’s bodily return, the final judgement, the New Jerusalem (Revelation 20:11-21:5).</p></div></div>'
h += h2('Where other readings strain') + table(['Holder', 'Problem', 'Reply'], [[e(x['holder']), f'<b>{e(x["name"])}</b>: {e(first(x["problem"],1))}', e(first(x['reply'],1))] for x in ju['problems'][:8]], 'sm')
h += quiz('Seals, trumpets and bowls', ju['quiz'], 6)
B.append(h + end())

# 8 Warnings
wa = S['warnings']
h = chapter('Warnings misread', 'Hard sayings heard in their covenant setting')
h += h2('The prophets’ chain') + '<div class="chain">' + ''.join(f'<div><b>{e(c["title"])}</b><span>{e(c["ref"])}</span></div>' for c in wa['chain'][:8]) + '</div>'
h += h2('Sayings often misread') + table(['Text', 'Saying', 'Popular reading', 'In its setting'], [[e(m['ref']), f'<b>{e(m["phrase"])}</b>', e(m['popular']), e(first(m['setting'],1))] for m in wa['misread'][:10]], 'sm')
h += box('Guardrails', '<ul>' + ''.join(f'<li><b>{e(g["q"])}</b> {e(first(g["a"],1))}</li>' for g in wa['guardrails']) + '</ul>', 'warn')
h += quiz('Warnings misread', wa['quiz'], 5)
B.append(h + end())

# 9 Israel
isr, ih = S['israel'], S['israel-history']
h = chapter('Israel: history and prophecy', 'Every promise, and where Scripture says it was kept', 'israel')
h += h2('Four thousand years on one line') + vline([(x['label'], x['title'], first(x['text'],1)) for x in ih['events']], '#1d4ed8')
h += h2('The covenants') + table(['Covenant', 'With', 'Sign', 'Where it was kept'], [[f'<b>{e(c["name"])}</b><br>{refs([c["ref"]])}', e(c['with']), e(c.get('sign','')), e(c['kept']) + ' ' + refs([c['keptRef']])] for c in ih['covenants']], 'sm')
h += h2('Promises and their fulfilment') + table(['Promise', 'Text', 'Its path to Christ'], [[f'<b>{e(x["title"])}</b>', e(x['ref']), ' → '.join(e(ph['phase']) for ph in x['path'])] for x in isr['promises'][:10]], 'sm')
h += h2('Romans 11: one olive tree') + svg_olive() + table(['Reading', 'Held by', 'Strength', 'Weakness'], [[f'<b>{e(r["label"])}</b>', e('; '.join(re.sub(r'\s*\(.*?\)','',n).strip() for n in r['holders'].split(';')[:3]) if '(' in r['holders'] else r['holders'][:120]), e(first(r['strengths'],1)), e(first(r['weaknesses'],1))] for r in isr['romans11']['readings']], 'sm')
h += box('Each side’s best case', f'<p><b>Fulfilment:</b> {e(first(isr["bestCase"]["fulfilment"],2))}</p><p><b>Future national:</b> {e(first(isr["bestCase"]["future"],2))}</p>')
h += quiz('Israel', isr['quiz'], 5) + quiz('History of Israel', ih['quiz'], 4)
B.append(h + end())

# 10 Kingdom hope
kh = S['kingdom-hope']
h = chapter('The early church, Israel and a world getting worse?', 'Three questions, one hope')
h += '<div class="grid2">' + ''.join(f'<div class="how"><b>{e(x["title"])}</b><p><em>{e(x["question"])}</em></p><p>{e(first(x["answer"],2))}</p></div>' for x in kh['parts']) + '</div>'
h += h2('Is 1948 prophecy? Five tests') + table(['Question', 'Text'], [[e(x['q']), e(x['ref'])] for x in kh['test1948']], 'sm')
h += h2('What the long record shows') + '<div class="sparks">' + ''.join(f'<div><b>{e(tr["label"])}</b>{svg_spark(tr)}<span class="cap">{e(tr["unit"])} · better when {e(tr["better"])}</span></div>' for tr in kh['trends']) + '</div>'
h += h2('Pictures of a growing kingdom') + '<div class="grid2">' + ''.join(f'<div class="how"><b>{e(g["image"])}</b> {refs([g["ref"]])}<p>{e(g["point"])}</p></div>' for g in kh['growth']) + '</div>'
h += quiz('Kingdom hope', kh['quiz'], 6)
B.append(h + end())

# 11 Rapture
h = chapter('Rapture, millennium and kingdom', 'When are believers gathered, and what are the thousand years?', 'rapture')
h += h2('Where each view places the rapture') + svg_trib(rap['tribViews']) + '<p class="cap">R = the gathering of believers; red = the period of wrath, on views that hold a future seven years.</p>'
h += table(['View', 'Summary'], [[f'<b>{e(v["name"])}</b>', e(first(v['summary'],2))] for v in rap['tribViews']], 'sm')
h += h2('How the doctrine developed') + vline([(yl(x['year']), x['label'], first(x['text'],1)) for x in rap['history'][:16]], '#6d28d9')
h += quiz('Rapture and millennium', rap['quiz'], 6)
B.append(h + end())

# 12 Kingdom now
h = chapter('The kingdom now, consummated at his coming', 'The right view: he comes to finish the reign, not to begin it', 'kingdom-now', '#0f766e')
h += box('The test question for every view', '<p class="big">Where does Scripture say Christ’s reign begins after he returns, rather than at his ascension?</p>', 'key')
pillars = [('Christ reigns now', 'Daniel 7:13-14; Psalm 110:1-2; Acts 2:30-36'), ('The church is Zion, Jerusalem and the temple', 'Galatians 4:26; Hebrews 12:22-24; Ephesians 2:19-22'), ('The thousand years is now', 'Revelation 20:1-6; Matthew 12:29'), ('The new creation has begun', 'Isaiah 65:17; 2 Corinthians 5:17; Revelation 22:17'), ('One coming brings the end', '1 Corinthians 15:23-26, 52-54; John 5:28-29'), ('The age that ended was the old covenant', 'Hebrews 8:13; Matthew 24:3, 34')]
h += h2('Six pillars') + '<svg viewBox="0 0 680 170" class="dia"><path d="M30 46 L340 6 L650 46 Z" fill="#fde68a" stroke="#b45309"/><rect x="30" y="46" width="620" height="8" fill="#b45309"/><rect x="20" y="150" width="640" height="12" fill="#b45309" opacity=".6"/>' + ''.join(f'<rect x="{50+i*103}" y="56" width="70" height="94" rx="4" fill="#ccfbf1" stroke="#0f766e"/><text x="{85+i*103}" y="112" text-anchor="middle" font-size="26" font-weight="900" fill="#0f766e">{i+1}</text>' for i in range(6)) + '</svg>'
h += '<ol class="cols2">' + ''.join(f'<li><b>{e(a)}</b><br>{refs([b])}</li>' for a, b in pillars) + '</ol>'
h += h2('Three orders side by side') + svg_lanes([('Premillennial', '#6d28d9', ['Second coming', 'First resurrection', '1,000 years: mortals and glorified', 'Satan loosed', 'Second resurrection, judgement', 'Death destroyed, new earth']), ('Amillennial', '#b45309', ['Ascension: reign begins', '1,000 years = church age', 'Final rebellion', 'Coming: resurrection, judgement', 'Death destroyed, new earth']), ('The right view', '#0f766e', ['Ascension: reign begins', 'AD 30-70 transition', 'Gospel age, new creation advancing', 'Coming, resurrection, judgement', 'Death destroyed, handover'])])
h += table(['Issue', 'Premillennial', 'Amillennial', 'The right view'], [[f'<b>{a}</b>', b, c, f'<b>{d}</b>'] for a, b, c, d in [('When Christ reigns', 'After his return, on earth', 'Now, from heaven', 'Now, with the church as his body'), ('The thousand years', 'Literal, after the return', 'The church age', 'The gospel age, symbolic'), ('Death destroyed', 'After the thousand years', 'At the coming', 'At the coming (1 Cor 15:26, 54)'), ('Resurrection', 'Two phases', 'One, general', 'One, at the last trumpet'), ('Zion and temple', 'A future physical role', 'The church, mostly', 'The church, fully'), ('Matthew 24', 'Mostly future', 'Often all the final coming', 'AD 70; 1 Cor 15 for the return'), ('New creation', 'After the millennium', 'At the return', 'Begun now, complete at the return')]], 'sm')
h += box('Why it matters', p('Only the right view keeps the resurrection, the destruction of death and the handover of the kingdom in one moment, as 1 Corinthians 15:23-28 reads on its face.'), 'key')
h += box('A fair note', p('Faithful, Bible-believing Christians hold premillennial, amillennial and partial preterist views. No view is free of tension. Study with charity and test every claim against the text.'), 'warn')
h += discuss(['Peter places David’s throne at the resurrection and ascension (Acts 2:30-36). How would you show this to a premillennial friend?', 'If Satan is bound and the strong man’s house plundered (Matthew 12:29), what should we expect from the gospel in the world?'])
B.append(h + end())

# 13 New creation
nc = S['new-creation']
h = chapter('New heavens and new earth', 'Covenant language, the tabernacle, and the city with no temple', 'new-creation')
h += h2('Six ways to read “heaven and earth”') + table(['View', 'Key claim'], [[f'<b>{e(v["name"])}</b>', e(first(v['keyClaim'],1))] for v in nc['views']], 'sm')
h += h2('The tabernacle as a small cosmos') + svg_tabernacle()
h += h2('Built like creation') + table(['Creation', 'Tabernacle'], [['The heavens and the earth were finished (Genesis 2:1)', 'All the work of the tabernacle was finished (Exodus 39:32)'], ['God saw all he had made (Genesis 1:31)', 'Moses saw all the work (Exodus 39:43)'], ['God blessed the seventh day (Genesis 2:3)', 'Moses blessed them (Exodus 39:43)'], ['God rests in his finished world', 'The glory filled the tabernacle (Exodus 40:34)']], 'sm')
h += h2('Words behind the debate') + table(['Word', 'Meaning'], [[f'<b>{e(w["term"])}</b> {e(w["script"])}', e(first(w['meaning'],1))] for w in nc['words']], 'sm')
h += quiz('New creation', nc['quiz'], 5)
B.append(h + end())

# 14 Objections
cl = S['claims']
h = chapter('Objections answered', 'Dispensational and premillennial claims, answered fairly')
h += table(['Claim', 'Text', 'The answer'], [[f'<b>{e(c["claim"])}</b>', e(c['verse']), e(first(c['answer'],2))] for c in cl['claims'][:18]], 'sm')
h += quiz('Objections', cl['quiz'], 6)
B.append(h + end())

# 15 Deep dives
dd = S['deep-dives']['dives']
h = chapter('Deep dives', 'Arguments traced step by step')
for d in dd:
    h += f'<div class="dive"><b>{e(d["title"])}</b><p class="q">{e(d["question"])}</p><ol class="steps">' + ''.join(f'<li><b>{e(s_["title"])}</b>: {e(first(s_["text"],1))}</li>' for s_ in d['steps']) + f'</ol><p class="concl">{e(first(d["conclusion"],2))}</p></div>'
B.append(h + end())

# 16 Glossary
h = chapter('Glossary', 'Key words of the debate')
h += '<dl class="gloss">' + ''.join(f'<dt>{e(g["term"])}</dt><dd>{e(first(g["definition"],1))}</dd>' for g in sorted(GLOSS, key=lambda x: x['term'].lower())) + '</dl>'
B.append(h + end())

# Answer key
ak = '<section class="chap" style="--c:#374151"><h1 class="plain">Answer key</h1>'
cur = None
for n, name, q, letter, ex in ANSWERS:
    if (n, name) != cur:
        if cur: ak += '</ol>'
        ak += f'<h3>Chapter {n} · {e(name)}</h3><ol class="ans">'; cur = (n, name)
    ak += f'<li><b>{letter}</b> {e(first(ex,1))}</li>'
ak += '</ol></section>'
B.append(ak)

# Notes pages
B.append('<section class="page"><h1 class="plain">My notes</h1>' + lines(30) + '</section>')

B[TOC_AT] = '<section class="page"><h1 class="plain">Contents</h1><ol class="toc">' + ''.join(f'<li><span>{n:02d}</span>{e(t)}</li>' for n, t in toc) + '<li><span>✓</span>Answer key</li></ol>' + box('Diagrams in this workbook', '<p>Millennial sequences · AD 30-73 timeline · the war in scenes · failed predictions · dating scales · the seventy weeks · the twenty-one judgements · Israel’s four thousand years · Romans 11 olive tree · long-term trends · rapture timing · six pillars · three orders · the tabernacle cosmos</p>') + '</section>'

CSS = open(f'{OUT}/style.css', encoding='utf-8').read()
doc = f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Last Things: Study Workbook</title><style>{CSS}</style></head><body>{"".join(B)}</body></html>'
open(f'{OUT}/workbook.html', 'w', encoding='utf-8').write(doc)
print('chapters', chap_no[0], 'questions', len(ANSWERS), 'bytes', len(doc))
