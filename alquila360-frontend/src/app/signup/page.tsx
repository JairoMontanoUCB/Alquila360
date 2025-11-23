"use client";

import { useState } from "react";
import Image from "next/image";

export default function Signup() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userType, setUserType] = useState<string>("usuario");
  const [error, setError] = useState<string | null>(null);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !userType) {
      setError("Todos los campos son requeridos.");
      return;
    }

    console.log({ name, email, password, userType });
    setError(null);
    alert("Cuenta creada exitosamente!");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* IZQUIERDA — Imagen + texto */}
      <div className="relative hidden md:flex items-center justify-center bg-green-900/50">
        <Image
          src="/signup.png"
          alt="Fondo Signup"
          fill
          priority
          className="object-cover opacity-60"
        />

        <div className="absolute z-10 text-white px-10">
          <h1 className="text-4xl font-bold mb-4">
            Tu cuenta, tu espacio,<br />tu control
          </h1>
          <p className="text-lg">
            Crea tu cuenta y lleva la gestión de tus alquileres
            al siguiente nivel.
          </p>
        </div>
      </div>

      {/* DERECHA — Formulario */}
      <div className="flex items-center justify-center bg-[#f8f7f2] p-10">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-green-900 mb-2">
            Regístrate
          </h2>
          <p className="text-gray-700 mb-6">
            ¿Ya tienes una cuenta?{" "}
            <a href="/login" className="font-semibold underline">
              Inicia sesión.
            </a>
          </p>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <form onSubmit={handleSignup} className="space-y-5">

            {/* Nombre */}
            <div>
              <label className="block text-lg font-medium text-green-900 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                placeholder="Tu nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-green-900/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 text-gray-900 bg-white"
              />
            </div>

            {/* Correo */}
            <div>
              <label className="block text-lg font-medium text-green-900 mb-1">
                Ingresa tu correo
              </label>
              <input
                type="email"
                placeholder="tucorreo@electronico.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-green-900/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 text-gray-900 bg-white"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-lg font-medium text-green-900 mb-1">
                Crea una contraseña
              </label>
              <input
                type="password"
                placeholder="tucontraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-green-900/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 text-gray-900 bg-white"
              />
            </div>

            {/* Rol / Tipo de usuario */}
            <div>
              <label className="block text-lg font-medium text-green-900 mb-1">
                Selecciona un rol
              </label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full px-4 py-3 border border-green-900/40 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-700 text-gray-900"
              >
                <option value="">Selecciona un rol</option>
                <option value="usuario">Usuario</option>
                <option value="propietario">Propietario</option>
              </select>
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-xl text-xl font-semibold hover:bg-green-800 transition"
            >
              Registrar
            </button>
          </form>

          <p className="mt-4 text-gray-700 text-center">
            ¿Ya tienes una cuenta?{" "}
            <a href="/login" className="font-semibold text-green-900 underline">
              Inicia sesión.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
