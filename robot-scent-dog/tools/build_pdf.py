"""Build Robo-K9_Build_Plan.pdf from the Markdown docs.

    pip install markdown
    python tools/build_pdf.py        # writes Robo-K9_Build_Plan.pdf next to README.md

Needs Chromium or Chrome. Set CHROME=/path/to/chrome if it isn't found automatically.
"""
import datetime, os, pathlib, re, shutil, subprocess, tempfile
import markdown

R = pathlib.Path(__file__).resolve().parent.parent
GH = "https://github.com/turkokami/barber-shack/blob/claude/robot-scent-detection-dog-ih0tc9/robot-scent-dog/"
plan = (R/'BUILD_PLAN.md').read_text()
sch = (R/'SCHEMATICS.md').read_text()
readme = (R/'README.md').read_text()
integration = (R/'INTEGRATION.md').read_text()


mermaid_ascii = "```\n" + (R / "tools" / "system_diagram.txt").read_text() + "```"
sch = re.sub(r"```mermaid.*?```", lambda m: mermaid_ascii, sch, flags=re.S)

def strip_h1(md):  # drop the top-level title; we supply section titles
    return re.sub(r"\A# .*\n", "", md)

# Rewrite cross-doc links to in-document anchors
def fix_lists(md):
    out, in_code, prev = [], False, ""
    for line in md.split("\n"):
        if line.startswith("```"):
            in_code = not in_code
        if not in_code and re.match(r"   [-*] ", line):
            line = " " + line  # python-markdown wants 4-space nesting
        if not in_code and line.startswith("|") and prev.strip() and not prev.startswith("|"):
            out.append("")
        is_item = re.match(r"\s*([-*]|\d+\.) ", line)
        prev_item = re.match(r"\s*([-*]|\d+\.) ", prev) or prev.startswith("  ")
        if not in_code and is_item and prev.strip() and not prev_item and not prev.startswith("|"):
            out.append("")
        out.append(line); prev = line
    return "\n".join(out)

def fix_links(md):
    md = fix_lists(md)
    md = md.replace("[BUILD_PLAN.md §4]", "[Build plan §4]").replace("SCHEMATICS §", "Schematics §").replace("[SCHEMATICS.md §3]", "[Schematics §3]").replace("[SCHEMATICS.md]", "[the Schematics section]")
    md = md.replace("](BUILD_PLAN.md#4-bill-of-materials-with-purchase-links)", "](#bom)")
    md = md.replace("](SCHEMATICS.md#3-electrical-schematic)", "](#schematics)")
    md = re.sub(r"\]\((BUILD_PLAN|SCHEMATICS|README|INTEGRATION)\.md\)", lambda m: f"](#{ {'BUILD_PLAN':'plan','SCHEMATICS':'schematics','README':'summary','INTEGRATION':'integration'}[m.group(1)] })", md)
    md = re.sub(r"\]\(((?:firmware|hub)/[^)]+)\)", lambda m: f"]({GH}{m.group(1)})", md)
    md = re.sub(r"\]\(Robo-K9_Build_Plan\.pdf\)", "](#summary)", md)
    md = re.sub(r"\]\(docs/", f"]({(R / 'docs').as_uri()}/", md)
    md = re.sub(r"\]\(BOM\.csv\)", "](https://github.com/turkokami/barber-shack/blob/claude/robot-scent-detection-dog-ih0tc9/robot-scent-dog/BOM.csv)", md)
    md = re.sub(r"\]\(`?firmware/?`?\)", "](https://github.com/turkokami/barber-shack/tree/claude/robot-scent-detection-dog-ih0tc9/robot-scent-dog/firmware)", md)
    md = md.replace("](firmware/)", "](https://github.com/turkokami/barber-shack/tree/claude/robot-scent-detection-dog-ih0tc9/robot-scent-dog/firmware)")
    return md

# Summary: drop the doc index table from the README
readme_body = strip_h1(readme)
readme_body = re.sub(r"\| Doc \|.*?\n\n", "", readme_body, flags=re.S)

review_qs = """## Questions for reviewers

1. **Robot tier:** Go2 Pro (~$2.8k, community ROS 2 SDK) or Go2 EDU ($11k+, official SDK and power dock)?
2. **Phase 0 gate:** are ≥ 85% sensitivity and ≤ 10% false positives at 5 cm the right bar for going ahead with the robot?
3. **Chemicals and live aids:** who holds the account for reference chemicals (Sigma-Aldrich sells mainly to businesses and institutions) and handles live-bug vials?
4. **Ground truth:** which TD-GC-MS lab should we use for the Tenax validation samples?
5. **Field pilot:** which pest-control partner should we approach for Phase 4?
6. **Phase 5:** is there a university entomology or biosensor lab we'd want as a partner?
7. **Hub hosting:** a laptop on site for each job, or one always-on hub reached over a VPN?
8. **Team size:** how many dog units and wand handlers per job (the hub supports any mix)?
"""

md_all = [
  ('summary', 'Executive summary', readme_body + "\n\n" + review_qs),
  ('plan', 'Build plan', strip_h1(plan)),
  ('schematics', 'Schematics', strip_h1(sch)),
  ('integration', 'Robot dog link-up and hub', strip_h1(integration)),
]
ext = ['tables', 'fenced_code', 'sane_lists', 'attr_list']
html_sections = []
for anchor, title, md in md_all:
    body = markdown.markdown(fix_links(md), extensions=ext)
    body = body.replace('<h2>4. Bill of materials with purchase links</h2>', '<h2 id="bom">4. Bill of materials with purchase links</h2>')
    html_sections.append(f'<section id="{anchor}"><h1 class="part">{title}</h1>{body}</section>')

today = datetime.date(2026, 9, 25).strftime('%B %-d, %Y')
toc = """<ol class="toc">
<li><a href="#summary">Executive summary and questions for reviewers</a></li>
<li><a href="#plan">Build plan: research, architecture, phases, BOM, budget, validation, safety</a></li>
<li><a href="#schematics">Schematics: system, pneumatic, electrical, power, mechanical</a></li>
<li><a href="#integration">Robot dog link-up and hub: Go2 Pro / EDU link-up schematics, duties, reporting</a></li></ol>"""

html = f"""<!doctype html><html><head><meta charset="utf-8"><title>Robo-K9 Build Plan</title>
<style>
@page {{ size: Letter; margin: 0.7in 0.65in 0.75in 0.65in;
  @bottom-center {{ content: counter(page); }} }}
:root {{ --ink:#1c2430; --muted:#5b6675; --accent:#1f5f8b; --rule:#d5dbe3; --tint:#f3f6f9; }}
html {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
body {{ font-family: 'Liberation Sans','DejaVu Sans',Arial,sans-serif; color:var(--ink); font-size:9.6pt; line-height:1.42; }}
a {{ color:var(--accent); text-decoration:none; word-break:break-word; }}
h1.part {{ font-size:20pt; color:var(--accent); border-bottom:2px solid var(--accent); padding-bottom:4pt; margin:0 0 10pt; }}
section {{ break-before: page; }}
h2 {{ font-size:13.5pt; margin:16pt 0 6pt; color:var(--ink); break-after:avoid; border-bottom:1px solid var(--rule); padding-bottom:2pt; }}
h3 {{ font-size:11pt; margin:12pt 0 4pt; color:var(--accent); break-after:avoid; }}
p, li {{ orphans:3; widows:3; }}
ul, ol {{ padding-left:18pt; margin:4pt 0; }}
blockquote {{ margin:6pt 0; padding:6pt 10pt; background:var(--tint); border-left:3px solid var(--accent); color:var(--muted); }}
table {{ border-collapse:collapse; width:100%; margin:6pt 0 10pt; font-size:8.3pt; line-height:1.3; }}
th, td {{ border:1px solid var(--rule); padding:3pt 5pt; vertical-align:top; text-align:left; }}
th {{ background:#e7eef5; }}
tr:nth-child(even) td {{ background:#fafbfc; }}
tr {{ break-inside:avoid; }}
code {{ font-family:'DejaVu Sans Mono',monospace; font-size:8.4pt; background:var(--tint); padding:0 2pt; border-radius:2pt; }}
pre {{ font-family:'DejaVu Sans Mono',monospace; font-size:6.9pt; line-height:1.22; background:var(--tint); border:1px solid var(--rule);
  padding:7pt 8pt; border-radius:3pt; white-space:pre; overflow:hidden; break-inside:avoid; }}
pre code {{ background:none; padding:0; font-size:inherit; }}
hr {{ border:none; border-top:1px solid var(--rule); margin:10pt 0; }}
.cover {{ height:9.3in; display:flex; flex-direction:column; justify-content:center; }}
.cover .kicker {{ color:var(--accent); font-weight:bold; letter-spacing:1.5pt; text-transform:uppercase; font-size:10pt; }}
.cover h1 {{ font-size:32pt; margin:6pt 0 4pt; line-height:1.1; }}
.cover .sub {{ font-size:14pt; color:var(--muted); margin-bottom:26pt; }}
.cover .meta td {{ border:none; padding:2pt 14pt 2pt 0; font-size:10pt; background:none !important; }}
.cover .meta td:first-child {{ color:var(--muted); width:1.3in; }}
.cover .note {{ margin-top:28pt; padding:10pt 12pt; border-left:3px solid var(--accent); background:var(--tint); font-size:9.5pt; }}
.toc {{ font-size:10.5pt; line-height:1.8; }}
img {{ max-width:100%; border:1px solid var(--rule); border-radius:4px; margin:4pt 0; }}
</style></head><body>
<div class="cover">
  <div class="kicker">Draft for review</div>
  <h1>Robo-K9</h1>
  <div class="sub">Robot scent-detection dog: bed bug proof of concept<br>Research, build plan, bill of materials, schematics, robot link-up and hub</div>
  <table class="meta">
    <tr><td>Date</td><td>{today}</td></tr>
    <tr><td>Version</td><td>0.3 (adds the robot dog link-up and the hub)</td></tr>
    <tr><td>Target budget</td><td>≈ $3,600–4,100 recommended path; ≈ $600–800 for the Phase 0 sensor bench</td></tr>
    <tr><td>Timeline</td><td>~24 weeks to field pilot, plus an optional Phase 5 R&amp;D track</td></tr>
    <tr><td>Source</td><td><a href="https://github.com/turkokami/barber-shack/tree/claude/robot-scent-detection-dog-ih0tc9/robot-scent-dog">github.com/turkokami/barber-shack · robot-scent-dog/</a></td></tr>
  </table>
  <h3 style="margin-top:26pt">Contents</h3>{toc}
  <div class="note">Prices are approximate as of September 2026; check each purchase link at checkout.
  Firmware in the repository has been checked on simulated data only and has not run on hardware yet.</div>
</div>
{''.join(html_sections)}
</body></html>"""


def find_chrome():
    for c in [os.environ.get("CHROME"), "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
              shutil.which("chromium"), shutil.which("chromium-browser"), shutil.which("google-chrome"),
              "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"]:
        if c and os.path.exists(c):
            return c
    raise SystemExit("Chromium/Chrome not found; set CHROME=/path/to/chrome")


out = R / "Robo-K9_Build_Plan.pdf"
with tempfile.TemporaryDirectory() as tmp:
    page = pathlib.Path(tmp) / "robo-k9.html"
    page.write_text(html)
    subprocess.run([find_chrome(), "--headless", "--no-sandbox", "--disable-gpu", "--no-pdf-header-footer",
                    "--allow-file-access-from-files", f"--print-to-pdf={out}", page.as_uri()], check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
print(f"wrote {out}")
