import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function guardarConfiguracion(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const iva = Number(formData.get("iva_porcentaje") || 0);
  const margenGeneral = Number(formData.get("margen_general") || 0);
  const margenMl = Number(formData.get("margen_ml") || 0);

  const { data: configExistente } = await supabase
    .from("configuracion")
    .select("id")
    .limit(1)
    .single();

  if (configExistente?.id) {
    const { error } = await supabase
      .from("configuracion")
      .update({
        iva_porcentaje: iva,
        margen_general: margenGeneral,
        margen_ml: margenMl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", configExistente.id);

    if (error) {
      console.log("ERROR AL ACTUALIZAR CONFIGURACION:", error);
      throw new Error("No se pudo guardar la configuración.");
    }
  } else {
    const { error } = await supabase.from("configuracion").insert({
      iva_porcentaje: iva,
      margen_general: margenGeneral,
      margen_ml: margenMl,
    });

    if (error) {
      console.log("ERROR AL CREAR CONFIGURACION:", error);
      throw new Error("No se pudo guardar la configuración.");
    }
  }
}

export default async function ConfiguracionPage() {
  const supabase = await createClient();

  const { data: config } = await supabase
    .from("configuracion")
    .select("*")
    .limit(1)
    .single();

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
            <p className="text-sm text-gray-600">
              IVA y márgenes generales del sistema
            </p>
          </div>

          <Link
            href="/productos"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
          >
            Volver a productos
          </Link>
        </div>

        <form action={guardarConfiguracion} className="rounded-2xl bg-white p-6 shadow">
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                IVA (%)
              </label>
              <input
                name="iva_porcentaje"
                type="number"
                step="0.01"
                defaultValue={config?.iva_porcentaje ?? 21}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Margen general (%)
              </label>
              <input
                name="margen_general"
                type="number"
                step="0.01"
                defaultValue={config?.margen_general ?? 40}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Margen Mercado Libre (%)
              </label>
              <input
                name="margen_ml"
                type="number"
                step="0.01"
                defaultValue={config?.margen_ml ?? 65}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-black px-5 py-2 text-white"
            >
              Guardar configuración
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}