import { FetchFunc } from '../../types';

type Request = {
  vaccineId: number;
}

type Response = {
  id: number,
  stage: number,
  revaccination: boolean,
}[];

export const GetAvailableStages: FetchFunc<Request, Response> = (client, request) =>
  client.get(`/stage/available?vaccineId=${request.vaccineId}`);
