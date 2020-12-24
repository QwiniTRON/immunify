import { FetchFunc } from '../../types';
import { RiskViewModel } from '../poll/GetLast';

type Request = {
  answerIds: number[],
  questionnaireId: number,
  patientId: number,
  professionId: number,
  regionId: number,
}

export const CalculateRisk: FetchFunc<Request, RiskViewModel> = (client, request) =>
  client.post('/risk/calculate', request);
