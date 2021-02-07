import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAccessToken } from '../hooks';
import { appDataInit } from '../store/appData/action';
import { userInit } from '../store/user/action';


export function useAppLogick() {
  // height fix
  useEffect(() => {
    const vh = window.innerHeight / 100;
    document.documentElement.style.setProperty('--vh', String(vh));
    document.documentElement.style.setProperty('--full_height', `${window.innerHeight}px`);

    const resizeObserver = new (window as any).ResizeObserver((entries: any) => {
      const [htmlMetrics] = entries;

      const vh = htmlMetrics.contentRect.height / 100;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    resizeObserver.observe(window.document.documentElement);
  }, []);
}