import base64, pathlib, re, mimetypes
d = pathlib.Path(__file__).parent
src = (d/'page.html').read_text()
def uri(f):
    mt = mimetypes.guess_type(f)[0]
    return 'data:%s;base64,' % mt + base64.b64encode((d/f).read_bytes()).decode()
IMG = re.compile(r'\{\{IMG:([^}]+)\}\}')
# Standalone site
head, rest = src.split('<style>', 1)
site = ('<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        '<link rel="icon" href="logo-badge.jpg">\n' + head + '<style>' + rest.split('</style>',1)[0] + '</style>\n</head>\n<body>\n'
        + rest.split('</style>',1)[1] + '\n</body>\n</html>\n')
site = site.replace('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'three.min.js')
site = site.replace('{{LOGO_WHITE}}', 'logo-white.png').replace('{{LOGO_NAVY}}', 'logo-navy.png')
site = IMG.sub(lambda m: m.group(1), site)
(d/'index.html').write_text(site)
# Self-contained preview (Artifact)
art = src.replace('{{LOGO_WHITE}}', uri('logo-white.png')).replace('{{LOGO_NAVY}}', uri('logo-navy.png'))
art = IMG.sub(lambda m: uri(m.group(1)), art)
out = pathlib.Path('/tmp/claude-0/-home-user-Ronny-Professional/b2e68831-4dd3-55fc-acce-178f702a10e1/scratchpad/jshaustechnik.html')
out.write_text(art)
print('ok', len(site), len(art))
