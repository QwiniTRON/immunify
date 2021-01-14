import { FetchFunc } from '../../types';

export type HospitalResponse = {
  id: number,
  name: string,
  latitude: string,
  longitude: string,
}[];

export const GetHospitals: FetchFunc<undefined, HospitalResponse> = (client) =>
  client.get(`/hospital`);
