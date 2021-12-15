import axios, { AxiosError } from 'axios';

const instance = axios.create({
	withCredentials: true
});

instance.interceptors.response.use(
	response => {
		return response;
	},
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			window.location.href = '/login';
		}
	}
);

export default instance;
