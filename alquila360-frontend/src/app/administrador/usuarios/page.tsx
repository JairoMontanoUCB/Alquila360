"use client";

import React, { useState } from "react";
import Link from "next/link";
import SidebarAdministrador from "../../components/sideBarAdministrador";



const activeLabel = "Usuarios";

type RolUsuario = "Propietario" | "Inquilino" | "Tecnico" | "Administrador";

type Usuario = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: RolUsuario;
};

const usuariosBase: Usuario[] = [
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
  const [usuarios] = useState<Usuario[]>(usuariosBase);

  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [mostrarModalReporte, setMostrarModalReporte] = useState(false);
  const [usuarioReporte, setUsuarioReporte] = useState<Usuario | null>(null);

  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null);

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

  // guardar desde "Agregar Usuario" -> muestra reporte
  const handleGuardarUsuarioNuevo = () => {
    const usuarioEjemplo = usuariosBase[0]; // maqueta
    setUsuarioReporte(usuarioEjemplo);
    setMostrarModalAgregar(false);
    setMostrarModalReporte(true);
  };

  const handleVerUsuario = (u: Usuario) => {
    setUsuarioReporte(u);
    setMostrarModalReporte(true);
  };

  const handleEditarDesdeTabla = (u: Usuario) => {
    setUsuarioEditar(u);
    setMostrarModalEditar(true);
  };

  const handleEditarDesdeReporte = (u: Usuario) => {
    setUsuarioEditar(u);
    setMostrarModalReporte(false);
    setMostrarModalEditar(true);
  };

  const handleGuardarEdicion = () => {
    // solo cerramos (maqueta)
    setMostrarModalEditar(false);
  };

  return (
    <div className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      <SidebarAdministrador />

      {/* contenido usuarios */}
      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        <header className="mb-4 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-[#123528]">
              Gestion de Usuarios
            </h1>
            <p className="text-sm text-slate-500">
              Administra todos los usuarios del sistema
            </p>
          </div>
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

          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold"
            onClick={() => setMostrarModalAgregar(true)}
          >
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
                      <button
                        className="p-2 bg-emerald-100 rounded-lg hover:bg-emerald-200"
                        onClick={() => handleEditarDesdeTabla(u)}
                      >
                        ✏️
                      </button>
                      <button
                        className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"
                        onClick={() => handleVerUsuario(u)}
                      >
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

        {/* MODAL AGREGAR USUARIO */}
        {mostrarModalAgregar && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-[#123528]">
                  Agregar Nuevo Usuario
                </h2>
                <button
                  className="text-slate-500 hover:text-slate-700"
                  onClick={() => setMostrarModalAgregar(false)}
                >
                  ✕
                </button>
              </div>

              <div className="px-6 py-4 space-y-4 text-sm">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
                    placeholder="Juan Perez"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Correo Electronico
                    </label>
                    <input
                      className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
                      placeholder="juan@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Telefono
                    </label>
                    <input
                      className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
                      placeholder="+54 9 11 1234-5678"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Rol del Usuario
                    </label>
                    <select className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm">
                      <option>Inquilino</option>
                      <option>Propietario</option>
                      <option>Tecnico</option>
                      <option>Administrador</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Estado de la Cuenta
                    </label>
                    <select className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm">
                      <option>Activo</option>
                      <option>Inactivo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Contrasena
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
                    placeholder="********"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Minimo 8 caracteres, incluye mayusculas, minusculas y numeros
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-4 flex justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm hover:bg-slate-50"
                    onClick={() => setMostrarModalAgregar(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-sm font-semibold text-black"
                    onClick={handleGuardarUsuarioNuevo}
                  >
                    Guardar Usuario
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL EDITAR USUARIO */}
        {mostrarModalEditar && usuarioEditar && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-[#123528]">
                  Editar Usuario
                </h2>
                <button
                  className="text-slate-500 hover:text-slate-700"
                  onClick={() => setMostrarModalEditar(false)}
                >
                  ✕
                </button>
              </div>

              <div className="px-6 py-4 space-y-4 text-sm">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
                    defaultValue={usuarioEditar.nombre}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Correo Electronico
                    </label>
                    <input
                      className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
                      defaultValue={usuarioEditar.email}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Telefono
                    </label>
                    <input
                      className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
                      defaultValue={usuarioEditar.telefono}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Rol del Usuario
                    </label>
                    <select
                      className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
                      defaultValue={usuarioEditar.rol}
                    >
                      <option value="Propietario">Propietario</option>
                      <option value="Inquilino">Inquilino</option>
                      <option value="Tecnico">Tecnico</option>
                      <option value="Administrador">Administrador</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Estado de la Cuenta
                    </label>
                    <select className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm">
                      <option>Activo</option>
                      <option>Inactivo</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 flex justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm hover:bg-slate-50"
                    onClick={() => setMostrarModalEditar(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-sm font-semibold text-black"
                    onClick={handleGuardarEdicion}
                  >
                    Guardar Usuario
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL REPORTE COMPLETO */}
        {mostrarModalReporte && usuarioReporte && (
          <ModalReporteUsuario
            usuario={usuarioReporte}
            onClose={() => setMostrarModalReporte(false)}
            onEdit={handleEditarDesdeReporte}
          />
        )}
      </section>
    </div>
  );
}

/* ---------- MODAL REPORTE ---------- */

type ModalReporteProps = {
  usuario: Usuario;
  onClose: () => void;
  onEdit: (u: Usuario) => void;
};

function ModalReporteUsuario({ usuario, onClose, onEdit }: ModalReporteProps) {
  const inicial = usuario.nombre.charAt(0).toUpperCase();

  const fechaRegistro = "15 Ene 2024";
  const estado = "Activo";
  const totalPropiedades = 3;
  const propiedadesOcupadas = 2;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-[#123528]">
            Reporte Completo del Usuario
          </h2>
          <button
            className="text-slate-500 hover:text-slate-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 text-sm">
          <div className="border border-slate-300 rounded-xl p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xl font-semibold">
              {inicial}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">
                {usuario.nombre}
              </p>
              <span className="inline-block mt-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                {usuario.rol}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-300 rounded-xl p-3">
              <p className="text-[11px] text-slate-500 mb-1">
                Correo Electronico
              </p>
              <p className="text-sm text-slate-800">{usuario.email}</p>
            </div>
            <div className="border border-slate-300 rounded-xl p-3">
              <p className="text-[11px] text-slate-500 mb-1">Telefono</p>
              <p className="text-sm text-slate-800">{usuario.telefono}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-slate-300 rounded-xl p-3">
              <p className="text-[11px] text-slate-500 mb-1">Estado</p>
              <p className="text-sm font-semibold text-emerald-600">{estado}</p>
            </div>
            <div className="border border-slate-300 rounded-xl p-3">
              <p className="text-[11px] text-slate-500 mb-1">
                Fecha de Registro
              </p>
              <p className="text-sm text-slate-800">{fechaRegistro}</p>
            </div>
            <div className="border border-slate-300 rounded-xl p-3">
              <p className="text-[11px] text-slate-500 mb-1">ID de Usuario</p>
              <p className="text-sm text-slate-800">{usuario.id}</p>
            </div>
          </div>

          <div className="border border-slate-300 rounded-xl p-4 space-y-3">
            <p className="text-sm font-semibold text-slate-700">
              Propiedades
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-slate-500 mb-1">Total de Propiedades</p>
                <p className="text-base font-semibold text-slate-800">
                  {totalPropiedades}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-slate-500 mb-1">Propiedades Ocupadas</p>
                <p className="text-base font-semibold text-slate-800">
                  {propiedadesOcupadas}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm hover:bg-slate-50"
              onClick={onClose}
            >
              Cerrar
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-sm font-semibold text-black"
              onClick={() => onEdit(usuario)}
            >
              Editar Usuario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
