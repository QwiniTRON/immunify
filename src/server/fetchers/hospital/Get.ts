import { FetchFunc } from '../../types';

<<<<<<< HEAD
export type Clinic = {
=======
export type HospitalResponse = {
>>>>>>> ff348a4806408719f41fe806b81e15efc3e62d3b
  id: number,
  name: string,
  latitude: string,
  longitude: string,
}

type Response = Clinic[];



export const GetHospitals: FetchFunc<undefined, HospitalResponse> = (client) =>
  client.get(`/hospital`);
