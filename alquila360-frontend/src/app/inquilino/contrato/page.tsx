"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                                  SIDEBAR                                   */
/* -------------------------------------------------------------------------- */

const inquilinoMenu = [
  { label: "Home", path: "/inquilino" },
  { label: "Contrato", path: "/inquilino/contrato" },
  { label: "Pagos", path: "/inquilino/pagos" },
  { label: "Tickets", path: "/inquilino/tickets" },
  { label: "Expensas", path: "/inquilino/expensas" },
  { label: "Perfil", path: "/inquilino/perfil" },
];

function SidebarInquilino() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0b3b2c] text-white flex flex-col py-6 px-4">
      <div
        className="text-2xl font-extrabold tracking-wide mb-10 px-2 cursor-pointer"
        onClick={() => router.push("/inquilino")}
      >
        ALQUILA 360
      </div>

      <nav className="flex-1 space-y-1">
        {inquilinoMenu.map((item) => {
          const active = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition ${
                active ? "bg-[#4b7f5e] font-semibold" : "hover:bg-[#164332]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-6 px-2 text-xs text-slate-300">Inquilino</div>
      <button className="mt-2 px-3 py-2 text-xs text-slate-200 hover:bg-[#164332] rounded-lg text-left">
        Cerrar sesion
      </button>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/*                              DATOS DEL CONTRATO                             */
/* -------------------------------------------------------------------------- */

const contratoInfo = {
  estado: "Vigente",
  mesesRestantes: 10,
  numero: "C-001",
  direccion: "Calle Secundaria 456",
  tipoPropiedad: "Casa",
  superficie: "120 m²",
  ambientes: "3",
  fechaInicio: "31 de diciembre de 2023",
  fechaFin: "31 de diciembre de 2024",
  alquilerMensual: "$2,500",
  garantia: "$5,000",
  diaVencimiento: "Dia 10",
};

/* -------------------------------------------------------------------------- */
/*                               PAGINA CONTRATO                               */
/* -------------------------------------------------------------------------- */

export default function ContratoInquilinoPage() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      <SidebarInquilino />

      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        {/* Header */}
        <header className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-[#123528]">
              Mi Contrato
            </h1>
            <p className="text-xs text-slate-500">
              Informacion de tu contrato de alquiler
            </p>
          </div>

          <div className="flex gap-2">
            <button className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white hover:bg-slate-100 flex items-center gap-2">
              <span>📄</span>
              <span>Descargar PDF</span>
            </button>
            <button
              onClick={() => setOpenModal(true)}
              className="px-3 py-2 text-xs rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2"
            >
              <span>👁️</span>
              <span>Ver Contrato Completo</span>
            </button>
          </div>
        </header>

        {/* Card principal del contrato */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
          {/* Estado */}
          <div className="border-b border-slate-100 px-5 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Contrato actual</p>
              <h2 className="text-lg font-semibold text-[#123528]">
                Contrato cont1
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-[11px] bg-emerald-100 text-emerald-700 border border-emerald-300 font-semibold">
                {contratoInfo.estado}
              </span>
              <p className="text-xs text-slate-500">
                {contratoInfo.mesesRestantes} meses restantes
              </p>
            </div>
          </div>

          {/* Informacion de la propiedad y financiera */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-5 py-4 border-b border-slate-100">
            <div className="border border-slate-200 rounded-lg px-4 py-3 text-xs">
              <p className="text-[11px] text-slate-500 mb-1">
                Informacion de la Propiedad
              </p>
              <p className="font-semibold text-[#123528]">
                {contratoInfo.direccion}
              </p>
              <p className="text-slate-600">
                Tipo: {contratoInfo.tipoPropiedad} · Superficie:{" "}
                {contratoInfo.superficie} · Ambientes:{" "}
                {contratoInfo.ambientes}
              </p>
            </div>

            <div className="border border-slate-200 rounded-lg px-4 py-3 text-xs">
              <p className="text-[11px] text-slate-500 mb-1">
                Informacion Financiera
              </p>
              <p className="text-slate-500">Cuota Mensual</p>
              <p className="text-lg font-bold text-[#123528]">
                {contratoInfo.alquilerMensual}
              </p>
              <p className="text-slate-500 mt-1">Garantia Depositada</p>
              <p className="font-semibold text-[#123528]">
                {contratoInfo.garantia}
              </p>
            </div>
          </div>

          {/* Duracion del contrato */}
          <div className="px-5 py-4">
            <p className="text-xs text-slate-500 mb-2">Duracion del Contrato</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="border border-slate-200 rounded-lg px-4 py-3">
                <p className="text-[11px] text-slate-500">Fecha de Inicio</p>
                <p className="font-semibold text-[#123528]">
                  {contratoInfo.fechaInicio}
                </p>
              </div>
              <div className="border border-slate-200 rounded-lg px-4 py-3">
                <p className="text-[11px] text-slate-500">
                  Fecha de Finalizacion
                </p>
                <p className="font-semibold text-[#123528]">
                  {contratoInfo.fechaFin}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Condiciones principales (texto) */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 mb-10 text-xs leading-relaxed text-slate-700 space-y-4">
          <div>
            <p className="font-semibold text-[#123528] mb-1">Pago de Alquiler</p>
            <p>
              El pago del alquiler debe realizarse dentro de los primeros 10
              dias de cada mes. El monto mensual es de{" "}
              {contratoInfo.alquilerMensual}.
            </p>
          </div>

          <div>
            <p className="font-semibold text-[#123528] mb-1">
              Mantenimiento y Reparaciones
            </p>
            <p>
              El inquilino se compromete a mantener la propiedad en buen estado
              y realizar las reparaciones menores necesarias. Las reparaciones
              mayores son responsabilidad del propietario.
            </p>
          </div>

          <div>
            <p className="font-semibold text-[#123528] mb-1">
              Servicios y Expensas
            </p>
            <p>
              Los servicios publicos (agua, luz, gas) y expensas comunes son a
              cargo del inquilino durante la vigencia del contrato.
            </p>
          </div>

          <div>
            <p className="font-semibold text-[#123528] mb-1">
              Uso de la Propiedad
            </p>
            <p>
              La propiedad se destina exclusivamente para vivienda. No se
              permiten modificaciones estructurales sin autorizacion escrita del
              propietario.
            </p>
          </div>
        </section>
      </section>

      {/* ----------------------------- MODAL CONTRATO ----------------------------- */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-[#f7f5ee] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl border border-emerald-900/20">
            {/* Header superior pequeñito */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-emerald-900/20 bg-white/80 rounded-t-xl">
              <span className="text-xs text-slate-600">Contrato de Alquiler</span>
              <button
                onClick={() => setOpenModal(false)}
                className="text-slate-500 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Encabezado central como en la maqueta */}
            <div className="px-6 pt-4 pb-2 border-b border-emerald-900/20 text-center">
              <p className="text-[11px] text-slate-500 mb-1">
                Sistema de Gestion ALQUILA 360
              </p>
              <h2 className="text-xl font-extrabold text-[#123528] tracking-wide">
                CONTRATO DE LOCACION
              </h2>
              <p className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                Contrato N° {contratoInfo.numero}
              </p>
            </div>

            {/* Contenido del contrato */}
            <div className="px-6 py-4 space-y-4 text-xs">
              {/* Partes del contrato */}
              <section>
                <p className="text-[11px] text-slate-500 mb-2">
                  PARTES DEL CONTRATO
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="border border-emerald-900/20 rounded-lg p-3 bg-white">
                    <p className="text-[11px] text-slate-500 mb-1">
                      LOCADOR (Propietario)
                    </p>
                    <p className="font-semibold text-[#123528]">
                      Juan Carlos Martinez
                    </p>
                    <p>DNI: 28.456.789</p>
                    <p>martinez@email.com</p>
                  </div>
                  <div className="border border-emerald-900/20 rounded-lg p-3 bg-white">
                    <p className="text-[11px] text-slate-500 mb-1">
                      LOCATARIO (Inquilino)
                    </p>
                    <p className="font-semibold text-[#123528]">
                      Maria Gonzalez
                    </p>
                    <p>DNI: 32.654.987</p>
                    <p>maria@email.com</p>
                  </div>
                </div>
              </section>

              {/* Inmueble */}
              <section>
                <p className="text-[11px] text-slate-500 mb-2">INMUEBLE</p>
                <div className="border border-emerald-900/20 rounded-lg p-3 bg-white">
                  <p className="font-semibold text-[#123528] mb-1">
                    Direccion de la Propiedad
                  </p>
                  <p>{contratoInfo.direccion}</p>
                  <p>
                    Tipo: {contratoInfo.tipoPropiedad} · Superficie:{" "}
                    {contratoInfo.superficie} · Ambientes:{" "}
                    {contratoInfo.ambientes}
                  </p>
                </div>
              </section>

              {/* Plazo del contrato */}
              <section>
                <p className="text-[11px] text-slate-500 mb-2">
                  PLAZO DEL CONTRATO
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="border border-emerald-900/20 rounded-lg p-3 bg-white">
                    <p className="text-[11px] text-slate-500 mb-1">
                      Fecha de Inicio
                    </p>
                    <p className="font-semibold text-[#123528]">
                      {contratoInfo.fechaInicio}
                    </p>
                  </div>
                  <div className="border border-emerald-900/20 rounded-lg p-3 bg-white">
                    <p className="text-[11px] text-slate-500 mb-1">
                      Fecha de Finalizacion
                    </p>
                    <p className="font-semibold text-[#123528]">
                      {contratoInfo.fechaFin}
                    </p>
                  </div>
                </div>
              </section>

              {/* Condiciones economicas */}
              <section>
                <p className="text-[11px] text-slate-500 mb-2">
                  CONDICIONES ECONOMICAS
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="border border-emerald-900/20 rounded-lg p-3 bg-white">
                    <p className="text-[11px] text-slate-500 mb-1">
                      Alquiler Mensual
                    </p>
                    <p className="font-semibold text-[#123528]">
                      {contratoInfo.alquilerMensual}
                    </p>
                  </div>
                  <div className="border border-emerald-900/20 rounded-lg p-3 bg-white">
                    <p className="text-[11px] text-slate-500 mb-1">Garantia</p>
                    <p className="font-semibold text-[#123528]">
                      {contratoInfo.garantia}
                    </p>
                  </div>
                  <div className="border border-emerald-900/20 rounded-lg p-3 bg-white">
                    <p className="text-[11px] text-slate-500 mb-1">
                      Vencimiento
                    </p>
                    <p className="font-semibold text-[#123528]">
                      {contratoInfo.diaVencimiento}
                    </p>
                  </div>
                </div>
              </section>

              {/* Detalle de cuotas */}
              <section>
                <p className="text-[11px] text-slate-500 mb-2">
                  DETALLE DE CUOTAS
                </p>
                <div className="border border-emerald-900/20 rounded-lg p-3 bg-white space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <p className="text-[11px] text-slate-500 mb-1">
                        Frecuencia
                      </p>
                      <p className="font-semibold text-[#123528]">Mensual</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 mb-1">
                        Numero de Cuotas
                      </p>
                      <p className="font-semibold text-[#123528]">12 cuotas</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 mb-1">
                        Valor por Cuota
                      </p>
                      <p className="font-semibold text-[#123528]">
                        {contratoInfo.alquilerMensual}
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Todas las cuotas tendran el mismo valor mensual sin
                    variacion.
                  </p>
                </div>
              </section>

              {/* Penalidades */}
              <section>
                <p className="text-[11px] text-slate-500 mb-2">PENALIDADES</p>
                <div className="border border-emerald-900/20 rounded-lg p-3 bg-white space-y-1">
                  <p>· Mora del 2% por dia de atraso en el pago.</p>
                  <p>
                    · El locatario sera responsable de los costos de reparacion
                    por daños causados.
                  </p>
                  <p>
                    · Rescision anticipada: Penalidad equivalente a 2 meses de
                    alquiler.
                  </p>
                </div>
              </section>

              {/* Clausulas adicionales */}
              <section>
                <p className="text-[11px] text-slate-500 mb-2">
                  CLAUSULAS ADICIONALES
                </p>
                <div className="border border-emerald-900/20 rounded-lg p-3 bg-white space-y-1">
                  <p>
                    · El locatario se compromete a mantener la propiedad en buen
                    estado.
                  </p>
                  <p>
                    · No se permiten modificaciones estructurales sin
                    autorizacion escrita.
                  </p>
                  <p>
                    · Los gastos de servicios publicos correran por cuenta del
                    locatario.
                  </p>
                  <p>
                    · Prohibida la cesion o subarriendo sin consentimiento del
                    locador.
                  </p>
                </div>
              </section>

              {/* Firmas */}
              <section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-center">
                  <div>
                    <div className="border-t border-slate-400 pt-2 inline-block px-6">
                      <p className="font-semibold text-[#123528]">
                        Juan Carlos Martinez
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Firma del Locador
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="border-t border-slate-400 pt-2 inline-block px-6">
                      <p className="font-semibold text-[#123528]">
                        Maria Gonzalez
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Firma del Locatario
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer modal */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-emerald-900/10 bg-white/70 rounded-b-xl">
              <button className="px-4 py-2 rounded-lg text-xs border border-slate-300 hover:bg-slate-100">
                Imprimir
              </button>
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 rounded-lg text-xs bg-amber-500 text-white hover:bg-amber-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
