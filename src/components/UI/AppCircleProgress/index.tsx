import React from 'react';
import { makeStyles } from '@material-ui/core/styles';


type AppCircleProgressProps = {
    progress: number
    isDone?: boolean
}

const useStyles = makeStyles({
    root: {
        width: 48,
        height: 48,
        color: '#43C4F8',
        transform: 'rotateZ(-90deg)'
    },

    track: {
        stroke: 'currentColor',
        fill: 'none',
        strokeOpacity: 0.2,
        strokeWidth: 2
    },

    line: {
        stroke: 'currentColor',
        fill: 'none',
        strokeDasharray: '150',
        strokeWidth: 2
    },

    doneCircle: {
        fill: 'currentColor'
    }
});


export const AppCircleProgress: React.FC<AppCircleProgressProps> = ({ progress, isDone, ...props }) => {
    const classes = useStyles(props);
    let lineOffset = 150 - progress / 100 * 150;
    if (isDone) lineOffset = 0;

    return (
        <svg viewBox="0 0 50 50" className={classes.root}>
            <circle cx="25" cy="25" r="24" className={classes.track} />
            <circle cx="25" cy="25" r="24" className={classes.line} style={{
                strokeDashoffset: lineOffset
            }} />

            {isDone &&
                <circle cx="25" cy="25" r="24" className={classes.doneCircle} />
            }
            {isDone &&
                <path stroke="white" strokeLinejoin="round" strokeLinecap="round" strokeWidth="3" d="M 16 21 l 10 -10 M 16 22 l 25 15" />
            }
        </svg>
    );
}