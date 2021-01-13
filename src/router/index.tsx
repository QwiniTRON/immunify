import React, { useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { LastPathProvider, LastPathContext, lastPathContext } from './LastPathProvider';
import { pathDictionary } from './pathConfig';


export const AppRouter: React.FC = ({ children }) => {
  return (
    <BrowserRouter>
      <LastPathProvider pathDictionary={pathDictionary}>
        {children}
      </LastPathProvider>
    </BrowserRouter>
  );
}


export const useLastPath = () => {
  const lastPath: LastPathContext = useContext(lastPathContext);

  return lastPath;
}