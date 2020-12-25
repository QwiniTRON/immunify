import { FetchFunc } from '../../types';

type Request = {
  id: number,
}

type Response = {
  id: number,
  name: string,
}[];

export const GetDetailedHospital: FetchFunc<Request, Response> = (client, request) =>
  client.get(`/hospital/` + request.id);
