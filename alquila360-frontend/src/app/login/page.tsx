"use client";
import { loginRequest } from "@/services/authService.js";

import { useState } from "react";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !password) {
    setError("Todos los campos son obligatorios.");
    return;
  }

  try {
    const data = await loginRequest(email, password);
    console.log("LOGIN OK:", data);

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("role", data.usuario.rol);
    localStorage.setItem("userId", data.usuario.id);
const role = data.usuario.rol;

    if (role === "administrador") window.location.href = "/administrador";
if (role === "propietario") window.location.href = "/propietarios";
if (role === "inquilino") window.location.href = "/inquilino";

    if (role === "tecnico") window.location.href = "/tecnicos";

    //window.location.href = "/inquilino";

  } catch (err) {
    console.error(err);
    setError("Correo o contraseña incorrectos.");
  }
};

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* IZQUIERDA — Imagen + Texto */}
      <div className="relative hidden md:flex items-center justify-center bg-green-900/50">
        <Image
          src="/login.png"  
          alt="Fondo Login"
          fill
          priority
          className="object-cover opacity-60"
        />

        <div className="absolute z-10 text-white px-10">
          <h1 className="text-4xl font-bold mb-4">¡Hola otra vez!</h1>
          <p className="text-lg mb-4">
            Entra a tu cuenta y continúa donde lo dejaste.
          </p>
          <p className="text-lg">
            Gestionar tus alquileres nunca fue tan fácil.
          </p>
        </div>
      </div>

      {/* DERECHA — Formulario */}
      <div className="flex items-center justify-center bg-[#f8f7f2] p-10">
        <div className="w-full max-w-md">

          <h2 className="text-3xl font-bold text-green-900 mb-2">
            Ingresa a tu cuenta
          </h2>
          <p className="text-gray-700 mb-6">
            Inicia sesión con tu cuenta de{" "}
            <span className="font-semibold">Alquila360</span>
          </p>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-lg font-medium text-green-900 mb-1">
                Correo electrónico
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
                Contraseña
              </label>
              <input
                type="password"
                placeholder="tucontraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-green-900/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 text-gray-900 bg-white"
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-xl text-xl font-semibold hover:bg-green-800 transition"
            >
              Inicia sesión
            </button>
          </form>

          {/* Registro */}
          <p className="mt-4 text-gray-700 text-center">
            ¿No tienes una cuenta?{" "}
            <a href="/signup" className="font-bold text-green-900 underline">
              Regístrate.
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}
