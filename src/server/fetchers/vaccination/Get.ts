import { FetchFunc } from '../../types';

type Request = {
  patientId: number,
}

export type PatientVaccinations = {
  id: number,
  name: string,
  detailed: string,
  passedStages: {
    stage: number,
    date: string,
    durationBeforeNextInMonths: number,
  }[],
  totalStages: number[],
}[];

export const GetVaccinationByPatient: FetchFunc<Request, PatientVaccinations> = (client, request) =>
  client.get(`/vaccination/byPatient?patientId=${request.patientId}`);
