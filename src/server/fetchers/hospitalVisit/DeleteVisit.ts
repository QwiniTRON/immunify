import { FetchFunc } from '../../types';

type Request = {
  id: number
}

export const DeleteVisit: FetchFunc<Request> = (client, request) =>
  client.delete(`/visit/${request.id}`);
