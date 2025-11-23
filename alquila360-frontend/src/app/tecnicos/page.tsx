const sidebarBg = "#f4b000";       // amarillo
const mainBg = "#f6f3e8";           // fondo crema
const cardBg = "#8d9ea6";           // gris azulado de las tarjetas;

export default function TecnicosPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: mainBg }}>
      {/* SIDEBAR */}
      <aside
        style={{
          width: 260,
          backgroundColor: sidebarBg,
          color: "#fff",
          padding: "32px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 40,
          boxShadow: "4px 0 10px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 28 }}>Alquila360</div>

        <nav>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 20,
              padding: 0,
              margin: 0,
            }}
          >
            <SidebarItem icon="👤" label="Cuenta" />
            <SidebarItem icon="🔔" label="Notificaciones" />
            <SidebarItem icon="📄" label="Contratos" />
            <SidebarItem icon="🛠️" label="Mantenimiento" />
            <SidebarItem icon="📊" label="Reportes" />
            <SidebarItem icon="💳" label="Pagos" />
          </ul>
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main
        style={{
          flex: 1,
          padding: "40px 80px",
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 24,
            color: "#0d1b2a",
          }}
        >
          Hola, aqui tienes tus tareas pendientes para hoy.
        </h1>

        {/* FILA SUPERIOR DE TARJETAS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(260px, 1fr))",
            gap: 32,
            marginBottom: 24,
          }}
        >
          {/* Tickets asignados */}
          <section style={cardStyle()}>
            <h2 style={cardTitleStyle()}>Tickets asignados</h2>
            <div style={ticketRowStyle()}>
              <div style={ticketStyle("red")}>2</div>
              <div style={ticketStyle("orange")}>5</div>
              <div style={ticketStyle("green")}>3</div>
            </div>
          </section>

          {/* Tickets en proceso */}
          <section style={cardStyle()}>
            <h2 style={cardTitleStyle()}>Tickets en proceso</h2>
            <div style={ticketRowStyle()}>
              <div style={ticketStyle("red")}>0</div>
              <div style={ticketStyle("orange")}>5</div>
              <div style={ticketStyle("green")}>1</div>
            </div>
          </section>
        </div>

        {/* TARJETA INFERIOR */}
        <div style={{ maxWidth: "60%", margin: "0 auto" }}>
          <section style={cardStyle()}>
            <h2 style={cardTitleStyle()}>Tickets finalizados</h2>
            <div style={ticketRowStyle()}>
              <div style={ticketStyle("red")}>0</div>
              <div style={ticketStyle("orange")}>1</div>
              <div style={ticketStyle("green")}>6</div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ---------- COMPONENTES Y ESTILOS AUXILIARES ---------- */

function SidebarItem({ icon, label }: { icon: string; label: string }) {
  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 15,
        cursor: "pointer",
      }}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span>{label}</span>
    </li>
  );
}

function cardStyle(): React.CSSProperties {
  return {
    backgroundColor: cardBg,
    borderRadius: 20,
    padding: "24px 32px",
    boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: 160,
  };
}

function cardTitleStyle(): React.CSSProperties {
  return {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#111",
    fontWeight: 500,
  };
}

function ticketRowStyle(): React.CSSProperties {
  return {
    display: "flex",
    justifyContent: "center",
    gap: 20,
    alignItems: "center",
  };
}

function ticketStyle(
  color: "red" | "orange" | "green"
): React.CSSProperties {
  const colors: Record<typeof color, string> = {
    red: "#b60000",
    orange: "#e27b11",
    green: "#0e8c2c",
  };

  return {
    width: 52,
    height: 46,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: `3px solid ${colors[color]}`,
    color: colors[color],
    fontSize: 20,
    fontWeight: 700,
    backgroundColor: "transparent",
    borderRadius: 6,
  };
}

