import { useState, useRef } from 'react';

import { StorageReturnType, StorageAnswer, FetchFunc } from '../server/types';
import { AxiosFetcher } from '../server';

import { useAccessToken } from './';

type Reload = {
  reload: () => void;
};

const initialState = {
  succeeded: false,
  errorMessage: '',
  data: undefined as any,
};

/**
 *
 * @param fetchFunction - function to be fetched. Import from storage folder.
 *
 * @returns
 *
 * reload - set hook to initial state.
 *
 * fetch - fetch function.
 *
 * state - state of answer.
 *
 * cancel - cancel request if it was send.
 *
 * @example
 * const storage = useStorage(someFetchFunc);
 *
 * useEffect(() => {
 *  storage.fetch(request);
 *
 *  return storage.cancel;
 * }, []);
 *
 * const loading = storage.state.fetching;
 * const success = !loading && storage.state.answer.succeeded;
 *
 * if (success) {
 *  // do some stuff
 *  storage.reload();
 * }
 */

export function useServer<TRequest, TData>
  (
    fetchFunction: FetchFunc<TRequest, TData>,
): StorageReturnType<TRequest, TData> & Reload  {
  const [fetching, setFetching] = useState(false);
  const [answer, setAnswer] = useState<StorageAnswer<TData>>(initialState);
  const [isFetched, setIsFatched] = useState(false);

  const { token, set: setToken } = useAccessToken();
  let { current } = useRef(new AxiosFetcher(fetchFunction, token));

  const fetch = (request: TRequest) => {
    reload();
    setFetching(true);

    current
      .Fetch(request)
      .then((result) => {
        setFetching(false);
        setAnswer(result);
        setIsFatched(true);
      });
  };

  const reload = () => {
    setAnswer(initialState);
    setIsFatched(false);
    current = new AxiosFetcher(fetchFunction, token);
  };

  return {
    state: {
      answer,
      fetching,
    },
    fetch,
    cancel: current.Cancel.bind(current),
    reload,
    isFetched
  };
};
