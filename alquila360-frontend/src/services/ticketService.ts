import axios from "@/app/utils/axios.util";

export const getTicketsUsuario = async (userId: number) => {
  const res = await axios.get(`/ticket/usuario/${userId}`);
  return res.data;
};

export const getTicketsAll = async () => {
  const res = await axios.get(`/ticket`);
  return res.data;
};

export const crearTicket = async (formData: FormData) => {
  const res = await axios.post("/ticket/crear", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

export const editarTicket = async (id: number, data: any) => {
  const res = await axios.patch(`/ticket/${id}`, data);
  return res.data;
};

export const cambiarEstado = async (id: number, estado: string) => {
  return axios.patch(`/ticket/${id}/estado`, { estado });
};

export const cambiarPrioridad = async (id: number, prioridad: string) => {
  return axios.patch(`/ticket/${id}/prioridad`, { prioridad });
};
