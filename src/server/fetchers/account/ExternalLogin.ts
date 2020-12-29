import { FetchFunc } from '../../types';

type Request = {
  externalAuth: ExternalAuth,
  identity: string,
}

export enum ExternalAuth {
  Google = 0,
  VK = 1,
  Facebook = 2,
}

type Response = {
  token: string,
};

export const ExternalLogin: FetchFunc<Request, Response> = (client, request) =>
  client.post('/account/external/login', request);