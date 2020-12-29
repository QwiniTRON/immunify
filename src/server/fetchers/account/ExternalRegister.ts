import { FetchFunc } from '../../types';
import { ExternalAuth } from './ExternalLogin';

type Request = {
  username: string,
  password: string,
  externalAuth: ExternalAuth,
  identity: string,
}

type Response = {
  token: string,
};

export const ExternalRegister: FetchFunc<Request, Response> = (client, request) =>
  client.post('/account/external/register', request);