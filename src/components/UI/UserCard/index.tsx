import react from 'react';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

import {sif} from '../../../utils/Styels';

type UserCardProps = {
    title: string
    subtitle: string
    avatarLetters: string
    to: string
    active?: boolean
    progress: number
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: 5
    },
    rootLink: {
        margin: '8px 0',
        textDecoration: 'none',
        display: 'block'
    },
    content: {
        display: 'flex'
    },
    progress: {
        width: '48px !important',
        marginBottom: '-3px',
        marginTop: 3
    },
    avatarBlock: {
        position: 'relative',
        paddingRight: 15
    },
    avatarImg: {
        position: 'absolute',
        top: 2,
        left: 7,
        width: 42,
        height: 42
    },
    text: {
        flexGrow: 1
    },
    title: {
        fontSize: 24,
        fontWeight: 500
    },
    age: {
        fontSize: 18
    },
    active: {
        border: `1px solid ${theme.palette.primary.main}`
    }
}));

export const UserCard: React.FC<UserCardProps> = ({
    title,
    subtitle,
    avatarLetters,
    to,
    active,
    progress
}) => {
    const classes = useStyles();

    return (
        <Link to={to} className={classes.rootLink}>
            <Paper classes={{ root: sif({[classes.root]: true, [classes.active]: Boolean(active)}) }}>
                <div className={classes.content}>
                    <div className={classes.avatarBlock}>
                        <CircularProgress classes={{root: classes.progress}} variant="determinate" value={progress} />
                        <Avatar classes={{root: classes.avatarImg}}>{avatarLetters}</Avatar>
                    </div>
                    <div className={classes.text}>
                        <p className={classes.title}>{title}</p>
                        <p className={classes.age}>{subtitle}</p>
                    </div>
                </div>
            </Paper>
        </Link>
    );
};