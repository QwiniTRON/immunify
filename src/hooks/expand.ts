import React, { useState, useRef, useEffect } from 'react';

export function useExpanded(closeHaight: number): [React.MutableRefObject<any>, Function, boolean, number | string] {
  const [isOpen, setIsOpen] = useState(true);
  const [isInit, setIsInit] = useState(false);
  const contentRef = useRef<any>(null);
  const contentHeight = useRef<number>(0);
  const height = contentHeight.current;

  useEffect(() => {
    contentHeight.current = contentRef?.current?.offsetHeight!;

    setIsOpen(false);
    setIsInit(true);
  }, []);

  const expandHandle = () => {
    setIsOpen((value: boolean) => !value);
  }

  let componentHeight = isInit ? (isOpen ? height : closeHaight) : '';

  return [contentRef, expandHandle, isOpen, componentHeight];
}