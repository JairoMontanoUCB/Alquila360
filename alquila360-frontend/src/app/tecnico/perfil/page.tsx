"use client";

import { useState } from "react";
import Link from "next/link";

export default function Perfil() {
  const [nombre, setNombre] = useState("Carlos");
  const [apellido, setApellido] = useState("Martínez");
  const [email, setEmail] = useState("carlos.martinez@ejemplo.com");
  const [telefono, setTelefono] = useState("555-9042");
  const [rol] = useState("Técnico");

  const handleGuardar = () => {
    // Aquí conectarías con tu backend para actualizar
    alert("Perfil actualizado correctamente");
    console.log({ nombre, apellido, email, telefono });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#1a5f4a] text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold">ALQUILA 360</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/tecnico" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
            <span>🏠</span>
            <span>Home</span>
          </Link>
          <Link href="/tecnico/tickets" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
            <span>🎫</span>
            <span>Tickets Asignados</span>
          </Link>
          <Link href="/tecnico/historial" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
            <span>📜</span>
            <span>Historial</span>
          </Link>
          <Link href="/tecnico/perfil" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#156b52]">
            <span>👤</span>
            <span>Perfil</span>
          </Link>
        </nav>

        <div className="p-4">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-[#156b52]">
            <span>🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
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
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5f4a] focus:border-transparent"
              />
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido
              </label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5f4a] focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5f4a] focus:border-transparent"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5f4a] focus:border-transparent"
              />
            </div>

            {/* Rol (solo lectura) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol
              </label>
              <input
                type="text"
                value={rol}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              />
            </div>

            {/* Botón Guardar */}
            <div className="pt-4">
              <button
                onClick={handleGuardar}
                className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
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
