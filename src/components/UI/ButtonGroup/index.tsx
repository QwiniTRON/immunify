import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { sif } from '../../../utils/Styels';

type ButtonGroupProps = {
    floated?: boolean
};

const useStyles = makeStyles({
    body: {
        display: 'flex',
        justifyContent: 'center',
        padding: 5,

        '& > *': {
            margin: '0 10px'
        }
    },
    
    floated: {
        position: 'fixed',
        bottom: 'var(--navigationMenuHeight)',
        left: 0,
        right: 0,
        maxWidth: 600,
        margin: '0 auto',
        zIndex: 10,
        backgroundColor: '#fff',
        boxShadow: '0 -8px 11px -8px #666'
    }
});

export const AppButtonGroup: React.FC<ButtonGroupProps> = ({
    children,
    floated
}) => {
    const classes = useStyles();

    return (
        <div className={sif({[classes.body]: true, [classes.floated]: Boolean(floated)}) }>
            {children}
        </div>
    );
};