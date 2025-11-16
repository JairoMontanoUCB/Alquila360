"use client";

export default function DashboardPropietario() {
  // Estos datos ahora son fijos, luego los pueden traer del backend
  const resumen = {
    propiedadesActivas: 3,
    pagosMes: 10500,
    contratosVigentes: 0,
    pagosPendientes: 0,
    ticketsAbiertos: 0,
  };

  const menuItems = [
    { label: "Cuenta", icon: "👤" },
    { label: "Notificaciones", icon: "🔔" },
    { label: "Dashboard", icon: "📊" },
    { label: "Contratos", icon: "📄" },
    { label: "Mantenimiento", icon: "🛠️" },
    { label: "Reportes", icon: "📑" },
    { label: "Pagos", icon: "💳" },
  ];

  return (
    <div className="min-h-screen flex bg-[#f7f5ee]">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#004030] text-white flex flex-col">
        <div className="px-8 py-6 border-b border-white/10">
          <h1 className="text-3xl font-bold tracking-wide">Alquila360</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[#ffcc00] hover:bg-white/10 transition"
              type="button"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 px-10 py-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8">
          Bienvenido, aquí tienes un resumen de tus propiedades.
        </h2>

        {/* PRIMERA FILA: 3 TARJETAS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Propiedades activas */}
          <div className="bg-[#93a3a7] rounded-xl shadow-md px-6 py-5 flex flex-col justify-between">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Propiedades activas
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-4xl font-bold text-white">
                {resumen.propiedadesActivas}
              </span>
              <span className="text-4xl">🏠</span>
            </div>
          </div>

          {/* Pagos recibidos este mes */}
          <div className="bg-[#93a3a7] rounded-xl shadow-md px-6 py-5 flex flex-col justify-between">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Pagos recibidos este mes
            </h3>
            <span className="text-3xl font-bold text-white">
              ${resumen.pagosMes.toLocaleString("en-US")}
            </span>
          </div>

          {/* Contratos vigentes */}
          <div className="bg-[#93a3a7] rounded-xl shadow-md px-6 py-5 flex flex-col justify-between">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Contratos vigentes
            </h3>
            <span className="text-3xl font-bold text-white">
              {resumen.contratosVigentes || "-"}
            </span>
          </div>
        </section>

        {/* SEGUNDA FILA: 2 TARJETAS GRANDES */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pagos pendientes */}
          <div className="bg-[#93a3a7] rounded-xl shadow-md px-6 py-5 flex flex-col">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Pagos pendientes…
            </h3>
            <span className="text-2xl font-semibold text-white">
              {resumen.pagosPendientes ? `$${resumen.pagosPendientes}` : "—"}
            </span>
          </div>

          {/* Tickets abiertos */}
          <div className="bg-[#93a3a7] rounded-xl shadow-md px-6 py-5 flex flex-col">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Tickets abiertos
            </h3>
            <span className="text-2xl font-semibold text-white">
              {resumen.ticketsAbiertos || "—"}
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
