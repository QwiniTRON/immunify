import { FetchFunc } from '../../types';

type Request = {
  patientId: number;
}

type Response = {
  id: number,
  data: string,
  hospital: {
    id: number,
    name: string,
  }
};

export const GetHospitalByPatient: FetchFunc<Request, Response> = (client, request) =>
  client.get(`/visit/byPatient?patientId=${request.patientId}`);
