import { FetchFunc } from '../../types';

type Response = {
  id: number,
};

export const CreatePatient: FetchFunc<undefined, Response> = (client, request) =>
  client.post('/patient', request);
