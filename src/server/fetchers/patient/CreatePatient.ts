import { FetchFunc } from '../../types';

type Response = {
  id: number,
};

type Request = {
  SavePersonality?: boolean
}

export const CreatePatient: FetchFunc<Request, Response> = (client, request) =>
  client.post('/patient', request);
