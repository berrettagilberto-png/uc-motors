"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminShell from "@/components/admin/AdminShell";
import { supabase } from "@/lib/supabase";

export default function AdminVeicoliPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    const { data } = await supabase
      .from("veicoli")
      .select("*")
      .order("created_at", { ascending: false });
    setVehicles(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (id, marca, modello) => {
    if (!confirm(`Eliminare ${marca} ${modello}? L'operazione è irreversibile.`))
      return;

    const vehicle = vehicles.find((v) => v.id === id);

    if (vehicle?.immagini?.length > 0) {
      const paths = vehicle.immagini.map((url) => {
        const parts = url.split("/");
        return parts[parts.length - 1];
      });
      await supabase.storage.from("veicoli-immagini").remove(paths);
    }

    await supabase.from("veicoli").delete().eq("id", id);
    fetchVehicles();
  };

  const toggleDisponibile = async (id, current) => {
    await supabase
      .from("veicoli")
      .update({ disponibile: !current })
      .eq("id", id);
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, disponibile: !current } : v))
    );
  };

  return (
    <AdminShell>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black text-[#111111]">Veicoli</h1>
          <Link
            href="/admin/veicoli/nuovo"
            className="bg-[#E8000E] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-red-700 transition-colors"
          >
            + Aggiungi veicolo
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-20 animate-pulse"
              />
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-400 mb-4 text-lg">Nessun veicolo inserito</p>
            <Link
              href="/admin/veicoli/nuovo"
              className="bg-[#E8000E] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-red-700 transition-colors"
            >
              Aggiungi il primo veicolo
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  {v.immagini?.[0] ? (
                    <Image
                      src={v.immagini[0]}
                      alt=""
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      🏍️
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#111111] truncate">
                    {v.marca} {v.modello}
                  </p>
                  <p className="text-sm text-gray-500">
                    {v.anno} ·{" "}
                    {v.km?.toLocaleString("it-IT")} km ·{" "}
                    €{Number(v.prezzo).toLocaleString("it-IT")}
                  </p>
                </div>

                {/* Stato disponibilità */}
                <button
                  onClick={() => toggleDisponibile(v.id, v.disponibile)}
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-colors hidden sm:block ${
                    v.disponibile
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {v.disponibile ? "Disponibile" : "Non disponibile"}
                </button>

                {/* Azioni */}
                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/admin/veicoli/${v.id}/modifica`}
                    className="text-sm bg-gray-100 text-[#333333] px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Modifica
                  </Link>
                  <button
                    onClick={() => handleDelete(v.id, v.marca, v.modello)}
                    className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium"
                  >
                    Elimina
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
