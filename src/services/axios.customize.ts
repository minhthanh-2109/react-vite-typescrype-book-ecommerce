import axios from "axios";
import nProgress from "nprogress";
const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});
nProgress.configure({
    showSpinner: false,
    trickleSpeed: 100
})

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    nProgress.start();
    // Do something before the request is sent
    const token = localStorage.getItem("access_token");
    const auth = token ? `Bearer ${token}` : '';
    config.headers['Authorization'] = auth

    return config;
}, function (error) {
    nProgress.done()
    // Do something with the request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    nProgress.done()
    // Any status code that lies within the range of 2xx causes this function to trigger
    // Do something with response data
    if (response && response.data) {
        return response.data;
    }
    return response;
}, function (error) {
    nProgress.done();
    // Any status codes that fall outside the range of 2xx cause this function to trigger
    if (error && error.response && error.response.data) {
        return error.response.data;
    }
    // Do something with response error

    return Promise.reject(error);
});
export default instance;