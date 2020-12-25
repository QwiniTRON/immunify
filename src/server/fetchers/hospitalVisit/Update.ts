import { FetchFunc } from '../../types';

type Request = {
  visitId: number,
  date: Date,
};

export const UpdateVisit: FetchFunc<Request> = (client, request) =>
  client.patch('/visit', {
    ...request,
    date: request.date.toISOString(),
  });
