"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { supabase } from "@/lib/supabase";

const FASCE = [
  { label: "Tutti i prezzi", value: "tutti" },
  { label: "Fino a €3.000", value: "under3k" },
  { label: "€3.000 – €8.000", value: "3k8k" },
  { label: "Oltre €8.000", value: "over8k" },
];

export default function VetrinaPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tipo, setTipo] = useState("tutti");
  const [fascia, setFascia] = useState("tutti");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      let q = supabase
        .from("veicoli")
        .select("*")
        .eq("disponibile", true)
        .order("created_at", { ascending: false });

      if (tipo !== "tutti") q = q.eq("tipo", tipo);
      if (fascia === "under3k") q = q.lt("prezzo", 3000);
      else if (fascia === "3k8k") q = q.gte("prezzo", 3000).lte("prezzo", 8000);
      else if (fascia === "over8k") q = q.gt("prezzo", 8000);

      const { data } = await q;
      if (!cancelled) {
        setVehicles(data || []);
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [tipo, fascia]);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Page header */}
        <div className="bg-[#111111] text-white py-14 px-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-[#E8000E] font-semibold text-sm uppercase tracking-widest mb-2">
              UC Motors
            </p>
            <h1 className="text-4xl md:text-5xl font-black">
              Vetrina Veicoli
            </h1>
            <p className="mt-2 text-gray-400">
              Sfoglia il nostro parco veicoli aggiornato
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Filtri */}
          <div className="flex flex-wrap gap-6 mb-10 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-[#333333]">Tipo:</span>
              {["tutti", "moto", "scooter"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTipo(t)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                    tipo === t
                      ? "bg-[#E8000E] text-white"
                      : "bg-white text-[#333333] border border-gray-200 hover:border-[#E8000E] hover:text-[#E8000E]"
                  }`}
                >
                  {t === "tutti" ? "Tutti" : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#333333]">
                Prezzo:
              </span>
              <select
                value={fascia}
                onChange={(e) => setFascia(e.target.value)}
                className="text-sm border border-gray-200 rounded-full px-4 py-1.5 bg-white text-[#333333] focus:outline-none focus:border-[#E8000E]"
              >
                {FASCE.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Griglia */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
                >
                  <div className="h-52 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🏍️</p>
              <h3 className="text-xl font-bold text-[#111111] mb-2">
                Nessun veicolo disponibile al momento
              </h3>
              <p className="text-gray-500">
                Prova a cambiare i filtri o torna presto per nuovi arrivi.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6">
                {vehicles.length} veicol{vehicles.length === 1 ? "o" : "i"}{" "}
                trovat{vehicles.length === 1 ? "o" : "i"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((v) => (
                  <VehicleCard key={v.id} veicolo={v} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
