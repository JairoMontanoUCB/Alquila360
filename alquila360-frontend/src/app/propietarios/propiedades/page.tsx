"use client";

import Sidebar from "../../components/sideBarPropietario";

export default function MisPropiedades() {
  const propiedades = [
    {
      img: "/img1.jpg",
      direccion: "Av. Principal 123, Piso 5",
      estado: "Disponible",
      precio: "$1200/mes",
      descripcion: "Moderno departamento de 2 habitaciones con acabados completos."
    },
    {
      img: "/img2.jpg",
      direccion: "Calle Secundaria 456",
      estado: "Ocupada",
      precio: "$2500/mes",
      descripcion: "Casa de lujo con 4 habitaciones, jardín privado y parqueo para 2 vehículos."
    },
    // agrega el resto...
  ];

  const stateColor = (estado: string) => {
    if (estado === "Disponible") return "bg-[#d3f7e8] text-[#1b7c4b]";
    return "bg-[#dbe7ff] text-[#3b5fb4]";
  };

  return (
    <div className="min-h-screen flex bg-[#f3efe3] text-[#1c3c2b]">
      <Sidebar />

      <main className="flex-1 px-10 py-10">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-[32px] font-bold">Mis Propiedades</h2>
            <p className="text-sm text-gray-600">Gestiona todas tus propiedades</p>
          </div>

          <button className="bg-[#f4b000] text-white px-5 py-2 rounded-lg shadow-md hover:bg-[#e0a000] transition">
            Agregar Propiedad
          </button>
        </header>

        {/* TABLA */}
        <div className="bg-white border border-[#cfc7b4] rounded-2xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-[#f7f3e8] text-left text-sm text-gray-700">
              <tr>
                <th className="py-4 px-4">Imagen</th>
                <th className="py-4 px-4">Dirección</th>
                <th className="py-4 px-4">Estado</th>
                <th className="py-4 px-4">Precio</th>
                <th className="py-4 px-4">Descripción</th>
                <th className="py-4 px-4 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {propiedades.map((p, index) => (
                <tr key={index} className="border-t border-[#ded7c7]">
                  <td className="py-3 px-4">
                    <img src={p.img} className="h-16 w-24 rounded-lg object-cover" />
                  </td>

                  <td className="py-3 px-4">{p.direccion}</td>

                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 text-sm rounded-full ${stateColor(p.estado)}`}>
                      {p.estado}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-semibold">{p.precio}</td>

                  <td className="py-3 px-4 text-sm text-gray-700">{p.descripcion}</td>

                  <td className="py-3 px-4 flex gap-2 justify-center">
                    <button className="border border-[#1e4633] rounded-lg p-2 hover:bg-gray-100">
                      ✏️
                    </button>
                    <button className="border border-[#1e4633] rounded-lg p-2 hover:bg-gray-100">
                      👁️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
