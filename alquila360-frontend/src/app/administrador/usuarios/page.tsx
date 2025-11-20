"use client";

import React, { useState } from "react";
import Link from "next/link";

const menuItems = [
  { label: "Dashboard", href: "/administrador" },
  { label: "Propiedades", href: "/administrador/propiedades" },
  { label: "Usuarios", href: "/administrador/usuarios" },
  { label: "Contratos", href: "#" },
  { label: "Pagos", href: "#" },
  { label: "Expensas", href: "#" },
  { label: "Tickets", href: "#" },
  { label: "Reportes", href: "#" },
  { label: "Configuracion", href: "#" },
];

const activeLabel = "Usuarios";

type RolUsuario = "Propietario" | "Inquilino" | "Tecnico" | "Administrador";

type Usuario = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: RolUsuario;
};

const usuarios: Usuario[] = [
  {
    id: "prop1",
    nombre: "Juan Perez",
    email: "juan.perez@example.com",
    telefono: "555-1234",
    rol: "Propietario",
  },
  {
    id: "inq1",
    nombre: "Maria Garcia",
    email: "maria.garcia@example.com",
    telefono: "555-5678",
    rol: "Inquilino",
  },
  {
    id: "tec1",
    nombre: "Carlos Martinez",
    email: "carlos.martinez@example.com",
    telefono: "555-9012",
    rol: "Tecnico",
  },
  {
    id: "admin1",
    nombre: "Ana Rodriguez",
    email: "admin@alquila360.com",
    telefono: "555-0000",
    rol: "Administrador",
  },
];

const tabs = [
  "Todos",
  "Propietarios",
  "Inquilinos",
  "Tecnicos",
  "Administradores",
] as const;

type Tab = (typeof tabs)[number];

export default function UsuariosPage() {
  const [tab, setTab] = useState<Tab>("Todos");

  const filtered = usuarios.filter((u) => {
    if (tab === "Todos") return true;
    if (tab === "Propietarios") return u.rol === "Propietario";
    if (tab === "Inquilinos") return u.rol === "Inquilino";
    if (tab === "Tecnicos") return u.rol === "Tecnico";
    if (tab === "Administradores") return u.rol === "Administrador";
    return true;
  });

  const getRolClasses = (rol: RolUsuario) => {
    if (rol === "Propietario")
      return "bg-emerald-100 text-emerald-700 border border-emerald-300";
    if (rol === "Inquilino")
      return "bg-blue-100 text-blue-700 border border-blue-300";
    if (rol === "Tecnico")
      return "bg-amber-100 text-amber-700 border border-amber-300";
    return "bg-pink-100 text-pink-700 border border-pink-300";
  };

  return (
    <main className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      {/* sidebar */}
      <aside className="w-64 bg-[#0b3b2c] text-white flex flex-col py-6 px-4">
        <div className="text-2xl font-bold tracking-wide mb-10 px-2">
          ALQUILA 360
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = item.label === activeLabel;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`w-full block px-3 py-2 rounded-lg text-sm ${
                  isActive
                    ? "bg-[#4b7f5e] font-semibold"
                    : "hover:bg-[#164332]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 border-t border-white/20 pt-4 px-2 text-xs space-y-1">
          <div>Administrador</div>
          <button className="text-slate-200 hover:underline">
            Cerrar sesion
          </button>
        </div>
      </aside>

      {/* contenido usuarios */}
      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        <header className="mb-4">
          <h1 className="text-3xl font-extrabold text-[#123528]">
            Gestion de Usuarios
          </h1>
          <p className="text-sm text-slate-500">
            Administra todos los usuarios del sistema
          </p>
        </header>

        <div className="flex justify-between items-center mb-4">
          {/* tabs */}
          <div className="inline-flex rounded-full bg-slate-100 p-1 text-sm">
            {tabs.map((t) => {
              const active = t === tab;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`px-4 py-1 rounded-full ${
                    active
                      ? "bg-white shadow-sm text-[#123528] font-semibold"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>

          <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold">
            Agregar Usuario
          </button>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Email</th>
                <th className="p-3">Telefono</th>
                <th className="p-3">Rol</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.id}</td>
                  <td className="p-3">{u.nombre}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.telefono}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getRolClasses(
                        u.rol
                      )}`}
                    >
                      {u.rol}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button className="p-2 bg-emerald-100 rounded-lg hover:bg-emerald-200">
                        ✏️
                      </button>
                      <button className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200">
                        👁️
                      </button>
                      <button className="p-2 bg-red-100 rounded-lg hover:bg-red-200">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-400">
                    No hay usuarios para este filtro
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
