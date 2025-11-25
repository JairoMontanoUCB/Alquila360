import axiosInstance from "@/app/utils/axios.util";

// Obtener tickets
export const getTicketsUsuario = async (userId) => {
  const res = await axiosInstance.get(`/tickets/usuario/${userId}`);
  return res.data;
};

// Crear ticket con imágenes
export const crearTicket = async (formData) => {
  const res = await axiosInstance.post("/ticket/crear", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};
