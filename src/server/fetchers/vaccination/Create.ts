import { FetchFunc } from '../../types';

type Request = {
  patientId: number,
  stageId: number,
  date: Date,
  hospitalVisitId?: number,
}

export const CreateVaccination: FetchFunc<Request> = (client, request) =>
  client.post('/vaccination', {
    ...request,
    date: request.date.toISOString(),
  });
