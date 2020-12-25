import { FetchFunc } from '../../types';

type PatientVaccinations = {
  id: number,
  name: string,
}[];

export const GetVaccines: FetchFunc<undefined, PatientVaccinations> = (client) =>
  client.get(`/vaccination`);
