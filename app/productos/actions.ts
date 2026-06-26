"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function toNumber(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  if (!text) return 0;

  const normalized = text.replace(/\./g, "").replace(",", ".");
  const num = Number(normalized);

  return Number.isNaN(num) ? 0 : num;
}

async function obtenerConfiguracion(
  supabase: Awaited<ReturnType<typeof createClient>>
) {
  const { data: config, error: configError } = await supabase
    .from("configuracion")
    .select("iva_porcentaje, margen_general, margen_ml")
    .limit(1)
    .single();

  if (configError || !config) {
    console.log("ERROR AL LEER CONFIGURACION:", configError);
    throw new Error("No se pudo leer la configuración.");
  }

  return {
    iva: Number(config.iva_porcentaje || 0),
    margenGeneral: Number(config.margen_general || 0),
    margenMl: Number(config.margen_ml || 0),
  };
}

export async function crearProducto(formData: FormData) {
  const supabase = await createClient();

  const codigo = String(formData.get("codigo") || "").trim();

  // NUEVO CAMPO
  const codigoOriginal = String(
    formData.get("codigo_original") || ""
  ).trim();

  const rubro = String(formData.get("rubro") || "").trim();
  const descripcion = String(formData.get("descripcion") || "").trim();
  const proveedor = String(formData.get("proveedor") || "").trim();
  const observaciones = String(formData.get("observaciones") || "").trim();

  const precioCompra = toNumber(formData.get("precio_compra"));
  const stock = toNumber(formData.get("stock"));

  const facturado = formData.get("facturado") === "si";
  const activo = formData.get("activo") === "si";

  const { iva, margenGeneral, margenMl } =
    await obtenerConfiguracion(supabase);

  const costoFinal = facturado
    ? Math.round(precioCompra * (1 + iva / 100))
    : Math.round(precioCompra);

  const precioGeneral = Math.round(
    costoFinal * (1 + margenGeneral / 100)
  );

  const precioMl = Math.round(
    costoFinal * (1 + margenMl / 100)
  );

  const { error } = await supabase.from("productos").insert({
    codigo,
    codigo_original: codigoOriginal || null,
    rubro,
    descripcion,
    proveedor: proveedor || null,
    precio_compra: precioCompra,
    facturado,
    costo_final: costoFinal,
    precio_general: precioGeneral,
    precio_ml: precioMl,
    stock,
    observaciones: observaciones || null,
    activo,
  });

  if (error) {
    console.log("ERROR AL CREAR PRODUCTO:", error);
    throw new Error("No se pudo guardar el producto.");
  }

  redirect("/productos");
}