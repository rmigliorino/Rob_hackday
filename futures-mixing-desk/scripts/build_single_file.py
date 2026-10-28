"""Inline styles.css and the js/ files into one shareable HTML file at dist/futures-mixing-desk.html."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "dist" / "futures-mixing-desk.html"


def main():
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    css = (ROOT / "styles.css").read_text(encoding="utf-8")
    html = html.replace('<link rel="stylesheet" href="styles.css">', f"<style>\n{css}\n</style>")

    def inline_script(m):
        js = (ROOT / m.group(1)).read_text(encoding="utf-8").replace("</script", "<\\/script")
        return f"<script>\n{js}\n</script>"

    html = re.sub(r'<script src="(js/[^"]+)"></script>', inline_script, html)
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(html, encoding="utf-8")
    print(f"Wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
