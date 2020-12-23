import { AxiosInstance, AxiosResponse } from 'axios';

export type StorageReturnType<TRequest, TData> = {
  state: {
    fetching: boolean;
    answer: StorageAnswer<TData | undefined>;
  };
  fetch: (request: TRequest) => void;
  cancel: () => void;
};

export type FetchFunc<TRequest = undefined, TData = undefined> = (
  httpClient: AxiosInstance,
  request: TRequest,
) => Promise<AxiosResponse<StorageAnswer<TData>>>;

export type StorageAnswer<TData> = {
  succeeded: boolean;
  errorMessage: string;
  data: TData;
};
