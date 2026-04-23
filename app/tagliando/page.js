"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

const ANNI = Array.from(
  { length: 35 },
  (_, i) => new Date().getFullYear() - i
);

const INITIAL = {
  nome: "", cognome: "", telefono: "", email: "",
  marca_moto: "", modello_moto: "", anno_moto: "",
  tipo_tagliando: "base", data_preferita: "", note: "",
};

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#333333] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ name, type = "text", value, onChange, required, placeholder }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#E8000E] bg-white"
    />
  );
}

export default function TagliandoPage() {
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const { error: err } = await supabase.from("prenotazioni").insert([
      {
        ...form,
        anno_moto: form.anno_moto ? parseInt(form.anno_moto) : null,
        stato: "da_confermare",
      },
    ]);

    if (err) {
      setError(
        "Si è verificato un errore. Riprova o contattaci telefonicamente."
      );
      setStatus("error");
    } else {
      setStatus("success");
    }
  };

  if (status === "success") {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-[#111111] mb-3">
              Prenotazione inviata!
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Abbiamo ricevuto la tua richiesta. Ti contatteremo al più presto
              per confermare l&apos;appuntamento.
            </p>
            <button
              onClick={() => { setStatus("idle"); setForm(INITIAL); }}
              className="mt-8 bg-[#E8000E] text-white font-semibold px-6 py-3 rounded-full hover:bg-red-700 transition-colors"
            >
              Nuova prenotazione
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="bg-[#111111] text-white py-14 px-4">
          <div className="max-w-2xl mx-auto">
            <p className="text-[#E8000E] font-semibold text-sm uppercase tracking-widest mb-2">
              Officina UC Motors
            </p>
            <h1 className="text-4xl md:text-5xl font-black">
              Prenota Tagliando
            </h1>
            <p className="mt-2 text-gray-400">
              Compila il form e ti ricontattiamo per confermare l&apos;appuntamento
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dati cliente */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-[#111111] mb-5">I tuoi dati</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nome *">
                  <Input name="nome" value={form.nome} onChange={handleChange} required />
                </Field>
                <Field label="Cognome *">
                  <Input name="cognome" value={form.cognome} onChange={handleChange} required />
                </Field>
                <Field label="Telefono *">
                  <Input name="telefono" type="tel" value={form.telefono} onChange={handleChange} required placeholder="+39 333 000 0000" />
                </Field>
                <Field label="Email">
                  <Input name="email" type="email" value={form.email} onChange={handleChange} />
                </Field>
              </div>
            </div>

            {/* Dati moto */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-[#111111] mb-5">La tua moto</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Marca *">
                  <Input name="marca_moto" value={form.marca_moto} onChange={handleChange} required placeholder="Es. Honda" />
                </Field>
                <Field label="Modello *">
                  <Input name="modello_moto" value={form.modello_moto} onChange={handleChange} required placeholder="Es. CB500F" />
                </Field>

                <Field label="Anno">
                  <select
                    name="anno_moto"
                    value={form.anno_moto}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#E8000E] bg-white"
                  >
                    <option value="">Seleziona anno</option>
                    {ANNI.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Tipo tagliando *">
                  <div className="flex gap-3 h-[42px]">
                    {[
                      { value: "base", label: "Base" },
                      { value: "completo", label: "Completo" },
                    ].map((opt) => (
                      <label key={opt.value} className="flex-1 cursor-pointer">
                        <input
                          type="radio"
                          name="tipo_tagliando"
                          value={opt.value}
                          checked={form.tipo_tagliando === opt.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div
                          className={`h-full flex items-center justify-center rounded-xl border-2 text-sm font-medium transition-colors ${
                            form.tipo_tagliando === opt.value
                              ? "border-[#E8000E] bg-red-50 text-[#E8000E]"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          {opt.label}
                        </div>
                      </label>
                    ))}
                  </div>
                </Field>
              </div>
            </div>

            {/* Appuntamento */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-[#111111] mb-5">Appuntamento</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Data preferita *">
                  <input
                    type="date"
                    name="data_preferita"
                    value={form.data_preferita}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#E8000E] bg-white"
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Note aggiuntive">
                    <textarea
                      name="note"
                      value={form.note}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Problemi specifici, richieste particolari..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#E8000E] bg-white resize-none"
                    />
                  </Field>
                </div>
              </div>
            </div>

            {status === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-[#E8000E] text-white font-bold py-4 rounded-full hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "loading"
                ? "Invio in corso..."
                : "Prenota appuntamento"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
