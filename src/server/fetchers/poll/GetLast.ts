import { FetchFunc } from '../../types';

type Request = {
  patientId: number;
  professionId: number;
  regionId: number;
}

export enum RiskStage {
  Low = 1,
  Medium = 2,
  High = 3,
}

export enum RiskCoefficient {
  None = 0,
  Low = 1,
  High = 2
}

export type RiskViewModel = {
  diseaseId: number,
  disease: string,
  risk: RiskStage,
  regionRisk: RiskCoefficient,
  professionRisk: RiskCoefficient,
};

export const GetLastPoll: FetchFunc<Request, RiskViewModel[]> = (client, request) =>
  client.get(`/poll/last?patientId=${request.patientId}&professionId=${request.professionId}&regionId=${request.regionId}`);
