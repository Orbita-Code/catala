/**
 * DIJAGNOSTIKA MIKROFONA — uređaj sam javi zašto ne radi.
 *
 * ZAŠTO POSTOJI (14.08.2026): mikrofon radi na maminom Mac-u, a na detetovom
 * laptopu ne. Nekoliko krugova je otišlo na to da vlasnica prepisuje poruke sa
 * ekrana, a to je i sporo i nije njen posao. Sada uređaj sam pošalje kratak
 * tehnički izveštaj, a on završi u dnevniku kontejnera (`docker logs`).
 *
 * ŠALJE SE SAMO TEHNIKA: koji pregledač, da li je veza bezbedna, postoji li
 * prepoznavanje govora, stanje dozvole, broj mikrofona i naziv greške.
 * Nema imena, nema napretka deteta, nema ičega ličnog — i tako mora ostati.
 */
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const p = await req.json();
    // Namerno u jednom redu i sa prepoznatljivim prefiksom, da se lako izvuče:
    //   docker logs <kontejner> 2>&1 | grep MIKROFON
    console.log(
      "[MIKROFON] " +
        JSON.stringify({
          kada: new Date().toISOString(),
          gde: String(p?.gde ?? "?").slice(0, 40),
          pregledac: String(p?.pregledac ?? "?").slice(0, 60),
          bezbedno: !!p?.bezbedno,
          imaPrepoznavanje: !!p?.imaPrepoznavanje,
          dozvola: String(p?.dozvola ?? "?").slice(0, 20),
          mikrofona: Number(p?.mikrofona ?? -1),
          greska: String(p?.greska ?? "").slice(0, 60),
        })
    );
  } catch {
    console.log("[MIKROFON] neispravan izveštaj");
  }
  // Uvek 204: dijagnostika ne sme ni na koji način da smeta detetu.
  return new NextResponse(null, { status: 204 });
}
