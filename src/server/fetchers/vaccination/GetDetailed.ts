import { FetchFunc } from '../../types';

type Request = {
  patientId: number,
  vaccineId: number,
}

export type DetailedVaccinationType = {
  name: string,
  detailedShort: string,
  stages: DetailedVaccinationStageType[],
  totalStages:DetailedVaccinationStageTotalType[]
};

type DetailedVaccinationStageType = {
  date: string,
  revaccination: boolean,
  stage: number,
  durationStartInMonths: number,
  durationEndInMonths: number,
};

type DetailedVaccinationStageTotalType = {
  revaccination: boolean,
  stage: number,
};

export const GetDetailedVaccination: FetchFunc<Request, DetailedVaccinationType> = (client, request) =>
  client.get(`/vaccination/detailed?patientId=${request.patientId}&vaccineId=${request.vaccineId}`);
