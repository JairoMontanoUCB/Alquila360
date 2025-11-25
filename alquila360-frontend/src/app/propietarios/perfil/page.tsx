"use client";

import Sidebar from "../../components/sideBarPropietario"; // ajusta la ruta si es distinta

export default function PerfilPage() {
  const user = {
    nombre: "Juan Pérez",
    email: "juan.perez@example.com",
    telefono: "555-1234",
    rol: "Propietario",
  };

  return (
    <div className="min-h-screen flex bg-[#f3efe3] text-[#15352b]">
      <Sidebar />

      <main className="flex-1 px-10 py-10">
        {/* Título */}
        <h2 className="text-[32px] font-bold mb-8">Mi Perfil</h2>

        {/* Contenedor de perfil */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e0dccf] p-10 max-w-3xl">
          {/* Nombre */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">Nombre</p>
            <p className="text-lg font-medium">{user.nombre}</p>
          </div>

          {/* Email */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-lg font-medium">{user.email}</p>
          </div>

          {/* Teléfono */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">Teléfono</p>
            <p className="text-lg font-medium">{user.telefono}</p>
          </div>

          {/* Rol */}
          <div className="mb-8">
            <p className="text-sm text-gray-600">Rol</p>
            <p className="text-lg font-medium">{user.rol}</p>
          </div>

          {/* Botón cerrar sesión */}
          <button className="bg-[#d64545] hover:bg-[#b83838] text-white px-6 py-2 rounded-xl text-sm transition">
            Cerrar Sesión
          </button>
        </div>
      </main>
    </div>
  );
}
