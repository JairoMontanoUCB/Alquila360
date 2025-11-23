"use client";

export default function DashboardInquilino() {
  // Datos fijos por ahora, luego los traen del backend
  const resumen = {
    contratosActivos: 3,
    proximoPago: "15/12/2025",
    cuotasPendientes: 1,
    totalPendiente: 300,
    tickets: {
      urgentes: 0,
      enProceso: 0,
      resueltos: 4,
    },
  };

  const menuItems = [
    { label: "Cuenta", icon: "👤" },
    { label: "Notificaciones", icon: "🔔" },
    { label: "Contratos", icon: "📄" },
    { label: "Mantenimiento", icon: "🛠️" },
    { label: "Reportes", icon: "📑" },
    { label: "Pagos", icon: "💳" },
  ];

  return (
    <div className="min-h-screen flex bg-[#f7f5ee]">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#c45a00] text-white flex flex-col">
        <div className="px-8 py-6 border-b border-white/10">
          <h1 className="text-3xl font-extrabold tracking-wide text-[#ffcc00]">
            Alquila360
          </h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-white hover:bg-white/10 transition"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 px-10 py-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-10">
          Hola, aquí puedes revisar tus contratos y próximos pagos.
        </h2>

        {/* GRID 2x2 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          {/* Contrato activo */}
          <div className="bg-[#93a3a7] rounded-xl shadow-md px-8 py-6 flex flex-col justify-between">
            <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
              Contrato activo
            </h3>
            <div className="flex items-center justify-center gap-6">
              <span className="text-5xl font-bold text-white">
                {resumen.contratosActivos}
              </span>
              <span className="text-5xl">📄</span>
            </div>
          </div>

          {/* Próximo pago */}
          <div className="bg-[#93a3a7] rounded-xl shadow-md px-8 py-6 flex flex-col justify-between">
            <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
              Próximo pago
            </h3>
            <div className="flex items-center justify-center gap-6">
              <span className="text-3xl font-semibold text-white">
                {resumen.proximoPago}
              </span>
              <span className="text-5xl">📅</span>
            </div>
          </div>

          {/* Cuotas pendientes */}
          <div className="bg-[#93a3a7] rounded-xl shadow-md px-8 py-6 flex flex-col justify-between">
            <h3 className="text-lg font-medium text-gray-900 mb-3 text-center">
              Cuotas pendientes
            </h3>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-bold text-white mb-2">
                {resumen.cuotasPendientes}
              </span>
              <span className="text-2xl font-bold text-red-700">
                Total: ${resumen.totalPendiente}
              </span>
            </div>
          </div>

          {/* Tickets abiertos */}
          <div className="bg-[#93a3a7] rounded-xl shadow-md px-8 py-6 flex flex-col">
            <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
              Tickets abiertos
            </h3>
            <div className="flex justify-center gap-6">
              {/* Urgentes */}
              <div className="border-4 rounded-md px-5 py-2 border-red-700 flex items-center justify-center">
                <span className="text-2xl font-semibold text-red-700">
                  {resumen.tickets.urgentes}
                </span>
              </div>
              {/* En proceso */}
              <div className="border-4 rounded-md px-5 py-2 border-orange-500 flex items-center justify-center">
                <span className="text-2xl font-semibold text-orange-500">
                  {resumen.tickets.enProceso}
                </span>
              </div>
              {/* Resueltos */}
              <div className="border-4 rounded-md px-5 py-2 border-green-600 flex items-center justify-center bg-white/5">
                <span className="text-2xl font-semibold text-green-600">
                  {resumen.tickets.resueltos}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
