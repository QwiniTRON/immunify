import { FetchFunc } from '../../types';

type PatientVaccinations = {
  id: number,
  name: string,
  diseaseIds: number[],
}[];

export const GetVaccines: FetchFunc<undefined, PatientVaccinations> = (client) =>
  client.get(`/vaccine`);
