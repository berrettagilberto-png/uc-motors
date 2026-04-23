import AdminShell from "@/components/admin/AdminShell";
import VehicleForm from "@/components/admin/VehicleForm";

export default function NuovoVeicoloPage() {
  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-black text-[#111111] mb-8">
          Aggiungi veicolo
        </h1>
        <VehicleForm />
      </div>
    </AdminShell>
  );
}
