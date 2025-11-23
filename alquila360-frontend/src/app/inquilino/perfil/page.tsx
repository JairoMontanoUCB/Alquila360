"use client";
import { useState } from "react";
import Link from "next/link";

export default function MiPerfil() {
  const [nombre, setNombre] = useState("María García");
  const [email, setEmail] = useState("maria.garcia@example.com");
  const [telefono, setTelefono] = useState("555-5678");
  const [rol] = useState("Inquilino");
  const handleGuardar = () => {
    // Aquí conectarías con tu backend para actualizar
    alert("Perfil actualizado correctamente");
    console.log({ nombre, email, telefono });
  };
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#1a5f4a] text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold">ALQUILA 360</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/inquilino" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#156b52]">
            <span>🏠</span>
            <span>Home</span>
          </Link>
          <Link href="/inquilino/contratos" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
            <span>📄</span>
            <span>Contrato</span>
          </Link>
          <Link href="/inquilino/pagos" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
            <span>💳</span>
            <span>Pagos</span>
          </Link>
          <Link href="/inquilino/ticket" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
            <span>🔧</span>
            <span>Tickets</span>
          </Link>
          <Link href="/inquilino/expensas" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
            <span>📊</span>
            <span>Expensas</span>
          </Link>
          <Link href="/inquilino/perfil" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
            <span>👤</span>
            <span>Perfil</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-[#156b52]">
          <p className="text-sm text-gray-300 mb-2">Inquilino</p>
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-[#156b52]">
            <span>🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Mi Perfil</h2>
        </header>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl">
          <div className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <p className="text-gray-900">{nombre}</p>
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <p className="text-gray-900">{email}</p>
            </div>
            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <p className="text-gray-900">{telefono}</p>
            </div>
            {/* Rol */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol
              </label>
              <p className="text-gray-900">{rol}</p>
            </div>
            {/* Botón Cerrar Sesión */}
            <div className="pt-4">
              <button
                onClick={() => alert("Cerrando sesión...")}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}