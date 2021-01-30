import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAccessToken } from '../hooks';
import { appDataInit } from '../store/appData/action';
import { userInit } from '../store/user/action';


export function useA2hsLogick() {
  const [a2hsBunner, seta2hsBunner] = useState(false);
  const a2hsPrompt = useRef<Event | null>();

  // отлов a2hs
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();

      if(!Boolean(a2hsPrompt.current)) seta2hsBunner(true);
      
      a2hsPrompt.current = e;
    });


    console.log("%c Immunify", "font-size: 36px;font-family: 'Courier New', Courier, monospace;font-weight: bold;color: #9BC83F;background-color: #fff;padding: 5px 20px;");
    console.log("%c Рады помочь", "font-size: 18px;font-family: 'Courier New', Courier, monospace;font-weight: bold;color: #fff;background-color: #9BC83F;padding: 5px 20px;");
  }, []);

  // согласие на добавление
  const a2hsAgree = () => {
    (a2hsPrompt.current as any).prompt();

    seta2hsBunner(false);

    (a2hsPrompt.current as any).userChoice.then((choiceResult: any) => {
      // a2hsPrompt.current = null;
    });
  }

  // отмена
  const a2hsCancel = () => {
    seta2hsBunner(false);
  }

  return {a2hsBunner, a2hsAgree, a2hsCancel, seta2hsBunner};
}