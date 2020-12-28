import React, { useEffect, useRef } from 'react';

export const useTimerFunction = () => {
    let { current: timer } = useRef<number>(null);

    const cancel = () => {
        window.clearTimeout(timer!);
    }

    const perform = (func: Function, time: number) => {
        timer = window.setTimeout(() => {
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