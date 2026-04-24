import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-baseline gap-0.5 mb-4">
              <span className="text-3xl font-black text-white tracking-tighter">
                UC
              </span>
              <span className="text-sm font-bold italic text-[#E8000E] tracking-widest uppercase ml-1">
                motors
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Di Umberto Carrà
              <br />
              Rivendita moto e scooter
              <br />
              Tagliandi e manutenzione
            </p>
          </div>

          {/* Contatti */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#E8000E] mb-4">
              Contatti
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="tel:+393921642318"
                  className="hover:text-white transition-colors"
                >
                  📞 +39 392 164 2318
                </a>
              </li>
              <li>
                <a
                  href="mailto:Umbertocarra@icloud.com"
                  className="hover:text-white transition-colors"
                >
                  ✉️ Umbertocarra@icloud.com
                </a>
              </li>
            </ul>
          </div>

          {/* Orari */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#E8000E] mb-4">
              Orari
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex justify-between gap-4">
                <span>Lun – Ven</span>
                <span>09:00 – 18:00</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Sabato</span>
                <span>09:00 – 13:00</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Domenica</span>
                <span className="text-gray-500">Chiuso</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} UC Motors di Umberto Carrà. Tutti i
            diritti riservati.
          </p>
          <Link
            href="/admin"
            className="hover:text-gray-400 transition-colors"
          >
            Area riservata
          </Link>
        </div>
      </div>
    </footer>
  );
}
