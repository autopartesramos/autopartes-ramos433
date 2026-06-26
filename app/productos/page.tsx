import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductosTable from "@/components/ProductosTable";

function formatMoney(value: number | null) {
  if (value === null || value === undefined) return "-";
  return `$${Math.round(value).toLocaleString("es-AR")}`;
}

type ProductosPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

type ConfiguracionColumnas = {
  codigo_visible: boolean;
  rubro_visible: boolean;
  descripcion_visible: boolean;
  proveedor_visible: boolean;
  precio_compra_visible: boolean;
  facturado_visible: boolean;
  costo_final_visible: boolean;
  precio_general_visible: boolean;
  precio_ml_visible: boolean;
  stock_visible: boolean;
  observaciones_visible: boolean;
};

const configAdminPorDefecto: ConfiguracionColumnas = {
  codigo_visible: true,
  rubro_visible: true,
  descripcion_visible: true,
  proveedor_visible: true,
  precio_compra_visible: true,
  facturado_visible: true,
  costo_final_visible: true,
  precio_general_visible: true,
  precio_ml_visible: true,
  stock_visible: true,
  observaciones_visible: true,
};

const configVendedorPorDefecto: ConfiguracionColumnas = {
  codigo_visible: true,
  rubro_visible: true,
  descripcion_visible: true,
  proveedor_visible: false,
  precio_compra_visible: false,
  facturado_visible: false,
  costo_final_visible: false,
  precio_general_visible: true,
  precio_ml_visible: true,
  stock_visible: true,
  observaciones_visible: false,
};

export default async function ProductosPage({
  searchParams,
}: ProductosPageProps) {
  const supabase = await createClient();
  const params = await searchParams;
  const q = (params.q || "").trim();

  // 1) Usuario autenticado
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/");
  }

  // 2) Rol usuario
  const { data: usuarioDb, error: usuarioDbError } = await supabase
    .from("usuarios")
    .select("rol, activo")
    .eq("auth_user_id", user.id)
    .single();

  if (usuarioDbError || !usuarioDb) {
    return (
      <div className="p-6">
        Usuario sin configurar
      </div>
    );
  }

  if (!usuarioDb.activo) {
    return (
      <div className="p-6">
        Usuario inactivo
      </div>
    );
  }

  const rol = usuarioDb.rol as "admin" | "vendedor";

  // 3) Config columnas
  const { data: configDb } = await supabase
    .from("configuracion_columnas")
    .select("*")
    .eq("rol", rol)
    .single();

  const columnas: ConfiguracionColumnas =
    configDb ??
    (rol === "admin" ? configAdminPorDefecto : configVendedorPorDefecto);

  // 4) Productos
  let query = supabase
    .from("productos")
    .select("*")
    .order("id", { ascending: false });

  if (q) {
    query = query.or(
      `codigo.ilike.%${q}%,rubro.ilike.%${q}%,descripcion.ilike.%${q}%,proveedor.ilike.%${q}%`
    );
  }

  const { data: productos, error } = await query;

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-gray-500">
            Catálogo y consulta de repuestos
          </p>
          <p className="text-sm text-gray-400">Usuario: {rol}</p>
        </div>

        <div className="flex gap-2">
          {rol === "admin" && (
            <>
              <Link
                href="/configuracion"
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Configuración
              </Link>

              <Link
                href="/productos/nuevo"
                className="rounded-lg bg-black px-4 py-2 text-white"
              >
                Nuevo producto
              </Link>
            </>
          )}
        </div>
      </div>

      {/* BUSCADOR */}
      <div className="mb-4 rounded-2xl bg-white p-4 shadow">
        <form className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Buscar por código, rubro, descripción o proveedor..."
            className="w-full rounded-lg border px-3 py-2"
          />

          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Buscar
          </button>

          <Link
            href="/productos"
            className="rounded-lg border px-4 py-2"
          >
            Limpiar
          </Link>
        </form>
      </div>

      {/* TABLA + MODAL (CLIENT COMPONENT) */}
      <div className="bg-white rounded-2xl shadow">
        {!productos || productos.length === 0 ? (
          <div className="p-6 text-gray-500">
            {q ? `Sin resultados para "${q}"` : "Sin productos"}
          </div>
        ) : (
          <ProductosTable
            productos={productos}
            rol={rol}
            columnas={columnas}
          />
        )}
      </div>
    </main>
  );
}