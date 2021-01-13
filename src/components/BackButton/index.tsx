import React from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { makeStyles } from '@material-ui/core/styles';

import { useLastPath } from '../../hooks/';

type BackButtonProps = {
    to?: string
    text?: string
    SubstituteComponent?: any
    simpleBack?: boolean
    routeText?: boolean
}

const useStyles = makeStyles({
    root: {
        textDecoration: 'none',
        color: '#333',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center'
    },

    text: {
        fontSize: 18,
        color: '#777',
        fontWeight: 300
    },

    icon: {
        color: '#aeaeae'
    }
});

export const BackButton: React.FC<BackButtonProps> = ({
    to,
    text,
    SubstituteComponent = 'div',
    simpleBack,
    routeText
}) => {
    const classes = useStyles();
    const lastPath = useLastPath();

    const locationData = useLocation();
    const history = useHistory();

    const pathNames = locationData.pathname.split('/').slice(1);
    const pathToBack = '/' + pathNames.slice(0, -1).join('/');
    let textToShow = routeText ? lastPath.lastPathText : text;
    textToShow = textToShow || 'назад';


    if (simpleBack) {
        return (
            <div className={classes.root} onClick={() => history.goBack()}>
                <ChevronLeftIcon className={classes.icon} />
                <span className={classes.text}> { textToShow }</span>
            </div>
        )
    }

    if (pathToBack == '/' && !Boolean(to)) return (<SubstituteComponent></SubstituteComponent>);

    return (
        <Link to={to || pathToBack} className={classes.root}>
            <ChevronLeftIcon className={classes.icon} />
            <span className={classes.text}> {text || 'назад'}</span>
        </Link>
    );
};