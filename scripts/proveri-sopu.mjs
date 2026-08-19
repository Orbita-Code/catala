import fs from "fs";
const PRAVCI = [[0,1],[1,0],[1,1],[1,-1],[0,-1],[-1,0],[-1,-1],[-1,1]];
const osn = (r) => r.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z]/g,"");
function nadji(m, rec){ const w=osn(rec), n=m.length;
  for(let r=0;r<n;r++)for(let c=0;c<n;c++)for(const [dr,dc] of PRAVCI){
    const r1=r+dr*(w.length-1), c1=c+dc*(w.length-1);
    if(r1<0||r1>=n||c1<0||c1>=n)continue; let ok=true;
    for(let i=0;i<w.length;i++) if(m[r+dr*i][c+dc*i]!==w[i]){ok=false;break;}
    if(ok)return true;} return false; }
let ukupno=0, lose=0;
for (const f of fs.readdirSync("src/data").filter(x=>x.endsWith(".ts")&&!["themes.ts","task-data.ts"].includes(x))) {
  const s=fs.readFileSync("src/data/"+f,"utf8");
  for (const m of s.matchAll(/words: \[([^\]]*)\],\s*\n\s*grid: \[([\s\S]*?)\n\s*\],/g)) {
    const reci=[...m[1].matchAll(/"([^"]+)"/g)].map(x=>x[1]);
    const mreza=[...m[2].matchAll(/\[([^\]]*)\]/g)].map(r=>[...r[1].matchAll(/"([^"]*)"/g)].map(x=>x[1]));
    if(!mreza.length) continue;
    for(const r of reci){ ukupno++; if(!nadji(mreza,r)){ lose++; console.log(`  ✗ ${f}: „${r}" NIJE u mreži`);} }
  }
}
console.log(`provereno ${ukupno} reči u mrežama, nedostaje: ${lose}`);
