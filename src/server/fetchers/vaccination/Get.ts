import { FetchFunc } from '../../types';

type Request = {
  patientId: number,
}

export type PatientVaccinations = {
  id: number,
  name: string,
  detailed: string,
  passedStages: {
    revaccination: boolean,
    stage: number,
    date: string,
    durationStartInMonths: number,
    durationEndInMonths: number,
  }[],
  totalStages: number[],
}[];

export const GetVaccinationByPatient: FetchFunc<Request, PatientVaccinations> = (client, request) =>
  client.get(`/vaccination/byPatient?patientId=${request.patientId}`);
