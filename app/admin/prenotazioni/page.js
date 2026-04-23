"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { supabase } from "@/lib/supabase";

const STATI = ["da_confermare", "confermato", "completato"];

const STATO_CONFIG = {
  da_confermare: {
    label: "Da confermare",
    className: "bg-amber-100 text-amber-800",
  },
  confermato: {
    label: "Confermato",
    className: "bg-green-100 text-green-700",
  },
  completato: {
    label: "Completato",
    className: "bg-gray-100 text-gray-600",
  },
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function AdminPrenotazioniPage() {
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStato, setFiltroStato] = useState("tutti");

  const fetchPrenotazioni = async () => {
    let q = supabase
      .from("prenotazioni")
      .select("*")
      .order("data_preferita", { ascending: true });

    if (filtroStato !== "tutti") {
      q = q.eq("stato", filtroStato);
    }

    const { data } = await q;
    setPrenotazioni(data || []);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchPrenotazioni();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroStato]);

  const updateStato = async (id, stato) => {
    await supabase.from("prenotazioni").update({ stato }).eq("id", id);
    setPrenotazioni((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stato } : p))
    );
  };

  const handleDelete = async (id, nome, cognome) => {
    if (!confirm(`Eliminare la prenotazione di ${nome} ${cognome}?`)) return;
    await supabase.from("prenotazioni").delete().eq("id", id);
    setPrenotazioni((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <AdminShell>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-[#111111]">Prenotazioni</h1>
          <span className="text-sm text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1">
            {prenotazioni.length} totali
          </span>
        </div>

        {/* Filtro stato */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["tutti", ...STATI].map((s) => (
            <button
              key={s}
              onClick={() => setFiltroStato(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                filtroStato === s
                  ? "bg-[#111111] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {s === "tutti" ? "Tutte" : STATO_CONFIG[s]?.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-24 animate-pulse"
              />
            ))}
          </div>
        ) : prenotazioni.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-400 text-lg">
              Nessuna prenotazione{filtroStato !== "tutti" ? " in questo stato" : ""}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {prenotazioni.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-bold text-[#111111]">
                        {p.nome} {p.cognome}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          STATO_CONFIG[p.stato]?.className
                        }`}
                      >
                        {STATO_CONFIG[p.stato]?.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">
                      <span>
                        📞{" "}
                        <a
                          href={`tel:${p.telefono}`}
                          className="hover:text-[#E8000E] transition-colors"
                        >
                          {p.telefono}
                        </a>
                      </span>
                      {p.email && (
                        <span>
                          ✉️{" "}
                          <a
                            href={`mailto:${p.email}`}
                            className="hover:text-[#E8000E] transition-colors"
                          >
                            {p.email}
                          </a>
                        </span>
                      )}
                      <span>
                        🏍️ {p.marca_moto} {p.modello_moto}
                        {p.anno_moto && ` (${p.anno_moto})`}
                      </span>
                      <span>🔧 Tagliando {p.tipo_tagliando}</span>
                      <span>📅 {formatDate(p.data_preferita)}</span>
                    </div>

                    {p.note && (
                      <p className="mt-2 text-sm text-gray-400 italic">
                        &ldquo;{p.note}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Azioni */}
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={p.stato}
                      onChange={(e) => updateStato(p.id, e.target.value)}
                      className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#E8000E]"
                    >
                      {STATI.map((s) => (
                        <option key={s} value={s}>
                          {STATO_CONFIG[s].label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() =>
                        handleDelete(p.id, p.nome, p.cognome)
                      }
                      className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium"
                    >
                      Elimina
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
