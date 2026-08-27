'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Oznaka „ima još dole".
 *
 * Prijava vlasnice 27.08.2026: u temi 8, zadatku 2 dete nije moglo da nađe reč
 * „tasses" jer je ispala ispod ivice ekrana — a ništa na strani nije govorilo da
 * ima još sadržaja. Ni vlasnica to nije primetila, shvatila je tek kasnije.
 *
 * Izmereno na 13" laptopu: strana 978 px, prozor 760 px → 3 reči ispod ivice;
 * na manjem laptopu (1280×650) ispadne njih 7.
 *
 * Zato: kad god strana ima sadržaja ispod vidljivog dela, dole se pojavi jasna
 * oznaka sa strelicom. Nestane čim dete dođe do dna. Dete ne treba da pogađa.
 *
 * Namerno se ne oslanja samo na senku ili bledi prelaz — dete od 5 do 8 godina
 * to ne pročita kao „ima još". Zato stoji i reč, i strelica koja se pomera.
 */
const ImaJosDole = () => {
  const [vidljivo, setVidljivo] = useState(false);

  useEffect(() => {
    const proveri = () => {
      const doc = document.documentElement;
      const ukupno = doc.scrollHeight;
      const prozor = window.innerHeight;
      const dokle = window.scrollY + prozor;
      // 24 px tolerancije — da ne treperi na zaokruživanju i na sitnom odskoku
      setVidljivo(ukupno > prozor + 24 && dokle < ukupno - 24);
    };

    proveri();
    window.addEventListener('scroll', proveri, { passive: true });
    window.addEventListener('resize', proveri);
    // sadržaj zadatka se docrtava (slike, animacije), pa se meri i posle
    const posmatrac = new MutationObserver(proveri);
    posmatrac.observe(document.body, { childList: true, subtree: true });
    const tajmeri = [300, 900, 1800].map((ms) => setTimeout(proveri, ms));

    return () => {
      window.removeEventListener('scroll', proveri);
      window.removeEventListener('resize', proveri);
      posmatrac.disconnect();
      tajmeri.forEach(clearTimeout);
    };
  }, []);

  const doDna = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {vidljivo && (
        <motion.button
          type="button"
          onClick={doDna}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          // iznad trake sa „Anterior/Següent" (fixed, ~69 px)
          className="fixed bottom-[84px] left-1/2 -translate-x-1/2 z-50 flex items-center gap-2
                     rounded-full bg-[var(--primary)] px-4 py-2 text-white shadow-lg
                     text-sm font-bold"
          aria-label="Hi ha més contingut a sota"
        >
          <span>Hi ha més a sota</span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            ↓
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ImaJosDole;
