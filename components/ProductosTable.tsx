"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  productos: any[];
  rol: "admin" | "vendedor";
  columnas: any;
};

function getStockColor(stock: any) {
  const s = Number(stock ?? 0);

  if (s > 2) return "bg-green-500";
  if (s > 0) return "bg-yellow-400";
  return "bg-red-500";
}

function formatMoney(value: number | null) {
  if (value === null || value === undefined) return "-";
  return `$${Math.round(value).toLocaleString("es-AR")}`;
}

export default function ProductosTable({ productos, rol, columnas }: Props) {
  const [selected, setSelected] = useState(null);

  return (
    <>
   

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-600">

              {columnas.codigo_visible && (
                <th className="px-4 py-3">Código</th>
              )}

              {columnas.rubro_visible && (
                <th className="px-4 py-3">Rubro</th>
              )}

              {columnas.descripcion_visible && (
                <th className="px-4 py-3">Descripción</th>
              )}

              {columnas.precio_general_visible && (
                <th className="px-4 py-3">Precio</th>
              )}

              {columnas.precio_ml_visible && (
                <th className="px-4 py-3">ML</th>
              )}

              {columnas.stock_visible && (
                <th className="px-4 py-3">Stock</th>
              )}

              {rol === "admin" && (
                <th className="px-4 py-3">Estado</th>
              )}

              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((p) => {
              const stock = Number(p.stock ?? 0);

              return (
                <tr
                  key={p.id}
                  onDoubleClick={() => setSelected(p)}
                  className="border-t text-sm cursor-pointer hover:bg-gray-50"
                >

                  {columnas.codigo_visible && (
                    <td className="px-4 py-3">{p.codigo}</td>
                  )}

                  {columnas.rubro_visible && (
                    <td className="px-4 py-3">{p.rubro}</td>
                  )}

                  {columnas.descripcion_visible && (
                    <td className="px-4 py-3">{p.descripcion}</td>
                  )}

                  {columnas.precio_general_visible && (
                    <td className="px-4 py-3">
                      {formatMoney(p.precio_general)}
                    </td>
                  )}

                  {columnas.precio_ml_visible && (
                    <td className="px-4 py-3">
                      {formatMoney(p.precio_ml)}
                    </td>
                  )}

                  {/* 🔥 SOLO CAMBIO: MOSTRAR NÚMERO DE STOCK */}
                  {columnas.stock_visible && (
                    <td className="px-4 py-3 text-center font-semibold">
                      {p.stock ?? 0}
                    </td>
                  )}

                  {rol === "admin" && (
                    <td className="px-4 py-3">
                      {p.activo ? "Activo" : "Inactivo"}
                    </td>
                  )}

                  <td className="px-4 py-3">
                    <Link
                      href={`/productos/${p.id}/editar`}
                      className="border px-2 py-1 rounded text-sm"
                    >
                      Editar
                    </Link>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL DETALLE (SIN CAMBIOS) */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-xl p-6 w-[600px] max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
              Detalle producto
            </h2>

            <div className="space-y-2 text-sm">

              <p><b>Código:</b> {selected.codigo}</p>
              <p><b>Rubro:</b> {selected.rubro}</p>
              <p><b>Descripción:</b> {selected.descripcion}</p>
              <p><b>Proveedor:</b> {selected.proveedor}</p>
              <p><b>Precio compra:</b> {formatMoney(selected.precio_compra)}</p>
              <p><b>Precio venta:</b> {formatMoney(selected.precio_general)}</p>
              <p><b>Precio ML:</b> {formatMoney(selected.precio_ml)}</p>
              <p><b>Stock:</b> {selected.stock}</p>
              <p><b>Facturado:</b> {selected.facturado ? "Sí" : "No"}</p>
              <p><b>Observaciones:</b> {selected.observaciones}</p>
              <p><b>Estado:</b> {selected.activo ? "Activo" : "Inactivo"}</p>

            </div>

            <div className="flex justify-end gap-2 mt-6">

              <Link
                href={`/productos/${selected.id}/editar`}
                className="border px-3 py-1 rounded"
              >
                Editar
              </Link>

              <button
                onClick={() => setSelected(null)}
                className="bg-black text-white px-3 py-1 rounded"
              >
                Cerrar
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}