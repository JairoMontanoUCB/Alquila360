import axios from "../app/utils/axios.util";

export const getExpensasPendientes = async (userId) => {
  const res = await axios.get(`/expensas/pendientes/${userId}`);
  return res.data;
};
