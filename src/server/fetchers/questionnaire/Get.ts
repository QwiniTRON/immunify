import { FetchFunc } from '../../types';

type Request = {
  age: number;
  male: 'М' | 'Ж';
}

type Response = {
  questionnaire: Questionnaire,
  professions: Profession[],
  regions: Region[],
};

type Questionnaire = {
  id: number,
  title: string,
  questions: Question[],
}

type Question = {
  id: number,
  text: string,
  answers: Answer[],
};

type Answer = {
  id: number,
  text: string,
};

type Profession = {
  id: number,
  name: string,
}

type Region = {
  id: number,
  name: string,
}

export const GetQuestionnaire: FetchFunc<Request, Response> = (client, request) =>
  client.get(`/questionnaire?age=${request.age}&male=${request.male}`);
