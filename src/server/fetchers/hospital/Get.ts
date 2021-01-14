import { FetchFunc } from '../../types';

export type Clinic = {
  id: number,
  name: string,
  latitude: string,
  longitude: string,
  address: string,
}

type Response = Clinic[];



export const GetHospitals: FetchFunc<undefined, Response> = (client) =>
  client.get(`/hospital`);
