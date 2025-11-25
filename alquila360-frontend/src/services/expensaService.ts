import axios from "@/app/utils/axios.util";

export const getExpensasPendientes = async (userId: number) => {
  const res = await axios.get(`/expensa/pendientes/${userId}`);
  return res.data;
};
