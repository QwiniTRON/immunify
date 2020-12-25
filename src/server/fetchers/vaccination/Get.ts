import { FetchFunc } from '../../types';

type Request = {
  patientId: number,
}

type Response = {
  id: number,
  name: string,
  passedStages: {
    stage: number,
    date: string,
    durationBeforeNextInMonth: number,
  }[],
  totalStages: number[],
}[];

export const GetVaccinationByPatient: FetchFunc<Request, Response> = (client, request) =>
  client.get(`/vaccination/byPatient?patientId=${request.patientId}`);
