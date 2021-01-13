import { FetchFunc } from '../../types';

type Response = {
  id: number,
  name: string,
}[];

export const GetDiseases: FetchFunc<undefined, Response> = (client) =>
  client.get('/disease');
