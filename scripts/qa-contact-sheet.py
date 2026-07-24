import sys, re, os, subprocess, unicodedata, tempfile
slug=sys.argv[1]
proj="/Users/jovana.jovic/Desktop/Projects/Katalonski"
sc="/private/tmp/claude-501/-Users-jovana-jovic/e13bc652-d4ee-4af1-a704-9868fec6ce90/scratchpad"
data=open(f"{proj}/src/data/{slug}.ts").read()
words=set()
for m in re.finditer(r'(?:catalan|word|correct|targetItem|item|image):\s*"([^"]+)"', data):
    words.add(m.group(1).strip())
def key(w):
    s=unicodedata.normalize('NFD',w); s=''.join(c for c in s if unicodedata.category(c)!='Mn')
    s=s.replace('·','-').lower(); return re.sub(r"[\s']+","-",s)
existing=[]; missing=[]; broken=[]; seen=set()
os.makedirs(f"{sc}/tmp_{slug}", exist_ok=True)
for w in sorted(words):
    k=key(w)
    if k in seen: continue
    seen.add(k)
    p=f"{proj}/public/illustrations/{k}.webp"
    if not os.path.exists(p): missing.append(w); continue
    # validate + convert to png
    tp=f"{sc}/tmp_{slug}/{k}.png"
    r=subprocess.run(["magick",p,"-resize","200x200",tp],capture_output=True)
    if r.returncode!=0 or not os.path.exists(tp): broken.append(w); continue
    existing.append((w,tp))
args=["montage"]
for w,tp in existing: args+=["-label",w,tp]
args+=["-tile","5x","-geometry","200x200+6+24","-background","white","-pointsize","22",f"{sc}/_ct_{slug}.png"]
subprocess.run(args,check=True)
print(f"{slug}: {len(existing)} slika")
if broken: print("  OŠTEĆENE: "+", ".join(broken))
if missing: print("  BEZ slike: "+", ".join(missing))
