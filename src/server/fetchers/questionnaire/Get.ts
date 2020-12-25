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

export type Questionnaire = {
  id: number,
  title: string,
  questions: Question[],
}

export type Question = {
  id: number,
  text: string,
  answers: Answer[],
};

export type Answer = {
  id: number,
  text: string,
};

export type Profession = {
  id: number,
  name: string,
}

export type Region = {
  id: number,
  name: string,
}

export const GetQuestionnaire: FetchFunc<Request, Response> = (client, request) =>
  client.get(`/questionnaire?age=${request.age}&male=${request.male}`);
