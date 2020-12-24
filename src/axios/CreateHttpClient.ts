import axios, { AxiosInstance, Canceler } from 'axios';

type ReturnType = {
  httpClient: AxiosInstance;
  canceler: Canceler | undefined;
};

export function CreateHttpClient(): ReturnType {
  let canceler: Canceler | undefined;

  const cancellation = new axios.CancelToken((c: any) => {
    canceler = c;
  });

  const httpClient = axios.create({
    baseURL: process.env.REACT_APP_API_VERSION,
    cancelToken: cancellation,
    withCredentials: true
  });

  return {
    httpClient,
    canceler,
  };
}
