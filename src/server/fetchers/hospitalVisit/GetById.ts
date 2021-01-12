import { FetchFunc } from '../../types';

type Request = {
  visitId: number;
}

type Response = {
  id: number,
  date: string,
  hospital: {
    id: number,
    name: string,
  }
};

export const GetVisitById: FetchFunc<Request, Response> = (client, request) =>
  client.get(`/visit/${request.visitId}`);
