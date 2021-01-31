import { FetchFunc } from '../../types';

type Request = {
  NewPersonalityState: string
}

export const UpdatePersonality: FetchFunc<Request, {}> = (client, request) =>
  client.post('/user/personality', request);