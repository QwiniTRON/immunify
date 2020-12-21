import react from 'react';
import { Link, useLocation } from 'react-router-dom';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { makeStyles } from '@material-ui/core/styles';


type BackButtonProps = {
    to?: string
    text?: string
    SubstituteComponent?: any
}

const useStyles = makeStyles({
    root: {
        textDecoration: 'none',
        color: '#333'
    },
    text: {
        verticalAlign: 'super'
    },
    icon: {
        color: '#aeaeae',
        paddingTop: 3
    }
});

export const BackButton: React.FC<BackButtonProps> = ({ to, text, SubstituteComponent = 'div' }) => {
    const locationData = useLocation();
    const pathNames = locationData.pathname.split('/').slice(1);
    const pathToBack = '/' + pathNames.slice(0, -1).join('/');
    const classes = useStyles();

    if (pathToBack == '/' && !Boolean(to)) return (<SubstituteComponent></SubstituteComponent>);

    return (
        <Link to={to || pathToBack} className={classes.root}>
            <ChevronLeftIcon className={classes.icon} />
            <span className={classes.text}> {text || 'назад'}</span>
        </Link>
    );
};