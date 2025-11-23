import axiosInstance from "@/app/utils/axios.util";

export const loginRequest = async (email, password) => {
  const res = await axiosInstance.post("/auth/login", {
    email,
    password,
  });

  return res.data;
};
