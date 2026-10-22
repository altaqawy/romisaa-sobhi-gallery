#!/usr/bin/env python3
"""Static demo integrity smoke-check: links/assets/HTML anchors, not a payment test."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import sys

ROOT = Path(__file__).resolve().parents[1]
class Inspector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.ids = set()
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if "id" in d:
            self.ids.add(d["id"])
        for attr in ("src","href"):
            v = d.get(attr)
            if v:
                self.links.append((tag,attr,v))

errors = []
pages = sorted(ROOT.glob("*.html"))
if len(pages) < 14:
    errors.append(f"Expected 14+ pages, found {len(pages)}")
for page in pages:
    parser = Inspector()
    try:
        parser.feed(page.read_text(encoding="utf8"))
    except Exception as e:
        errors.append(f"{page.name}: invalid parser input {e}")
        continue
    if not parser.ids.intersection({"main"}):
        errors.append(f"{page.name}: missing #main")
    for tag,attr,uri in parser.links:
        if uri.startswith(("#","mailto:","tel:","data:","javascript:","//")):
            continue
        ref = urlsplit(uri)
        if ref.scheme or ref.netloc:
            continue
        path = unquote(ref.path)
        if path.startswith("/"):
            errors.append(f"{page.name}: root absolute path risks GitHub Pages subpath: {uri}")
        elif path and not (ROOT / path).is_file():
            errors.append(f"{page.name}: missing {path}")
if errors:
    print("\n".join("FAIL: "+e for e in errors))
    sys.exit(1)
print(f"PASS: {len(pages)} HTML pages, all local src/href targets exist")
