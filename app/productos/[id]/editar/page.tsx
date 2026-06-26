import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { actualizarProducto } from "./actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditarProductoPage({ params }: PageProps) {
  const { id } = await params;
  const productoId = Number(id);

  if (Number.isNaN(productoId)) {
    notFound();
  }

  const supabase = await createClient();

  const { data: producto, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", productoId)
    .single();

  if (error || !producto) {
    notFound();
  }

  const actualizarProductoConId = actualizarProducto.bind(null, productoId);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar producto</h1>
            <p className="text-sm text-gray-600">
              Modificación manual del producto
            </p>
          </div>

          <Link
            href="/productos"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
          >
            Volver
          </Link>
        </div>

        <form
          action={actualizarProductoConId}
          className="rounded-2xl bg-white p-6 shadow"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Código</label>
              <input
                name="codigo"
                defaultValue={producto.codigo ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Rubro</label>
              <input
                name="rubro"
                defaultValue={producto.rubro ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Descripción</label>
              <input
                name="descripcion"
                defaultValue={producto.descripcion ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Proveedor</label>
              <input
                name="proveedor"
                defaultValue={producto.proveedor ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Precio compra</label>
              <input
                name="precio_compra"
                type="number"
                defaultValue={producto.precio_compra ?? 0}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Stock</label>
              <input
                name="stock"
                type="number"
                defaultValue={producto.stock ?? 0}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Facturado</label>
              <select
                name="facturado"
                defaultValue={producto.facturado ? "si" : "no"}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Activo</label>
              <select
                name="activo"
                defaultValue={producto.activo ? "si" : "no"}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Observaciones</label>
              <textarea
                name="observaciones"
                rows={4}
                defaultValue={producto.observaciones ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-black px-5 py-2 text-white"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}