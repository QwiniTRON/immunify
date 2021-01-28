import { FetchFunc } from '../../types';

type Request = {
  id: number,
}

type Vaccines = {
  id: number
  name: string
  detailedShort: string
  detailedFull: string
  diseaseIds: number[]
};

export const GetVaccineById: FetchFunc<Request, Vaccines> = (client, request) =>
  client.get(`/vaccine/${request.id}`);
