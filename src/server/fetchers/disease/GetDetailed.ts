import { FetchFunc } from '../../types';

type Request = {
  diseaseId: number;
}

type Response = {
  id: number,
  name: string,
  detailedShort: string,
  detailedFull: string,
  vaccines: Vaccine[],
};

export type Vaccine = {
  id: number,
  name: string,
  detailedShort: string,
  detailedFull: string,
};

export const GetDetailedDisease: FetchFunc<Request, Response> = (client, request) =>
  client.get('/disease/detailed?diseaseId=' + request.diseaseId);
