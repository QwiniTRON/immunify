import { FetchFunc } from '../../types';

type Response = {
  id: number,
  name: string,
  latitude: string,
  longitude: string,
}[];

export const GetHospitals: FetchFunc<undefined, Response> = (client) =>
  client.get(`/hospital`);
