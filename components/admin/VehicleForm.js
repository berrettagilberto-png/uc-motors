"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const ANNI = Array.from(
  { length: 35 },
  (_, i) => new Date().getFullYear() - i
);

const MARCHE_COMUNI = [
  "Aprilia","BMW","Ducati","Honda","Kawasaki","KTM",
  "Piaggio","Suzuki","Triumph","Vespa","Yamaha",
];

export default function VehicleForm({ initial = null }) {
  const router = useRouter();
  const isEdit = !!initial;

  const [form, setForm] = useState({
    marca: initial?.marca || "",
    modello: initial?.modello || "",
    anno: initial?.anno || new Date().getFullYear(),
    km: initial?.km ?? "",
    prezzo: initial?.prezzo ?? "",
    cilindrata: initial?.cilindrata ?? "",
    tipo: initial?.tipo || "moto",
    descrizione: initial?.descrizione || "",
    disponibile: initial?.disponibile ?? true,
  });

  const [existingImages, setExistingImages] = useState(
    initial?.immagini || []
  );
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const totalImages = existingImages.length + newFiles.length;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (totalImages + files.length > 5) {
      alert("Puoi caricare al massimo 5 foto.");
      return;
    }
    setNewFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setNewPreviews((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeExisting = (url) =>
    setExistingImages((prev) => prev.filter((u) => u !== url));

  const removeNew = (idx) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Upload nuove immagini
      const uploadedUrls = [];
      for (const file of newFiles) {
        const ext = file.name.split(".").pop();
        const name = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("veicoli-immagini")
          .upload(name, file);
        if (uploadErr) throw uploadErr;

        const { data } = supabase.storage
          .from("veicoli-immagini")
          .getPublicUrl(name);
        uploadedUrls.push(data.publicUrl);
      }

      const payload = {
        ...form,
        anno: parseInt(form.anno),
        km: parseInt(form.km) || 0,
        prezzo: parseFloat(form.prezzo) || 0,
        cilindrata: form.cilindrata ? parseInt(form.cilindrata) : null,
        immagini: [...existingImages, ...uploadedUrls],
      };

      let err;
      if (isEdit) {
        ({ error: err } = await supabase
          .from("veicoli")
          .update(payload)
          .eq("id", initial.id));
      } else {
        ({ error: err } = await supabase.from("veicoli").insert([payload]));
      }
      if (err) throw err;

      router.push("/admin/veicoli");
    } catch (err) {
      setError(err.message || "Errore durante il salvataggio.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Dettagli */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-bold text-[#111111] mb-5">Dettagli veicolo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Tipo */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[#333333] mb-2">
              Tipo
            </label>
            <div className="flex gap-3">
              {["moto", "scooter"].map((t) => (
                <label key={t} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="tipo"
                    value={t}
                    checked={form.tipo === t}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`text-center py-2.5 rounded-xl border-2 text-sm font-medium transition-colors capitalize ${
                      form.tipo === t
                        ? "border-[#E8000E] bg-red-50 text-[#E8000E]"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {t}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Marca */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">
              Marca *
            </label>
            <input
              list="marche-list"
              name="marca"
              value={form.marca}
              onChange={handleChange}
              required
              placeholder="Es. Honda"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8000E]"
            />
            <datalist id="marche-list">
              {MARCHE_COMUNI.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </div>

          {/* Modello */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">
              Modello *
            </label>
            <input
              name="modello"
              value={form.modello}
              onChange={handleChange}
              required
              placeholder="Es. CB500F"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8000E]"
            />
          </div>

          {/* Anno */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">
              Anno *
            </label>
            <select
              name="anno"
              value={form.anno}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8000E] bg-white"
            >
              {ANNI.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* KM */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">
              Chilometri *
            </label>
            <input
              type="number"
              name="km"
              value={form.km}
              onChange={handleChange}
              required
              min="0"
              placeholder="Es. 25000"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8000E]"
            />
          </div>

          {/* Prezzo */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">
              Prezzo (€) *
            </label>
            <input
              type="number"
              name="prezzo"
              value={form.prezzo}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="Es. 4500"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8000E]"
            />
          </div>

          {/* Cilindrata */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">
              Cilindrata (cc)
            </label>
            <input
              type="number"
              name="cilindrata"
              value={form.cilindrata}
              onChange={handleChange}
              min="0"
              placeholder="Es. 500"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8000E]"
            />
          </div>

          {/* Disponibile */}
          <div className="sm:col-span-2 flex items-center gap-3">
            <input
              type="checkbox"
              id="disponibile"
              name="disponibile"
              checked={form.disponibile}
              onChange={handleChange}
              className="w-4 h-4 accent-[#E8000E] rounded"
            />
            <label
              htmlFor="disponibile"
              className="text-sm font-medium text-[#333333] cursor-pointer"
            >
              Visibile in vetrina (disponibile)
            </label>
          </div>

          {/* Descrizione */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[#333333] mb-1.5">
              Descrizione
            </label>
            <textarea
              name="descrizione"
              value={form.descrizione}
              onChange={handleChange}
              rows={4}
              placeholder="Condizioni, optional, storia del veicolo..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8000E] resize-none"
            />
          </div>
        </div>
      </div>

      {/* Foto */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#111111]">Foto</h2>
          <span className="text-sm text-gray-400">{totalImages}/5</span>
        </div>

        <div className="flex flex-wrap gap-3">
          {existingImages.map((url, i) => (
            <div
              key={url}
              className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200"
            >
              <Image
                src={url}
                alt={`Foto ${i + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeExisting(url)}
                className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center hover:bg-red-700 leading-none"
              >
                ×
              </button>
            </div>
          ))}

          {newPreviews.map((src, i) => (
            <div
              key={i}
              className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-blue-300"
            >
              <Image
                src={src}
                alt={`Nuova ${i + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeNew(i)}
                className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center hover:bg-red-700 leading-none"
              >
                ×
              </button>
              <span className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-[10px] text-center py-0.5">
                Nuova
              </span>
            </div>
          ))}

          {totalImages < 5 && (
            <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#E8000E] hover:bg-red-50 transition-colors">
              <span className="text-2xl text-gray-400">+</span>
              <span className="text-xs text-gray-400 mt-1">Foto</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                className="sr-only"
              />
            </label>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-[#E8000E] text-white font-bold py-3.5 rounded-full hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving
            ? "Salvataggio..."
            : isEdit
            ? "Salva modifiche"
            : "Aggiungi veicolo"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/veicoli")}
          className="px-6 py-3.5 rounded-full border border-gray-200 text-[#333333] font-semibold hover:bg-gray-50 transition-colors"
        >
          Annulla
        </button>
      </div>
    </form>
  );
}
