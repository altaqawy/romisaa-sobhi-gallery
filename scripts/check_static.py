"""Static-site sanity checks. No dependencies or secrets required."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import sys

ROOT = Path(__file__).resolve().parent.parent
HTMLS = sorted(ROOT.glob("*.html"))
REQUIRED = ["index.html","shop.html","cart.html","checkout.html",
            "studio.html","finder.html","lookbook.html","learn.html",
            "atelier-desk.html"]
issues = []
for required in REQUIRED:
    if not (ROOT / required).is_file():
        issues.append("Required page missing: " + required)

class Check(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.local_urls = []
        self.headings = 0
        self.has_lang = False
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html" and a.get("lang"):
            self.has_lang = True
        if tag == "h1":
            self.headings += 1
        if tag in ("a", "img", "script", "link", "source"):
            key = "href" if tag in ("a","link") else "src"
            val = a.get(key)
            if val:
                self.local_urls.append((tag, val))
    handle_startendtag = handle_starttag

for page in HTMLS:
    c = Check(page)
    c.feed(page.read_text(encoding="utf-8"))
    if not c.has_lang: issues.append(page.name + ": missing html lang")
    if not c.headings: issues.append(page.name + ": missing h1")
    for tag, val in c.local_urls:
        parsed = urlsplit(val)
        if parsed.scheme or parsed.netloc or val.startswith(("#", "//", "mailto:", "tel:", "data:")):
            continue
        rel = unquote(parsed.path)
        if not rel: continue
        target = (page.parent / rel).resolve()
        try: target.relative_to(ROOT.resolve())
        except ValueError:
            issues.append(page.name + ": reference escapes repository: " + val)
            continue
        if not target.is_file() and not target.is_dir():
            issues.append(page.name + ": broken " + tag + " reference: " + val)
print(f"Checked {len(HTMLS)} HTML pages and their local file references.")
if issues:
    print("\n".join("FAIL: " + x for x in issues))
    sys.exit(1)
print("Static site references: OK")
