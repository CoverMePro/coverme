import axios, { AxiosError } from 'axios';

/**
 * Creating our instance of axios so we can intercept the request to handle authorization erros
 * If a request receives an unauthorize error (401), redirect them to login.
 */

const instance = axios.create({
    withCredentials: true,
});

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            window.location.href = '/login';
        } else throw error;
    }
);

export default instance;
