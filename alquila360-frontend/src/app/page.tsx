import Image from "next/image";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO NUEVO */}
      <section className="w-full bg-white py-16 px-6 md:px-20 flex flex-col md:flex-row items-center gap-10">
        {/* Imagen */}
        <div className="w-full md:w-1/2">
          <Image
            src="/hero.png"
            alt="Foto sala"
            width={600}
            height={400}
            className="rounded-xl object-cover"
          />
        </div>

        {/* Texto */}
        <div className="w-full md:w-1/2 text-gray-800">
          <p className="text-lg leading-relaxed">
            Con ALQUILA 360 podras administrar tus propiedades de forma facil, rapida y segura.
            <br /><br />
            Registra contratos digitales, genera cuotas automaticas, controla pagos y
            mantenimientos, y accede a reportes financieros en tiempo real.
            <br /><br />
            Todo lo que necesitas para gestionar tus alquileres, en una sola plataforma.
          </p>
        </div>
      </section>

      {/* TITULO SECCION */}
      <div className="text-center mt-10">
        <h2 className="text-3xl font-semibold text-gray-800">
          ¿Que podemos hacer por ti?
        </h2>
      </div>

      {/* TARJETAS */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-6 md:px-20 py-12">

        {/* Tarjeta 1 */}
        <div className="relative h-48 rounded-xl overflow-hidden shadow-md cursor-pointer">
          <Image
            src="/card1.png"
            fill
            alt="propiedad"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-green-800/60" />
          <h3 className="absolute inset-0 flex items-center justify-center text-center text-white text-xl font-semibold px-4">
            ¿Tienes una propiedad y deseas alquilarla?
          </h3>
        </div>

        {/* Tarjeta 2 */}
        <div className="relative h-48 rounded-xl overflow-hidden shadow-md cursor-pointer">
          <Image
            src="/card2.png"
            fill
            alt="alquila"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-yellow-600/50" />
          <h3 className="absolute inset-0 flex items-center justify-center text-center text-white text-xl font-semibold px-4">
            Busca, alquila y vive sin complicaciones
          </h3>
        </div>

        {/* Tarjeta 3 */}
        <div className="relative h-48 rounded-xl overflow-hidden shadow-md cursor-pointer">
          <Image
            src="/card3.png"
            fill
            alt="equipo"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-orange-500/50" />
          <h3 className="absolute inset-0 flex items-center justify-center text-center text-white text-xl font-semibold px-4">
            Se parte del equipo que soluciona
          </h3>
        </div>
      </section>

      {/* SECCION DE PROPIEDADES */}
      <section className="py-20 bg-white px-6 md:px-20">
        {/* Título */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-semibold text-gray-900">
            Explora propiedades disponibles y administra tus alquileres con facilidad
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            Alquila360 reune todo lo que necesitas para alquilar, administrar y vivir tranquilo
          </p>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border rounded-xl shadow-sm hover:shadow-lg transition bg-white overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-green-800 flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Mariana</h4>
                  <p className="text-xs text-gray-500">mariana@propietario.com</p>
                </div>
                <div className="ml-auto text-gray-400 cursor-pointer text-xl">⋮</div>
              </div>

              {/* Imagen */}
              <div className="w-full h-48 relative">
                <Image
                  src="/propiedad.png"
                  alt="Propiedad"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Contenido */}
              <div className="p-4">
                <h3 className="font-medium text-lg text-gray-800">
                  Departamento acogedor
                </h3>
                <p className="text-sm text-gray-500">Av. Direccion 1</p>

                <p className="text-sm text-gray-500 mt-2">
                  Departamento minimalista de 2 habitaciones ubicado en Av. Direccion 1
                </p>

                {/* Botones */}
                <div className="flex gap-3 mt-4">
                  <button className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition">
                    Reserva
                  </button>
                  <button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition">
                    Contacto
                  </button>
                </div>
              </div>
            </div>
          ))}

        </div>
      </section>
    </>
  );
}

