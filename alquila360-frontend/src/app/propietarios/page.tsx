import Image from "next/image";
import Navbar from "../components/Navbar"; // ojo: ../ porque estamos dentro de /propietarios

export default function PropietariosPage() {
  const acciones = [
    {
      icon: "➕",
      label: "Publicar propiedad",
      desc: "Registra una nueva casa, departamento o local disponible para alquiler.",
    },
    {
      icon: "📩",
      label: "Ver solicitudes",
      desc: "Revisa quiénes están interesados en tus propiedades y responde rápidamente.",
    },
    {
      icon: "📜",
      label: "Gestión de contratos",
      desc: "Lleva control de contratos activos, vencimientos y renovaciones.",
    },
    {
      icon: "💰",
      label: "Pagos y estados",
      desc: "Consulta pagos realizados, pendientes y genera reportes básicos.",
    },
    {
      icon: "🏠",
      label: "Mis propiedades",
      desc: "Administra el detalle, fotos y descripción de cada propiedad publicada.",
    },
    {
      icon: "👤",
      label: "Perfil y contacto",
      desc: "Actualiza tus datos de propietario y canales de contacto.",
    },
  ];

  return (
    <>
      <Navbar />

      {/* HERO PROPIETARIOS */}
      <section className="relative w-full h-[520px] flex items-center justify-center">
        <Image
          src="/hero.png"
          alt="Fondo del hero para propietarios"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 text-center text-white px-6 max-w-5xl w-full">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Administra tus propiedades de forma fácil y segura.
          </h1>

          <p className="mt-4 text-base md:text-lg tracking-wide">
            Publica, controla solicitudes, gestiona contratos y pagos desde un
            solo lugar.
          </p>

          <div className="mt-6 mx-auto flex w-full max-w-3xl">
            <input
              type="text"
              placeholder="Buscar propiedad o inquilino"
              className="flex-1 px-6 py-3 rounded-l-full border border-white/20 outline-none text-black"
            />
            <button
              type="button"
              className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-r-full font-semibold"
            >
              Buscar
            </button>
          </div>
        </div>
      </section>

      {/* ACCIONES PARA PROPIETARIOS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 md:p-10">
        {acciones.map((a) => (
          <div
            key={a.label}
            className="flex flex-col items-start bg-white rounded-2xl shadow hover:shadow-lg transition p-6"
          >
            <span className="text-3xl mb-2">{a.icon}</span>
            <h3 className="text-lg font-semibold mb-1">{a.label}</h3>
            <p className="text-sm text-gray-600">{a.desc}</p>
          </div>
        ))}
      </section>
    </>
  );
}
