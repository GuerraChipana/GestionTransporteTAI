import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/auth";

export const Login = async (data) => {
  try {
    const response = await axios.post(API_URL + "/login", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
