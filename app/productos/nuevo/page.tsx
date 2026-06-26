import Link from "next/link";
import { crearProducto } from "../actions";

export default function NuevoProductoPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nuevo producto</h1>
            <p className="text-sm text-gray-600">
              Carga manual de repuestos al catálogo
            </p>
          </div>

          <Link
            href="/productos"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
          >
            Volver
          </Link>
        </div>

        <form action={crearProducto} className="rounded-2xl bg-white p-6 shadow">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Código</label>
              <input
                name="codigo"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Ej: CR1234"
              />
            </div>
            <div>
  <label className="mb-1 block text-sm font-medium">
    Códigos originales (OEM)
  </label>

  <input
    name="codigo_original"
    className="w-full rounded-lg border border-gray-300 px-3 py-2"
    placeholder="Ej: 7700435694, 7700435695"
  />

  <p className="mt-1 text-xs text-gray-500">
    Si el producto tiene varios códigos originales, separalos con coma.
  </p>
</div>

            <div>
              <label className="mb-1 block text-sm font-medium">Rubro</label>
              <input
                name="rubro"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Ej: cilindro de freno"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Descripción</label>
              <input
                name="descripcion"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Ej: Renault Duster / Oroch trasero"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Proveedor</label>
              <input
                name="proveedor"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Opcional"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Precio compra</label>
              <input
                name="precio_compra"
                type="number"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="0"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Stock</label>
              <input
                name="stock"
                type="number"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="0"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Facturado</label>
              <select
                name="facturado"
                defaultValue="si"
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
                defaultValue="si"
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Rosca, paso, medidas, detalles internos, etc."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-black px-5 py-2 text-white"
            >
              Guardar producto
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}