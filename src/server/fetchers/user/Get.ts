import { FetchFunc } from '../../types';

type Request = {}

type Response = string

export const GetPersonality: FetchFunc<Request, Response> = (client, request) =>
  client.get('/user/personality', request);