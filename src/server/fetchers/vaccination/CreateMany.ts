import { FetchFunc } from '../../types';

type Request = {
  patientId: number,
  hospitalVisitId: number,
  stagesIds: number[],
}

export const CreateManyVaccination: FetchFunc<Request> = (client, request) =>
  client.post('/vaccination/many', request);
