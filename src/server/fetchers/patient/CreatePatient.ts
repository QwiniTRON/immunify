import { FetchFunc } from '../../types';

type Response = {
  id: number,
};

export const CreateFeedback: FetchFunc<undefined, Response> = (client) =>
  client.post('/patient');
