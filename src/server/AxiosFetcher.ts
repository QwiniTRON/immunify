import { AxiosInstance, Canceler } from 'axios';

import { CreateHttpClient } from '../axios/CreateHttpClient';
import { StorageAnswer, FetchFunc } from './types';

export class AxiosFetcher<TRequest, TData> {
  protected httpClient: AxiosInstance;

  private canceller: Canceler | undefined;

  constructor(fetchFunc: FetchFunc<TRequest, TData>, auth: string) {
    const client = CreateHttpClient(auth);

    this.httpClient = client.httpClient;
    this.canceller = client.canceler;

    this.Fetch = async (request: TRequest): Promise<StorageAnswer<TData>> => {
      return (await fetchFunc(this.httpClient, request)).data;
    };
  }

  Fetch: (request: TRequest) => Promise<StorageAnswer<TData>>;

  Cancel(): void {
    if (this.canceller !== undefined) {
      this.canceller();
    }
  }
}
