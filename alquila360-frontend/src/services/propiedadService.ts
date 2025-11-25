import axios from "@/app/utils/axios.util";

export const getPropiedadesDeInquilino = async (userId: number) => {
  const res = await axios.get(`/propiedad/inquilino/${userId}`);
  return res.data;
};
