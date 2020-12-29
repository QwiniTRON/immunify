import { FetchFunc } from '../../types';

type Request = {
  username: string,
  password: string,
}

type Response = {
  token: string,
};

export const Register: FetchFunc<Request, Response> = (client, request) =>
  client.post('/account/register', request);