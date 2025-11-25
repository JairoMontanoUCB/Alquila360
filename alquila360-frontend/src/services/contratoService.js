import axios from "../app/utils/axios.util";

export const getContratoActual = async (userId) => {
  const res = await axios.get(`/contrato/actual/${userId}`);
  return res.data;
};
