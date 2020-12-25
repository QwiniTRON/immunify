import { FetchFunc } from '../../types';

type Request = {
  date: Date,
  hospitalId: number,
  patientId: number,
}

type Response = {
  id: number,
};

export const CreateVisit: FetchFunc<Request, Response> = (client, request) =>
  client.post('/visit', request);
