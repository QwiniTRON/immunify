import React from 'react';
import { s } from '../../../utils';

import './circleloader.scss';



export enum CircleLoaderColors {
    "default" = "circleLoader__green",
    "linear" = "circleLoader__linear"
}

type CircleLoaderProps = {
    color?: CircleLoaderColors
}

export const CircleLoader: React.FC<CircleLoaderProps> = ({
    color = CircleLoaderColors.default
}) => {
    const loaderColorClass = color;

    return (
        <div className={s("lds-roller", loaderColorClass)}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    )
};