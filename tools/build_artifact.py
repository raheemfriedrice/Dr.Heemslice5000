"""Inline inconvenience.html + its CSS/JS into one file for the claude.ai artifact."""
import re, sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
html = (root / 'inconvenience.html').read_text()
title = re.search(r'<title>.*?</title>', html).group(0)
fonts = re.search(r'<link href="https://fonts\.googleapis\.com[^>]*>', html).group(0)
body = html[html.index('<body>') + 6:html.index('<script src=')].strip()
css = (root / 'assets/css/inconvenience.css').read_text()
js = ''.join((root / 'assets/js' / f).read_text() for f in ('inconvenience.js', 'connect4.js'))
out = f'{title}\n{fonts}\n<style>\n{css}</style>\n\n{body}\n\n<script>\n{js}</script>\n'
Path(sys.argv[1]).write_text(out)
print(f'wrote {sys.argv[1]} ({len(out):,} bytes)')
