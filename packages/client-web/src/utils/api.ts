import axiosInstance from './axios-intance';
import axios from 'axios';
import { AxiosError } from 'axios';
import { IAuthInfo } from 'coverme-shared';

const get = (path: string): Promise<void> => {
	return axiosInstance
		.get(`${process.env.REACT_APP_SERVER_API}/${path}`)
		.then(() => {
			return;
		})
		.catch((error: AxiosError) => {
			throw new Error(error.message);
		});
};

const getData = <T>(path: string): Promise<T> => {
	return axiosInstance
		.get<T>(`${process.env.REACT_APP_SERVER_API}/${path}`)
		.then((result) => {
			return result.data;
		})
		.catch((error: AxiosError) => {
			throw new Error(error.message);
		});
};

const getAllData = <T>(path: string): Promise<T[]> => {
	return axiosInstance
		.get<T[]>(`${process.env.REACT_APP_SERVER_API}/${path}`)
		.then((result) => {
			return result.data;
		})
		.catch((error: AxiosError) => {
			throw new Error(error.message);
		});
};

const getGenericData = (path: string): Promise<any> => {
	return axiosInstance
		.get(`${process.env.REACT_APP_SERVER_API}/${path}`)
		.then((result) => {
			return result.data;
		})
		.catch((error: AxiosError) => {
			throw new Error(error.message);
		});
};

const post = (path: string, data: any): Promise<void> => {
	return axiosInstance
		.post(`${process.env.REACT_APP_SERVER_API}/${path}`, data)
		.then(() => {
			return;
		})
		.catch((error: AxiosError) => {
			throw new Error(error.message);
		});
};

const postCreateData = <T>(path: string, data: any): Promise<T> => {
	return axiosInstance
		.post<T>(`${process.env.REACT_APP_SERVER_API}/${path}`, data)
		.then((result) => {
			return result.data;
		})
		.catch((error: AxiosError) => {
			throw new Error(error.message);
		});
};

const postGetData = (path: string, data: any): Promise<any> => {
	return axiosInstance
		.post(`${process.env.REACT_APP_SERVER_API}/${path}`, data)
		.then((result) => {
			return result.data;
		})
		.catch((error: AxiosError) => {
			throw new Error(error.message);
		});
};

const postGetAllData = <T>(path: string, data: any): Promise<T[]> => {
	return axiosInstance
		.post<T[]>(`${process.env.REACT_APP_SERVER_API}/${path}`, data)
		.then((result) => {
			return result.data;
		})
		.catch((error: AxiosError) => {
			throw new Error(error.message);
		});
};

const authLogin = (email: string, password: string): Promise<IAuthInfo> => {
	return axios
		.post<IAuthInfo>(
			`${process.env.REACT_APP_SERVER_API}/auth/signin`,
			{
				email,
				password,
			},
			{ withCredentials: true }
		)
		.then((result) => {
			return result.data;
		})
		.catch((error: AxiosError) => {
			throw error;
		});
};

const authCheck = (): Promise<IAuthInfo> => {
	return axios
		.get<IAuthInfo>(`${process.env.REACT_APP_SERVER_API}/auth`, { withCredentials: true })
		.then((result) => {
			return result.data;
		})
		.catch((error: AxiosError) => {
			throw new Error(error.message);
		});
};

const api = {
	get,
	getData,
	getAllData,
	getGenericData,
	post,
	postCreateData,
	postGetData,
	postGetAllData,
	authLogin,
	authCheck,
};

export default api;
