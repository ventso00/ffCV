from pathlib import Path
import base64,json
root=Path(__file__).parent
assets={}
for name,mime in [('card-background.webp','image/webp'),('concept-cutout.webp','image/webp'),('icon-192.png','image/png'),('icon-512.png','image/png')]:
 assets['/'+name]={'base64':base64.b64encode((root/'assets'/name).read_bytes()).decode(),'type':mime}
prefix='const page='+json.dumps((root/'page.html').read_text())+';\nconst app='+json.dumps((root/'app.js').read_text())+';\nconst css='+json.dumps((root/'style.css').read_text())+';\nconst assets='+json.dumps(assets)+';\n'
(root/'worker/index.js').write_text(prefix+(root/'server.js').read_text())
