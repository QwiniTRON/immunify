import { FetchFunc } from '../../types';

type Response = {
  id: number,
  name: string,
}[];

export const GetHospitals: FetchFunc<undefined, Response> = (client) =>
  client.get(`/hospital`);
