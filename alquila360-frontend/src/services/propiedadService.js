import axiosInstance from "@/app/utils/axios.util";

export const getMisPropiedades = async (usuarioId) => {
  const res = await axiosInstance.get(`/propiedad/mis-propiedades/${usuarioId}`);
  return res.data;
};
