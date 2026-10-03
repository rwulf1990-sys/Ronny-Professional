import base64, pathlib
d = pathlib.Path(__file__).parent
src = (d/'page.html').read_text()
def uri(f): return 'data:image/png;base64,' + base64.b64encode((d/f).read_bytes()).decode()
# Standalone site
head, rest = src.split('<style>', 1)
site = ('<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        '<link rel="icon" href="logo-badge.jpg">\n' + head + '<style>' + rest.split('</style>',1)[0] + '</style>\n</head>\n<body>\n'
        + rest.split('</style>',1)[1] + '\n</body>\n</html>\n')
site = site.replace('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'three.min.js').replace('{{LOGO_WHITE}}', 'logo-white.png').replace('{{LOGO_NAVY}}', 'logo-navy.png')
(d/'index.html').write_text(site)
# Self-contained preview (Artifact)
art = src.replace('{{LOGO_WHITE}}', uri('logo-white.png')).replace('{{LOGO_NAVY}}', uri('logo-navy.png'))
out = pathlib.Path('/tmp/claude-0/-home-user-Ronny-Professional/b2e68831-4dd3-55fc-acce-178f702a10e1/scratchpad/jshaustechnik.html')
out.parent.mkdir(parents=True, exist_ok=True); out.write_text(art)
print('ok', len(site), len(art))
