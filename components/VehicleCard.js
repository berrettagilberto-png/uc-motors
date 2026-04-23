import Image from "next/image";

export default function VehicleCard({ veicolo }) {
  const { marca, modello, anno, km, prezzo, cilindrata, tipo, immagini } =
    veicolo;
  const hasImage = immagini && immagini.length > 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group flex flex-col">
      {/* Image */}
      <div className="relative h-52 bg-gray-100 overflow-hidden shrink-0">
        {hasImage ? (
          <Image
            src={immagini[0]}
            alt={`${marca} ${modello}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🏍️
          </div>
        )}
        <span className="absolute top-3 left-3 bg-[#E8000E] text-white text-xs font-semibold px-2.5 py-1 rounded-full capitalize">
          {tipo}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-[#111111] text-lg leading-tight">
          {marca} {modello}
        </h3>

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500">
          <span>{anno}</span>
          {km != null && (
            <span>{km.toLocaleString("it-IT")} km</span>
          )}
          {cilindrata && <span>{cilindrata} cc</span>}
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-2xl font-black text-[#E8000E]">
            €{Number(prezzo).toLocaleString("it-IT")}
          </span>
          <a
            href="tel:+39XXXXXXXXXX"
            className="bg-[#111111] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#E8000E] transition-colors"
          >
            Contattaci
          </a>
        </div>
      </div>
    </div>
  );
}
