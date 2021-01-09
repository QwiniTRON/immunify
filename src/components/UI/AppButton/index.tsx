import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';

import { sif } from '../../../utils/Styels';


export type AppButtonProps = {
    [p: string]: any
    floated?: boolean
    appColor?: 'linear' | 'white'
}

const ButtonColors = {
    'linear': {
        background: "linear-gradient(91.68deg, #9BC83F -3.91%, #67CDFD 46.87%, #9BC83F 112.32%)",
        color: "#fff",

        '&:disabled': {
            background: '#ccc'
        }
    },
    'white': {
        background: '#fff',
        color: '#9BC83F',
        border: '1px solid #9BC83F',

        '&:hover': {
            backgroundColor: 'rgba(155, 200, 63, 0.1)',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.6)'
        },
        '&:active': {
            boxShadow: 'none',
            backgroundColor: 'rgba(155, 200, 63, 0.1)',
        }
    },
    'default': {color: '#fff'}
}
const useStyles = makeStyles((theme) => ({
    root: (props: AppButtonProps) => ({
        borderRadius: 45,
        ...ButtonColors[props.appColor ?? 'default'],
        textAlign: 'center',
        padding: 12
    }),
    floated: {
        position: 'fixed',
        bottom: 75,
        margin: '0 auto',
        zIndex: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        minWidth: 160,

        ['@media (max-width:319px)']: {
            bottom: 15
        }
    }
}));

export const AppButton: React.FC<AppButtonProps> = (props) => {
    const classes = useStyles(props);

    return (
        <Button
            color="primary"
            variant="contained"
            classes={{
                root: sif({ [classes.root]: true, [classes.floated]: Boolean(props.floated) })
            }}
            className='app-button'
            {...props}>
            {props.children}
        </Button>
    );
};