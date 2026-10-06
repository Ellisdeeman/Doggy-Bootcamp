import os
d=os.path.dirname(os.path.abspath(__file__))
r=lambda f: open(os.path.join(d,f),encoding='utf-8').read()
js="\n".join(r(f) for f in ["data1.js","data2.js","data3.js","data4.js","data5.js","data6.js","data7.js","app1.js","app2.js","app3.js"])
html=r("shell.html").replace("/*CSS*/",r("style.css")).replace("/*JS*/",js)
assert "</script" not in js.lower()
out=os.path.normpath(os.path.join(d,"..","index.html"))
open(out,"w",encoding='utf-8').write(html)
print("wrote",out,len(html),"bytes")
