import React, { createContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {IPathDictionary} from './appRouter';


type LastPathProviderProps = {
  pathDictionary: IPathDictionary
}


export type LastPathContext = {
  lastPath: string
  lastPathText?: string
}


export const lastPathContext = createContext<LastPathContext>({ lastPath: "" });


export const LastPathProvider: React.FC<LastPathProviderProps> = ({
  children,
  pathDictionary
}) => {
  const locationData = useLocation();
  const lastPath = useRef<string>("");

  const currentPath = locationData.pathname;
  const foundRoute = pathDictionary.findRoute(lastPath.current);

  const value: LastPathContext = {
    lastPath: lastPath.current,
    lastPathText: foundRoute?.text
  };

  lastPath.current = currentPath;

  return (
    <lastPathContext.Provider value={value}>
      {
        children
      }
    </lastPathContext.Provider>
  )
};