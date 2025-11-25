import axios from "../app/utils/axios.util";

export const getContratoActual = async (userId: number) => {
  try {
    const res = await axios.get(`/contrato/actual/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Error obteniendo contrato actual:", error);
    throw error;
  }
};
