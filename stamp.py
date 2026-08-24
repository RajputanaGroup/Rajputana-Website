#!/usr/bin/env python3
"""
stamp.py — rewrite every CSS/JS link with a hash of that file's contents.

Why this exists
---------------
A hand-typed version string (`?v=2026-08-20a`) only busts the cache if you
remember to change it. Forget once, and browsers keep serving the stylesheet
they cached the first time — new HTML, old CSS, broken page. That happened.

A content hash cannot be forgotten. Change one byte of a stylesheet and its
hash changes, so the URL changes, so every browser refetches. Leave a file
alone and its hash is stable, so it stays cached.

Usage
-----
    python3 stamp.py

Run it after editing anything in assets/css/ or assets/js/, before you upload.
It rewrites the <link> and <script> tags in every .html file in place.
"""

import hashlib
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).parent


def digest(path: pathlib.Path) -> str:
    return hashlib.md5(path.read_bytes()).hexdigest()[:8]


def main() -> int:
    pages = sorted(ROOT.glob("*.html")) + sorted(ROOT.glob("*/*.html"))
    if not pages:
        print("No HTML files found next to stamp.py")
        return 1

    total = 0
    for page in pages:
        text = page.read_text()
        original = text

        def restamp(match: re.Match) -> str:
            prefix, asset = match.group(1), match.group(2)
            target = (page.parent / prefix / asset).resolve()
            if not target.exists():
                print(f"  ! {page.name}: {asset} not found, left alone")
                return match.group(0)
            return f'{prefix}{asset}?v={digest(target)}"'

        text = re.sub(r'((?:\.\./)*)(assets/(?:css|js)/[A-Za-z0-9_-]+\.(?:css|js))(?:\?[^"]*)?"',
                      restamp, text)

        if text != original:
            page.write_text(text)
            stamped = len(re.findall(r'assets/(?:css|js)/[^"]*\?v=', text))
            total += stamped
            print(f"  {page.relative_to(ROOT)}: {stamped} links stamped")

    print(f"\nDone. {total} asset links now carry a content hash.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
