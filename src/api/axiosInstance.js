import axios from "axios";

// Create an axios instance with default configurations
const axiosInstance = axios.create({
  // baseURL:
  //   "https://lost-and-found-cqade7hfbjgvcbdq.centralus-01.azurewebsites.net/api",
  baseURL: "https://localhost:44306/api",
  // timeout: 15000,
  // // withCredentials: true, // Allow sending cookies with requests
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => {
    sessionStorage.removeItem("requiredSignIn");
    return response;
  },
  (error) => {
    // Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");

      sessionStorage.setItem(
        "requiredSignIn",
        "You have to sign in to do this action",
      );

      window.location.href = "/authentication";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
