import { FetchFunc } from '../../types';

type PatientVaccinations = {
  id: number,
  name: string,
  detailedShort: string,
  detailedFull: string,
}[];

export const GetVaccines: FetchFunc<undefined, PatientVaccinations> = (client) =>
  client.get(`/vaccine`);
