import { FetchFunc } from '../../types';

type Request = {
  text: string;
  userName: string;
  userEmail: string;
  phone: string;
};

export const CreateFeedback: FetchFunc<Request> = (client, request) =>
  client.post('/feedback/create', request);
