import axiosInstance from "@/app/utils/axios.util";

export const loginRequest = async (email, password) => {
  const response = await axiosInstance.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};
