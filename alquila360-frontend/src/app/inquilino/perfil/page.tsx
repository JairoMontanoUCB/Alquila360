"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  estado: string;
  fecha_registro: string;
}

export default function MiPerfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPerfil = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("No hay userId en localStorage");
          setLoading(false);
          return;
        }

        const res = await fetch(`http://localhost:3001/user/${userId}`);
        const data = await res.json();

        setUsuario({
          id: data.id,
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          rol: data.rol,
          estado: data.estado,
          fecha_registro: data.fecha_registro
        });

        setLoading(false);
      } catch (error) {
        console.error("Error cargando perfil:", error);
        setLoading(false);
      }
    };

    loadPerfil();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Cargando perfil...</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No se pudo cargar tu perfil.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#1a5f4a] text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold">ALQUILA 360</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link href="/inquilino" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
            <span>🏠</span>
            <span>Home</span>
          </Link>
          <Link href="/inquilino/contrato" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
            <span>📄</span>
            <span>Contrato</span>
          </Link>
          <Link href="/inquilino/pagos" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
            <span>💳</span>
            <span>Pagos</span>
          </Link>
          <Link href="/inquilino/tickets" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
            <span>🔧</span>
            <span>Tickets</span>
          </Link>
          <Link href="/inquilino/expensas" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
            <span>📊</span>
            <span>Expensas</span>
          </Link>
          <Link href="/inquilino/perfil" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#156b52]">
            <span>👤</span>
            <span>Perfil</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-[#156b52]">
          <p className="text-sm text-gray-300 mb-2 capitalize">{usuario.rol}</p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-[#156b52]"
          >
            <span>🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Mi Perfil</h2>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl">
          <div className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <p className="text-gray-900">{usuario.nombre} {usuario.apellido}</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <p className="text-gray-900">{usuario.email}</p>
            </div>

            {/* Rol */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
              <p className="text-gray-900 capitalize">{usuario.rol}</p>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <p className="text-gray-900">{usuario.estado}</p>
            </div>

            {/* Fecha Registro */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Registro</label>
              <p className="text-gray-900">{usuario.fecha_registro}</p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => alert("Próximamente: editar perfil")}
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-semibold"
              >
                Editar Perfil
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
