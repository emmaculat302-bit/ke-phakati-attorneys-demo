import re
from pathlib import Path

root = Path(__file__).parent
html_path = root / "index.html"
html = html_path.read_text()
css = (root / "styles.css").read_text()
js = (root / "app.js").read_text()

style_block = f'<style>\n{css}\n</style>'
script_block = f'<script>\n{js}\n</script>'

if '<style>' in html:
    html = re.sub(r'<style>.*?</style>', lambda _: style_block, html, count=1, flags=re.S)
else:
    html = html.replace('<link rel="stylesheet" href="styles.css" />', style_block, 1)

if '<script>' in html:
    html = re.sub(r'<script>.*?</script>', lambda _: script_block, html, count=1, flags=re.S)
else:
    html = html.replace('<script src="app.js"></script>', script_block, 1)

html_path.write_text(html)
print(f"Bundled {html_path.name}: inline CSS and JavaScript refreshed")
