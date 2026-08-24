#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GENERISANJE ILUSTRACIJE PREKO ChatGPT-a U NJENOM PRAVOM CHROME-U.

Zašto ovako: ChatGPT nalog je prijavljen preko Apple ID-a i lozinka nije
poznata, pa Playwright (prazan profil) ne može da uđe. AppleScript upravlja
Chrome-om u kom je ona već prijavljena.

    python3 scripts/gen-sliku.py "PROMPT" izlaz.png

ZAMKE (skupo naučene — v. memoriju `reference_katalonski_image_regen`):
  1. Prompt se prosleđuje kroz DVA sloja navodnika (AppleScript → JS). Zato se
     escapovanje radi ovde, u Pythonu, a ne u bash-u — ranija bash verzija je
     pucala na svakom apostrofu i navodniku.
  2. Ako generacija ne uspe, broj slika u razgovoru NE poraste, pa bi se
     preuzela STARA slika (ranije se tako dobio prsten umesto minđuša).
     Zato se broji pre i posle, i staje se ako nije poraslo.
  3. Sliku UVEK pogledati pre ugradnje.
  4. Chrome mora imati: View → Developer → Allow JavaScript from Apple Events.
"""
import base64, subprocess, sys, time

GPT = "g-p-697a9ef9e7fc8191a6f01584dad8ea4d"

def js(kod: str) -> str:
    """Izvrši JS na ChatGPT tabu njenog Chrome-a i vrati rezultat kao tekst."""
    # AppleScript string: udvostruči obrnutu kosu crtu pa navodnik
    a = kod.replace("\\", "\\\\").replace('"', '\\"')
    skripta = f'''
tell application "Google Chrome"
  repeat with w in windows
    repeat with t in tabs of w
      if URL of t contains "{GPT}" then
        return execute t javascript "{a}"
      end if
    end repeat
  end repeat
  return "NEMA_TABA"
end tell'''
    r = subprocess.run(["osascript", "-e", skripta], capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.strip())
    return r.stdout.strip()

BROJ = "(function(){return [...document.querySelectorAll('img')].filter(i=>/oaiusercontent|estuary/.test(i.src)).length})()"
POSLEDNJA = "(function(){var s=[...document.querySelectorAll('img')].filter(i=>/oaiusercontent|estuary/.test(i.src));return s.length?s[s.length-1].src:'NEMA'})()"


def preuzmi_kroz_stranu(url: str) -> bytes:
    """
    Preuzmi sliku kroz samu stranu ChatGPT-a.

    ZAŠTO OVAKO: `execute javascript` iz AppleScript-a NE ČEKA obećanje
    (`Promise`) — vraća prazno pre nego što se preuzimanje završi. Zato se
    posao pokrene, rezultat ostavi u `window.__slika`, pa se ODVOJENIM
    pozivima čeka i čita. Uz to se čita u parčadima, jer se dugačak tekst
    kroz AppleScript preseca.
    """
    import json as _json
    js("(function(){window.__slika=null;window.__greska=null;"
       "fetch(" + _json.dumps(url) + ").then(r=>r.blob()).then(b=>{var f=new FileReader();"
       "f.onload=function(){window.__slika=f.result};f.readAsDataURL(b)})"
       ".catch(e=>{window.__greska=String(e)});return 'krenulo'})()")
    for _ in range(60):
        time.sleep(1)
        st = js("(function(){return window.__greska?('GRESKA '+window.__greska):"
                "(window.__slika?String(window.__slika.length):'ceka')})()")
        if st.startswith("GRESKA"):
            raise RuntimeError(st)
        if st.isdigit():
            duzina = int(st)
            break
    else:
        raise RuntimeError("preuzimanje kroz stranu je isteklo")

    KORAK = 60000
    delovi = []
    for poc in range(0, duzina, KORAK):
        delovi.append(js(f"(function(){{return window.__slika.slice({poc},{poc + KORAK})}})()"))
    ceo = "".join(delovi)
    return base64.b64decode(ceo.split(",", 1)[1])

def main():
    prompt, izlaz = sys.argv[1], sys.argv[2]

    pre = js(BROJ)
    if pre == "NEMA_TABA":
        sys.exit('GREŠKA: nije nađen ChatGPT tab sa custom GPT-om „Igrice katalonski jezik”.')
    pre = int(pre)
    print(f"slika u razgovoru pre: {pre}")

    # JSON.stringify sređuje navodnike unutar samog JS-a
    import json
    tekst = json.dumps(prompt)
    unos = ("(function(){var e=document.querySelector('#prompt-textarea')||"
            "document.querySelector('div[contenteditable=true]');if(!e)return 'NEMA_POLJA';"
            "e.focus();document.execCommand('selectAll',false,null);"
            f"document.execCommand('insertText',false,{tekst});"
            "return 'upisano znakova: '+(e.innerText||'').length})()")
    print("unos:", js(unos))
    time.sleep(1.5)

    salji = ("(function(){var b=document.querySelector('button[data-testid=send-button]')||"
             "[...document.querySelectorAll('button')].find(x=>/send|envia/i.test(x.getAttribute('aria-label')||''));"
             "if(!b)return 'NEMA_DUGMETA';if(b.disabled)return 'ZAKLJUCANO';b.click();return 'poslato'})()")
    print("slanje:", js(salji))

    print("čekam sliku", end="", flush=True)
    for i in range(90):
        time.sleep(10)
        try:
            sad = int(js(BROJ))
        except Exception:
            sad = pre
        print(".", end="", flush=True)
        if sad > pre:
            print(f" nova slika je tu ({pre} → {sad})")
            break
    else:
        sys.exit("\nISTEKLO VREME — nema nove slike. Proveri da nije ograničenje broja generacija.")

    time.sleep(4)
    url = js(POSLEDNJA)
    if url == "NEMA":
        sys.exit("GREŠKA: slika nije nađena u strani.")

    # 1) curl (adresa je potpisana), 2) ako ne prođe — kroz samu stranu
    r = subprocess.run(["curl", "-sfL", url, "-o", izlaz])
    import os
    if r.returncode != 0 or not os.path.exists(izlaz) or os.path.getsize(izlaz) == 0:
        print("curl nije prošao — preuzimam kroz stranu")
        open(izlaz, "wb").write(preuzmi_kroz_stranu(url))

    print(f"preuzeto: {izlaz} ({os.path.getsize(izlaz)} bajtova)")
    print("POGLEDAJ SLIKU PRE UGRADNJE.")

main()
