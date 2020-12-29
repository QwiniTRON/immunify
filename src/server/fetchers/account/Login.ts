import { FetchFunc } from '../../types';

type Request = {
  username: string,
  password: string,
}

type Response = {
  token: string,
};

export const Login: FetchFunc<Request, Response> = (client, request) =>
  client.post('/account/login', request);
