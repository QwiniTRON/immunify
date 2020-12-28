import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import logo from '../../assets/splashlogo.png';

import './splashcreen.scss';
import { CircleLoader } from '../UI/CircleLoader';


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

    return (
        <div>
            <div className={classes.content}>
                <img className={classes.img} src={logo} alt="app logo" />
                <CircleLoader />
            </div>
        </div>
    );
};