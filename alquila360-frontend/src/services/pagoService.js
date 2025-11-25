import axios from "../app/utils/axios.util";

export const getProximoPago = async (contratoId) => {
  const res = await axios.get(`/pagos/proximo/${contratoId}`);
  return res.data;
};

export const pagarCuota = async (pagoId) => {
  const res = await axios.post(`/pagos/pagar/${pagoId}`);
  return res.data;
};
