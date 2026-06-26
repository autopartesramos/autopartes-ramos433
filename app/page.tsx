import { login } from "./auth/actions";

export default function HomePage() {
    return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold text-center">Autopartes Ramos</h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Sistema de gestión
        </p>

        <form action={login} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Contraseña</label>
            <input
              type="password"
              name="password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-black px-4 py-2 text-white"
          >
            Ingresar
          </button>
        </form>
      </div>
    </main>
  );
}