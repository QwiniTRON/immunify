import React, { createContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';


type LastPathProviderProps = {
  pathDictionary: { [p: string]: string }
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
  const value: LastPathContext = {
    lastPath: lastPath.current,
    lastPathText: pathDictionary[lastPath.current]
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