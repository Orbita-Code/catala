"use client";

/**
 * EFEKTI SLAVLJA — vatromet, konfete, bombone, baloni, iskre, latice.
 *
 * ZAŠTO POSTOJI (28.08.2026, zahtev vlasnice)
 * „Zašto tako lepog dizajna i profesionalno nisi uradio i celebration ekran
 *  posle svake teme? Još bi bilo sjajno kada bi posle svake teme bio drugačiji
 *  celebration ekran… sa lepim profesionalnim vatrometom, animacijama
 *  zanimljivim deci, sa konfetama, bombonama, balonima, ali da bude kao da bi
 *  ga Apple pravio."
 *
 * ZAŠTO JEDNO PLATNO, A NE STOTINU ELEMENATA
 * Konfete i vatromet traže mnogo sitnih delova u pokretu. Kad bi svaki bio svoj
 * element strane, pregledač bi za svaki kadar iznova računao raspored cele
 * strane i na detetovom laptopu bi se sve treslo. Ovde sve crta JEDNO platno
 * (`canvas`), pa je posao pregledača isti bez obzira na to ima li čestica
 * pedeset ili petsto.
 *
 * ZAŠTO NEMA NIJEDNOG EMODŽIJA
 * Emodži izgleda drugačije na svakom uređaju i uvek se vidi da je „zalepljen".
 * Bombona, balon i konfeta ovde su NACRTANI — imaju svoj oblik, senku i sjaj,
 * pa se uklapaju sa ilustracijama igre.
 *
 * ŠTA GA ČINI „SKUPIM", A NE JEFTINIM
 *   • vatromet ima uzlet, prasak, rep i gašenje — ne samo tačke koje se šire;
 *   • konfeta se OKREĆE oko svoje ose (širina joj se menja), pa deluje kao
 *     papir, a ne kao pravougaonik koji klizi;
 *   • sve pada sa otporom vazduha i blagim bočnim vetrom, ne pravolinijski;
 *   • boje su iz palete same teme, pa svaka tema ima svoj utisak.
 *
 * PRISTUPAČNOST
 * Ko je u postavkama uređaja tražio manje pokreta, dobija mirnu stranu — platno
 * se uopšte ne pokreće.
 */

import { useEffect, useRef } from "react";

export type VrstaEfekta = "vatromet" | "konfete" | "bombone" | "baloni" | "iskre" | "latice";

interface Props {
  /** Koji efekti se puštaju, i kojim redom se pojavljuju. */
  efekti: VrstaEfekta[];
  /** Boje teme — sve čestice se boje iz ove palete. */
  boje: string[];
  /** Jače slavlje kad je tema završena u celini. */
  jako?: boolean;
  /** Miran prikaz za one koji su tražili manje pokreta. */
  mirno?: boolean;
}

interface Cestica {
  vrsta: VrstaEfekta | "rep";
  x: number; y: number; vx: number; vy: number;
  boja: string; velicina: number;
  ugao: number; brzinaUgla: number;
  zivot: number; maksZivot: number;
  faza: number;
}

export default function EfektiSlavlja({ efekti, boje, jako = false, mirno = false }: Props) {
  const platno = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (mirno) return;
    const c = platno.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const gustina = Math.min(window.devicePixelRatio || 1, 2);
    let S = 0, V = 0;
    const izmeri = () => {
      S = c.clientWidth; V = c.clientHeight;
      c.width = Math.round(S * gustina);
      c.height = Math.round(V * gustina);
      ctx.setTransform(gustina, 0, 0, gustina, 0, 0);
    };
    izmeri();
    window.addEventListener("resize", izmeri);

    const cestice: Cestica[] = [];
    const boja = () => boje[Math.floor(Math.random() * boje.length)];

    /** Vatromet: granata poleti, pa prsne u krug varnica. */
    const granata = () => {
      const ciljY = V * (0.16 + Math.random() * 0.3);
      cestice.push({
        vrsta: "vatromet",
        x: S * (0.15 + Math.random() * 0.7),
        y: V + 10,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(V - ciljY) / 62,
        boja: boja(),
        velicina: 3,
        ugao: 0, brzinaUgla: 0,
        zivot: 0, maksZivot: 62,
        faza: ciljY,
      });
    };

    const prasak = (x: number, y: number, b: string) => {
      const koliko = jako ? 46 : 34;
      for (let i = 0; i < koliko; i++) {
        const a = (Math.PI * 2 * i) / koliko + Math.random() * 0.12;
        const brzina = 1.9 + Math.random() * 2.6;
        cestice.push({
          vrsta: "rep",
          x, y,
          vx: Math.cos(a) * brzina,
          vy: Math.sin(a) * brzina,
          boja: Math.random() < 0.22 ? "#ffffff" : b,
          velicina: 1.6 + Math.random() * 1.8,
          ugao: 0, brzinaUgla: 0,
          zivot: 0, maksZivot: 64 + Math.random() * 26,
          faza: 0,
        });
      }
    };

    const konfeta = () => cestice.push({
      vrsta: "konfete",
      x: Math.random() * S, y: -20,
      vx: (Math.random() - 0.5) * 1.4, vy: 1.1 + Math.random() * 1.5,
      boja: boja(), velicina: 6 + Math.random() * 7,
      ugao: Math.random() * Math.PI, brzinaUgla: (Math.random() - 0.5) * 0.22,
      zivot: 0, maksZivot: 460, faza: Math.random() * Math.PI * 2,
    });

    const bombona = () => cestice.push({
      vrsta: "bombone",
      x: Math.random() * S, y: -24,
      vx: (Math.random() - 0.5) * 0.9, vy: 1 + Math.random() * 1.2,
      boja: boja(), velicina: 7 + Math.random() * 5,
      ugao: Math.random() * Math.PI, brzinaUgla: (Math.random() - 0.5) * 0.1,
      zivot: 0, maksZivot: 520, faza: Math.random() * Math.PI * 2,
    });

    const balon = () => cestice.push({
      vrsta: "baloni",
      x: S * (0.06 + Math.random() * 0.88), y: V + 40,
      vx: 0, vy: -(0.55 + Math.random() * 0.55),
      boja: boja(), velicina: 15 + Math.random() * 13,
      ugao: 0, brzinaUgla: 0,
      zivot: 0, maksZivot: 900, faza: Math.random() * Math.PI * 2,
    });

    const iskra = () => cestice.push({
      vrsta: "iskre",
      x: Math.random() * S, y: V * (0.35 + Math.random() * 0.65),
      vx: (Math.random() - 0.5) * 0.3, vy: -(0.25 + Math.random() * 0.5),
      boja: Math.random() < 0.5 ? "#ffffff" : boja(),
      velicina: 1.4 + Math.random() * 2.4,
      ugao: 0, brzinaUgla: 0,
      zivot: 0, maksZivot: 200 + Math.random() * 120, faza: Math.random() * Math.PI * 2,
    });

    const latica = () => cestice.push({
      vrsta: "latice",
      x: Math.random() * S, y: -20,
      vx: (Math.random() - 0.5) * 0.7, vy: 0.6 + Math.random() * 0.7,
      boja: boja(), velicina: 5 + Math.random() * 5,
      ugao: Math.random() * Math.PI, brzinaUgla: (Math.random() - 0.5) * 0.06,
      zivot: 0, maksZivot: 620, faza: Math.random() * Math.PI * 2,
    });

    const napravi: Record<VrstaEfekta, () => void> = {
      vatromet: granata, konfete: konfeta, bombone: bombona,
      baloni: balon, iskre: iskra, latice: latica,
    };

    // Prvi nalet — da strana odmah „prasne", a ne da se puni pred detetom.
    for (const e of efekti) {
      const koliko = e === "vatromet" ? (jako ? 3 : 2)
        : e === "baloni" ? (jako ? 9 : 6)
        : e === "iskre" ? 28
        : jako ? 60 : 40;
      for (let i = 0; i < koliko; i++) napravi[e]();
    }

    let kadar = 0;
    let radi = true;

    const crtajKonfetu = (p: Cestica) => {
      // Širina se menja kroz vreme — tako papir izgleda kao da se okreće.
      const s = Math.abs(Math.cos(p.faza + kadar * 0.055)) * p.velicina + 1.5;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.ugao);
      ctx.fillStyle = p.boja;
      ctx.globalAlpha = Math.min(1, (p.maksZivot - p.zivot) / 60);
      ctx.fillRect(-s / 2, -p.velicina / 2, s, p.velicina);
      ctx.restore();
    };

    const crtajBombonu = (p: Cestica) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.ugao + Math.sin(p.faza + kadar * 0.03) * 0.35);
      ctx.globalAlpha = Math.min(1, (p.maksZivot - p.zivot) / 60);
      const r = p.velicina;
      // omot levo i desno
      ctx.fillStyle = p.boja;
      ctx.beginPath();
      ctx.moveTo(-r * 1.85, -r * 0.75); ctx.lineTo(-r * 0.85, 0); ctx.lineTo(-r * 1.85, r * 0.75);
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(r * 1.85, -r * 0.75); ctx.lineTo(r * 0.85, 0); ctx.lineTo(r * 1.85, r * 0.75);
      ctx.closePath(); ctx.fill();
      // telo
      ctx.beginPath();
      ctx.ellipse(0, 0, r, r * 0.78, 0, 0, Math.PI * 2);
      ctx.fill();
      // sjaj
      ctx.globalAlpha *= 0.55;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.ellipse(-r * 0.3, -r * 0.28, r * 0.34, r * 0.2, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const crtajBalon = (p: Cestica) => {
      const nj = Math.sin(p.faza + kadar * 0.017) * 16;
      const x = p.x + nj, y = p.y;
      const r = p.velicina;
      ctx.save();
      ctx.globalAlpha = Math.min(1, p.zivot / 30) * Math.min(1, (p.maksZivot - p.zivot) / 90);
      // konac
      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y + r * 1.18);
      ctx.quadraticCurveTo(x + Math.sin(kadar * 0.03 + p.faza) * 7, y + r * 2.1, x, y + r * 3);
      ctx.stroke();
      // telo balona
      ctx.fillStyle = p.boja;
      ctx.beginPath();
      ctx.ellipse(x, y, r * 0.84, r * 1.06, 0, 0, Math.PI * 2);
      ctx.fill();
      // čvor
      ctx.beginPath();
      ctx.moveTo(x - r * 0.16, y + r * 1.04);
      ctx.lineTo(x + r * 0.16, y + r * 1.04);
      ctx.lineTo(x, y + r * 1.28);
      ctx.closePath();
      ctx.fill();
      // sjaj — bez njega balon izgleda kao ravan krug
      ctx.globalAlpha *= 0.5;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.ellipse(x - r * 0.28, y - r * 0.34, r * 0.2, r * 0.34, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const crtajLaticu = (p: Cestica) => {
      ctx.save();
      ctx.translate(p.x + Math.sin(p.faza + kadar * 0.02) * 14, p.y);
      ctx.rotate(p.ugao + Math.sin(p.faza + kadar * 0.02) * 0.6);
      ctx.globalAlpha = Math.min(1, (p.maksZivot - p.zivot) / 80);
      ctx.fillStyle = p.boja;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.velicina, p.velicina * 0.52, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const petlja = () => {
      if (!radi) return;
      kadar++;
      ctx.clearRect(0, 0, S, V);

      // Dolivanje: efekti se stalno obnavljaju, ali retko, da strana ne oteža.
      for (const e of efekti) {
        const svakih = e === "vatromet" ? (jako ? 34 : 52)
          : e === "baloni" ? (jako ? 46 : 70)
          : e === "iskre" ? 6
          : jako ? 3 : 5;
        if (kadar % svakih === 0) napravi[e]();
      }

      for (let i = cestice.length - 1; i >= 0; i--) {
        const p = cestice[i];
        p.zivot++;

        if (p.vrsta === "vatromet") {
          p.x += p.vx; p.y += p.vy; p.vy += 0.045;
          // rep granate dok se penje
          ctx.globalAlpha = 0.85;
          ctx.fillStyle = p.boja;
          ctx.beginPath(); ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2); ctx.fill();
          if (p.y <= p.faza || p.vy >= 0) { prasak(p.x, p.y, p.boja); cestice.splice(i, 1); }
          continue;
        }

        if (p.vrsta === "rep") {
          p.x += p.vx; p.y += p.vy;
          p.vx *= 0.975; p.vy = p.vy * 0.975 + 0.035;
          const ostalo = 1 - p.zivot / p.maksZivot;
          ctx.globalAlpha = Math.max(0, ostalo) * 0.95;
          ctx.fillStyle = p.boja;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.velicina * ostalo + 0.4, 0, Math.PI * 2); ctx.fill();
          if (p.zivot > p.maksZivot) cestice.splice(i, 1);
          continue;
        }

        if (p.vrsta === "iskre") {
          p.x += p.vx; p.y += p.vy;
          const t = p.zivot / p.maksZivot;
          ctx.globalAlpha = Math.sin(Math.PI * t) * 0.9;
          ctx.fillStyle = p.boja;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.velicina, 0, Math.PI * 2); ctx.fill();
          if (p.zivot > p.maksZivot) cestice.splice(i, 1);
          continue;
        }

        if (p.vrsta === "baloni") {
          p.y += p.vy;
          crtajBalon(p);
          if (p.y < -p.velicina * 4) cestice.splice(i, 1);
          continue;
        }

        // konfete, bombone i latice padaju sa otporom vazduha i blagim vetrom
        p.vy = Math.min(p.vy + 0.014, p.vrsta === "latice" ? 1.5 : 3.1);
        p.x += p.vx + Math.sin(p.faza + kadar * 0.02) * 0.5;
        p.y += p.vy;
        p.ugao += p.brzinaUgla;
        if (p.vrsta === "konfete") crtajKonfetu(p);
        else if (p.vrsta === "bombone") crtajBombonu(p);
        else crtajLaticu(p);
        if (p.y > V + 40 || p.zivot > p.maksZivot) cestice.splice(i, 1);
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(petlja);
    };
    requestAnimationFrame(petlja);

    return () => {
      radi = false;
      window.removeEventListener("resize", izmeri);
    };
  }, [efekti, boje, jako, mirno]);

  if (mirno) return null;

  return (
    <canvas
      ref={platno}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-20 h-full w-full"
    />
  );
}
