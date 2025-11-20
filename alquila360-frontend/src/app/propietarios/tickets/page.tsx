"use client";

import Sidebar from "../../components/sideBarPropietario"; // cambia la ruta si tu archivo está en otro lado

type Ticket = {
  id: string;
  titulo: string;
  direccion: string;
  fecha: string;
  tecnico: string;
  estado: "Abierto" | "En proceso";
  etiqueta?: string; // No arreglado / Derivado, etc.
  color: "rojo" | "amarillo" | "verde";
};

const urgentes: Ticket[] = [
  {
    id: "TKT-001",
    titulo: "Fuga de agua en el baño principal",
    direccion: "Calle Secundaria 456",
    fecha: "2024-11-18",
    tecnico: "Carlos",
    estado: "Abierto",
    etiqueta: "No arreglado",
    color: "rojo",
  },
];

const medios: Ticket[] = [
  {
    id: "TKT-002",
    titulo: "La puerta de entrada no cierra correctamente",
    direccion: "Calle Secundaria 456",
    fecha: "2024-11-15",
    tecnico: "Carlos",
    estado: "En proceso",
    etiqueta: "Derivado",
    color: "amarillo",
  },
];

const bajos: Ticket[] = [
  {
    id: "TKT-003",
    titulo: "Pintura descascarada en la pared del dormitorio",
    direccion: "Calle Secundaria 456",
    fecha: "2024-11-10",
    tecnico: "Carlos",
    estado: "Abierto",
    color: "verde",
  },
];

function getTicketIdColor(ticket: Ticket) {
  if (ticket.color === "rojo") return "text-[#f04646]";
  if (ticket.color === "amarillo") return "text-[#f29b26]";
  return "text-[#1c7b3b]";
}

function getEstadoPill(ticket: Ticket) {
  if (ticket.estado === "Abierto") {
    return "bg-[#dbe7ff] text-[#3b5fb4]";
  }
  return "bg-[#ffeac0] text-[#d18b1a]";
}

function SeccionTickets({
  titulo,
  tickets,
}: {
  titulo: string;
  tickets: Ticket[];
}) {
  return (
    <section className="mb-8">
      {/* Encabezado de sección */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">{titulo}</h3>
        <div className="h-6 w-6 rounded-full border border-[#f0cba3] bg-[#fff8ec] text-xs flex items-center justify-center text-[#f29b26]">
          {tickets.length}
        </div>
      </div>

      {/* Contenedor de tarjetas */}
      <div className="bg-white border border-[#cfc7b4] rounded-2xl px-5 py-4">
        {tickets.map((ticket) => (
          <article
            key={ticket.id}
            className="border border-[#d4d0c5] rounded-2xl px-5 py-4"
          >
            {/* Cabecera ticket */}
            <div className="flex items-start justify-between mb-2">
              <div className="space-y-1 text-sm text-[#374046]">
                <p className={`font-semibold ${getTicketIdColor(ticket)}`}>
                  {ticket.id}
                </p>
                <p>{ticket.titulo}</p>
                <p className="text-xs text-gray-600">{ticket.direccion}</p>
                <p className="text-xs text-gray-600">{ticket.fecha}</p>
                <p className="text-xs text-gray-600">
                  Técnico: <span className="font-medium">{ticket.tecnico}</span>
                </p>
                {ticket.etiqueta && (
                  <span className="inline-block mt-1 px-3 py-1 text-[11px] rounded-full bg-[#e5e5e5] text-[#555]">
                    {ticket.etiqueta}
                  </span>
                )}
              </div>

              {/* Estado */}
              <span
                className={`px-3 py-1 text-xs rounded-full font-semibold ${getEstadoPill(
                  ticket
                )}`}
              >
                {ticket.estado}
              </span>
            </div>

            {/* Acciones */}
            <div className="mt-3 flex gap-2">
              <button className="border border-[#15352b] rounded-lg px-3 py-1 text-xs hover:bg-gray-100 transition">
                👁️
              </button>
              <button className="border border-[#15352b] rounded-lg px-3 py-1 text-xs hover:bg-gray-100 transition">
                ✏️
              </button>
              <button className="border border-[#15352b] rounded-lg px-3 py-1 text-xs hover:bg-gray-100 transition">
                ✖
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function TicketsPage() {
  return (
    <div className="min-h-screen flex bg-[#f3efe3] text-[#15352b]">
      <Sidebar />

      <main className="flex-1 px-10 py-10">
        {/* Título + botones */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-[32px] font-bold">Gestión de Tickets</h2>
            <p className="text-sm text-gray-600">
              Mantenimiento y problemas por prioridad
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-[#f4b000] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#d89c00] text-sm transition">
              <span>＋</span>
              <span>Crear Ticket</span>
            </button>
            <button className="border border-[#15352b] rounded-lg px-4 py-2 text-sm hover:bg-[#eae4d7] transition">
              Ver Histórico
            </button>
          </div>
        </header>

        {/* Secciones por prioridad */}
        <SeccionTickets titulo="Urgentes" tickets={urgentes} />
        <SeccionTickets titulo="Medios" tickets={medios} />
        <SeccionTickets titulo="Bajos" tickets={bajos} />
      </main>
    </div>
  );
}
