import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import VehicleForm from "@/components/admin/VehicleForm";
import { supabase } from "@/lib/supabase";

export default async function ModificaVeicoloPage({ params }) {
  const { id } = await params;

  const { data: vehicle } = await supabase
    .from("veicoli")
    .select("*")
    .eq("id", id)
    .single();

  if (!vehicle) notFound();

  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-black text-[#111111] mb-2">
          Modifica veicolo
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          {vehicle.marca} {vehicle.modello} · {vehicle.anno}
        </p>
        <VehicleForm initial={vehicle} />
      </div>
    </AdminShell>
  );
}
