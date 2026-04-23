import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { supabase } from "@/lib/supabase";

async function getLatestVehicles() {
  const { data } = await supabase
    .from("veicoli")
    .select("*")
    .eq("disponibile", true)
    .order("created_at", { ascending: false })
    .limit(6);
  return data || [];
}

export default async function HomePage() {
  const vehicles = await getLatestVehicles();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative bg-[#111111] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#250000]" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#E8000E]/10 border border-[#E8000E]/30 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 bg-[#E8000E] rounded-full animate-pulse block" />
                <span className="text-[#E8000E] text-sm font-medium">
                  Di Umberto Carrà
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight">
                Moto e Scooter
                <br />
                <span className="text-[#E8000E]">di qualità</span>
              </h1>
              <p className="mt-6 text-lg text-gray-300 max-w-lg leading-relaxed">
                Rivendita e tagliandi. La tua prossima moto ti aspetta — usato
                selezionato, prezzi trasparenti, assistenza professionale.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/vetrina"
                  className="bg-[#E8000E] text-white font-bold px-8 py-4 rounded-full hover:bg-red-700 transition-colors"
                >
                  Scopri la vetrina
                </Link>
                <Link
                  href="/tagliando"
                  className="bg-white/10 text-white border border-white/20 font-semibold px-8 py-4 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  Prenota tagliando
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#E8000E]/5 to-transparent hidden lg:block pointer-events-none" />
        </section>

        {/* ── Trust bar ── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: "🏍️", label: "Ampia scelta", sub: "Moto e scooter" },
                { icon: "🔧", label: "Officina", sub: "Tutti i servizi" },
                { icon: "✅", label: "Qualità", sub: "Usato selezionato" },
                { icon: "📞", label: "Consulenza", sub: "Sempre disponibili" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1.5">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="font-bold text-[#111111] text-sm">{item.label}</span>
                  <span className="text-gray-500 text-xs">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Veicoli recenti ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#E8000E] font-semibold text-sm uppercase tracking-widest mb-2">
                Disponibili ora
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-[#111111]">
                Ultimi arrivi
              </h2>
            </div>
            <Link
              href="/vetrina"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#111111] hover:text-[#E8000E] transition-colors"
            >
              Vedi tutti →
            </Link>
          </div>

          {vehicles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-400 text-lg">
                Nessun veicolo disponibile al momento.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Torna presto o contattaci per informazioni.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((v) => (
                <VehicleCard key={v.id} veicolo={v} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/vetrina"
              className="text-sm font-semibold text-[#111111] hover:text-[#E8000E] transition-colors"
            >
              Vedi tutta la vetrina →
            </Link>
          </div>
        </section>

        {/* ── Tagliandi ── */}
        <section className="bg-[#E8000E]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-white/70 font-semibold text-sm uppercase tracking-widest mb-3">
                  Officina
                </p>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                  Tagliandi
                  <br />e manutenzione
                </h2>
                <p className="mt-5 text-white/85 text-lg leading-relaxed">
                  Affidati a mani esperte. Tagliandi base e completi per tutte
                  le marche di moto e scooter. Prenota in pochi minuti.
                </p>
                <Link
                  href="/tagliando"
                  className="mt-8 inline-flex items-center gap-2 bg-white text-[#E8000E] font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors"
                >
                  Prenota ora →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    title: "Tagliando Base",
                    items: [
                      "Cambio olio motore",
                      "Filtro olio",
                      "Controllo freni",
                      "Verifica pneumatici",
                    ],
                  },
                  {
                    title: "Tagliando Completo",
                    items: [
                      "Tutto il base",
                      "Filtro aria",
                      "Candele",
                      "Revisione completa",
                    ],
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20"
                  >
                    <h3 className="font-bold text-white mb-3 text-sm">
                      {card.title}
                    </h3>
                    <ul className="space-y-1.5">
                      {card.items.map((item) => (
                        <li
                          key={item}
                          className="text-white/80 text-xs flex items-start gap-2"
                        >
                          <span className="text-white mt-0.5 shrink-0">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
