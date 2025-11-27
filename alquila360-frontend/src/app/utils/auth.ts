export function getUsuarioActual() {
  try {
    const userStr = localStorage.getItem("user");
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (!userStr || !role || !token) return null;

    const user = JSON.parse(userStr);

    return {
      ...user,
      role,
      token,
    };
  } catch (e) {
    console.error("Error leyendo usuario:", e);
    return null;
  }
}
