import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import logo from '../../assets/logo.png';

type SplashScreenProps = {

}

const useStyles = makeStyles({
    img: {
        maxWidth: '100%'
    },
    content: {
        position: 'fixed',
        width: '50vw',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
    },
});

export const SplashScreen: React.FC<SplashScreenProps> = (props) => {
    const classes = useStyles();
    const text = "идёт загрузка :)";

    return (
        <div>
            <div className={classes.content}>
                <img className={classes.img} src={logo} alt="app logo" />
                <Typography>{text}</Typography>
            </div>
        </div>
    );
};