"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

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

const activeLabel = "Propiedades";

const propiedades = [
  {
    img: "/propiedad.png",
    direccion: "Av. Principal 123, Piso 5",
    estado: "Disponible",
    precio: "$1200/mes",
    descripcion:
      "Moderno departamento de 2 habitaciones con banos completos.",
  },
  {
    img: "/propiedad.png",
    direccion: "Calle Secundaria 456",
    estado: "Ocupada",
    precio: "$2500/mes",
    descripcion:
      "Casa de lujo con 4 habitaciones, jardin privado y estacionamiento para 3 vehiculos.",
  },
  {
    img: "/propiedad.png",
    direccion: "Plaza Central 789, Apto 12",
    estado: "Disponible",
    precio: "$950/mes",
    descripcion:
      "Acogedor apartamento de 1 habitacion en el centro, ideal para profesionales.",
  },
];

export default function PropiedadesPage() {
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

      {/* contenido propiedades */}
      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        <header className="mb-4">
          <h1 className="text-3xl font-extrabold text-[#123528]">
            Mis Propiedades
          </h1>
          <p className="text-sm text-slate-500">
            Gestiona todas tus propiedades
          </p>
        </header>

        <div className="flex justify-end mb-4">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold">
            Agregar Propiedad
          </button>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">Imagen</th>
                <th className="p-3">Direccion</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Descripcion</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {propiedades.map((prop, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3">
                    <Image
                      src={prop.img}
                      width={80}
                      height={80}
                      alt="propiedad"
                      className="rounded-lg object-cover"
                    />
                  </td>
                  <td className="p-3">{prop.direccion}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs ${
                        prop.estado === "Disponible"
                          ? "bg-emerald-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {prop.estado}
                    </span>
                  </td>
                  <td className="p-3">{prop.precio}</td>
                  <td className="p-3 w-64">{prop.descripcion}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button className="p-2 bg-emerald-100 rounded-lg hover:bg-emerald-200">
                        ✏️
                      </button>
                      <button className="p-2 bg-yellow-100 rounded-lg hover:bg-yellow-200">
                        🗂️
                      </button>
                      <button className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200">
                        👁️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
