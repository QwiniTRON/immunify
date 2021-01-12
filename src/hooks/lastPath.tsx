import React, { useContext } from 'react';

import { lastPathContext, LastPathContext } from '../components/LastPathProvider/index';

export const useLastPath = () => {
  const lastPath: LastPathContext = useContext(lastPathContext);

  return lastPath;
}