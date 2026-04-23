"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ veicoli: 0, prenotazioni: 0, pendenti: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [
        { count: veicoli },
        { count: prenotazioni },
        { count: pendenti },
      ] = await Promise.all([
        supabase
          .from("veicoli")
          .select("*", { count: "exact", head: true })
          .eq("disponibile", true),
        supabase
          .from("prenotazioni")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("prenotazioni")
          .select("*", { count: "exact", head: true })
          .eq("stato", "da_confermare"),
      ]);

      setStats({
        veicoli: veicoli || 0,
        prenotazioni: prenotazioni || 0,
        pendenti: pendenti || 0,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-black text-[#111111] mb-8">Dashboard</h1>

        {/* Statistiche */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Veicoli attivi",
              value: stats.veicoli,
              icon: "🏍️",
              href: "/admin/veicoli",
              color: "text-blue-600",
            },
            {
              label: "Prenotazioni totali",
              value: stats.prenotazioni,
              icon: "📅",
              href: "/admin/prenotazioni",
              color: "text-purple-600",
            },
            {
              label: "Da confermare",
              value: stats.pendenti,
              icon: "⏳",
              href: "/admin/prenotazioni",
              color: stats.pendenti > 0 ? "text-[#E8000E]" : "text-gray-500",
            },
          ].map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                  <p
                    className={`text-4xl font-black ${
                      loading ? "text-gray-200 animate-pulse" : s.color
                    }`}
                  >
                    {loading ? "—" : s.value}
                  </p>
                </div>
                <span className="text-2xl">{s.icon}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Azioni rapide */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/veicoli/nuovo"
            className="flex items-center gap-4 bg-[#E8000E] text-white rounded-2xl p-6 hover:bg-red-700 transition-colors"
          >
            <span className="text-3xl">➕</span>
            <div>
              <p className="font-bold text-lg">Aggiungi veicolo</p>
              <p className="text-white/75 text-sm">Inserisci un nuovo annuncio</p>
            </div>
          </Link>
          <Link
            href="/admin/prenotazioni"
            className="flex items-center gap-4 bg-[#111111] text-white rounded-2xl p-6 hover:bg-gray-800 transition-colors"
          >
            <span className="text-3xl">📋</span>
            <div>
              <p className="font-bold text-lg">Gestisci prenotazioni</p>
              <p className="text-white/75 text-sm">Visualizza e aggiorna gli appuntamenti</p>
            </div>
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
