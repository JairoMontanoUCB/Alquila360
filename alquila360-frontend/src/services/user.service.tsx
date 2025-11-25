import axiosInstance from "../app/utils/axios.util";

export const getUsers = async () => {
    const response = await axiosInstance.get('/user');
    return response.data;
};
