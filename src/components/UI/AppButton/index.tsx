import react from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';

import { sif } from '../../../utils/Styels';

type AppButtonProps = {
    [p: string]: any
    floated?: boolean
    appColor?: 'linear'
}

const useStyles = makeStyles((theme) => ({
    root: (props: AppButtonProps) => ({
        borderRadius: 45,
        background: props.appColor == 'linear' ? "linear-gradient(91.68deg, #9BC83F -3.91%, #67CDFD 46.87%, #9BC83F 112.32%)" : '',
        color: props.appColor == 'linear' ? "#fff" : '',
    }),
    floated: {
        position: 'fixed',
        bottom: 75,
        left: 0,
        right: 0,
        margin: '0 auto',
        width: 160
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
            {...props}>
            {props.children}
        </Button>
    );
};