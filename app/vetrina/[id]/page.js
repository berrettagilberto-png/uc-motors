"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default function VeicoloDetailPage() {
  const { id } = useParams();
  const [veicolo, setVeicolo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("veicoli")
        .select("*")
        .eq("id", id)
        .single();
      setVeicolo(data || null);
      setLoading(false);
    }
    if (id) fetch();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-5 w-32 bg-gray-200 rounded" />
            <div className="aspect-[16/9] bg-gray-200 rounded-2xl" />
            <div className="h-8 w-64 bg-gray-200 rounded" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!veicolo) {
    return (
      <>
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <p className="text-6xl mb-4">🏍️</p>
          <h1 className="text-2xl font-black text-[#111111] mb-2">Veicolo non trovato</h1>
          <p className="text-gray-500 mb-6">Il veicolo richiesto non è più disponibile.</p>
          <Link
            href="/vetrina"
            className="bg-[#E8000E] text-white font-semibold px-6 py-3 rounded-full hover:bg-red-700 transition-colors"
          >
            Torna alla vetrina
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const images = veicolo.immagini && veicolo.immagini.length > 0 ? veicolo.immagini : null;

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-[#E8000E] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/vetrina" className="hover:text-[#E8000E] transition-colors">Vetrina</Link>
            <span>/</span>
            <span className="text-[#111111] font-medium">{veicolo.marca} {veicolo.modello}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery */}
            <div>
              {/* Main image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 mb-3">
                {images ? (
                  <Image
                    src={images[activeImg]}
                    alt={`${veicolo.marca} ${veicolo.modello}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl">
                    🏍️
                  </div>
                )}
                <span className="absolute top-4 left-4 bg-[#E8000E] text-white text-xs font-semibold px-3 py-1 rounded-full capitalize">
                  {veicolo.tipo}
                </span>
                {!veicolo.disponibile && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-white text-[#111111] font-black text-lg px-6 py-2 rounded-full rotate-[-3deg]">
                      Venduto
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images && images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${
                        activeImg === i ? "border-[#E8000E]" : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-black text-[#111111] leading-tight">
                {veicolo.marca} {veicolo.modello}
              </h1>

              <p className="text-4xl font-black text-[#E8000E] mt-3">
                €{Number(veicolo.prezzo).toLocaleString("it-IT")}
              </p>

              {/* Specifiche */}
              <dl className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { label: "Anno", value: veicolo.anno },
                  { label: "Km", value: veicolo.km != null ? veicolo.km.toLocaleString("it-IT") + " km" : "—" },
                  { label: "Cilindrata", value: veicolo.cilindrata ? veicolo.cilindrata + " cc" : "—" },
                  { label: "Tipo", value: veicolo.tipo?.charAt(0).toUpperCase() + veicolo.tipo?.slice(1) },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white rounded-xl p-3 border border-gray-100">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-0.5">{label}</dt>
                    <dd className="font-bold text-[#111111]">{value || "—"}</dd>
                  </div>
                ))}
              </dl>

              {/* Descrizione */}
              {veicolo.descrizione && (
                <div className="mt-6">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Descrizione</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                    {veicolo.descrizione}
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="mt-auto pt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:+39XXXXXXXXXX"
                  className="flex-1 bg-[#E8000E] text-white text-center font-bold py-3.5 rounded-full hover:bg-red-700 transition-colors"
                >
                  📞 Chiama per info
                </a>
                <Link
                  href="/tagliando"
                  className="flex-1 bg-[#111111] text-white text-center font-bold py-3.5 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Prenota tagliando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
