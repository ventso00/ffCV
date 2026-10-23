from pathlib import Path
import base64,json
root=Path(__file__).parent
art=base64.b64encode((root/'assets/concept-reference.jpg').read_bytes()).decode()
page=(root/'page.html').read_text();js=(root/'app.js').read_text()
prefix='const page='+json.dumps(page)+';\nconst app='+json.dumps(js)+';\nconst art='+json.dumps(art)+';\n'
(root/'worker/index.js').write_text(prefix+(root/'server.js').read_text())
