import React, { useEffect, useRef } from 'react';

export const useTimerFunction = () => {
    let timerRef = useRef<number>();

    const cancel = () => {
        window.clearTimeout(timerRef.current!);
    }

    const perform = (func: Function, time: number) => {
        timerRef.current = window.setTimeout(() => {
            func?.();
        }, time);
    }

    useEffect(() => {
        return () => {
            cancel();
        }
    }, []);

    return [perform, cancel];
}