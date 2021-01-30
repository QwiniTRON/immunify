import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';

import { sif } from '../../../utils/Styels';


export type AppButtonProps = {
    [p: string]: any
    floated?: boolean
    appColor?: 'linear' | 'white'
    minWidth?: boolean
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
    'default': { color: '#fff' }
}
const useStyles = makeStyles((theme) => ({
    root: (props: AppButtonProps) => ({
        borderRadius: 45,
        ...ButtonColors[props.appColor ?? 'default'],
        textAlign: 'center',
        padding: 12
    }),

    minWidth: {
        minWidth: 160,

        '@media (max-width: 350px)': {
            minWidth: 120
        }
    },

    floated: {
        position: 'fixed',
        top: 'calc(var(--full_height) - 130px)',
        margin: '0 auto',
        zIndex: 1,
        left: '50%',
        transform: 'translateX(-50%)',
        minWidth: 160,
        width: 'auto',
        display: 'inline-block',

        '@supports (position: sticky)': {
            position: 'sticky',
            bottom: 15,
            top: 0
        },

        '@supports (position: -webkit-sticky)': {
            position: '-webkit-sticky',
            bottom: 15,
            top: 0
        },

        '@supports (position: -moz-sticky)': {
            position: '-moz-sticky',
            bottom: 15,
            top: 0
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
                root: sif({
                    [classes.root]: true,
                    [classes.floated]: Boolean(props.floated),
                    [classes.minWidth]: Boolean(props.minWidth)
                })
            }}
            className='app-button'
            {...props}>
            {props.children}
        </Button>
    );
};