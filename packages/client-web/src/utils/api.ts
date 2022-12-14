import axios from "./axios-intance";
import { AxiosError } from "axios";

const get = (path: string): Promise<void> => {
  return axios
    .get(`${process.env.REACT_APP_SERVER_API}/${path}`)
    .then(() => {
      return;
    })
    .catch((error: AxiosError) => {
      throw new Error(error.message);
    });
};

const getData = <T>(path: string): Promise<T> => {
  return axios
    .get<T>(`${process.env.REACT_APP_SERVER_API}/${path}`)
    .then((result) => {
      return result.data;
    })
    .catch((error: AxiosError) => {
      throw new Error(error.message);
    });
};

const getAllData = <T>(path: string): Promise<T[]> => {
  return axios
    .get<T[]>(`${process.env.REACT_APP_SERVER_API}/${path}`)
    .then((result) => {
      return result.data;
    })
    .catch((error: AxiosError) => {
      throw new Error(error.message);
    });
};

const getGenericData = (path: string): Promise<any> => {
  return axios
    .get(`${process.env.REACT_APP_SERVER_API}/${path}`)
    .then((result) => {
      return result.data;
    })
    .catch((error: AxiosError) => {
      throw new Error(error.message);
    });
};

const post = (path: string, data: any): Promise<void> => {
  return axios
    .post(`${process.env.REACT_APP_SERVER_API}/${path}`, data)
    .then(() => {
      return;
    })
    .catch((error: AxiosError) => {
      throw new Error(error.message);
    });
};

const postCreateData = <T>(path: string, data: T): Promise<T> => {
  return axios
    .post<T>(`${process.env.REACT_APP_SERVER_API}/${path}`, data)
    .then((result) => {
      return result.data;
    })
    .catch((error: AxiosError) => {
      throw new Error(error.message);
    });
};

const postGetData = (path: string, data: any): Promise<any> => {
  return axios
    .post(`${process.env.REACT_APP_SERVER_API}/${path}`, data)
    .then((result) => {
      return result.data;
    })
    .catch((error: AxiosError) => {
      throw new Error(error.message);
    });
};

export default {
  get,
  getData,
  getAllData,
  getGenericData,
  post,
  postCreateData,
  postGetData,
};
