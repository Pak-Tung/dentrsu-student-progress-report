import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: "https://dentrsuconnect.synology.me:3001",//"http://localhost:3001", //"https://dentrsuconnect.synology.me:5002",//"http://192.168.1.100:5002",//"https://dentrsuconnect.synology.me:5002",//"https://dentrsuconnect.synology.me:5443",// "https://dentrsuconnect.synology.me:5443",// ,
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Token expired or invalid');
      // Optionally, redirect to login or refresh token here
    }
    return Promise.reject(error);
  }
);

export default apiClient;
