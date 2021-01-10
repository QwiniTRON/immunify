import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import { sif } from '../../../utils/Styels';
import { AppCircleProgress } from '../AppCircleProgress';


type UserCardProps = {
    title: string
    subtitle?: string
    avatarLetters: string
    to: string
    active?: boolean
    progress: number
    classes?: any
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '15px 5px'
    },

    rootLink: {
        margin: '8px 0',
        textDecoration: 'none',
        display: 'block',

        '&:visited': {
            color: 'currentColor'
        }
    },

    content: {
        display: 'flex'
    },

    progress: {
        width: '48px !important',
        marginBottom: '-3px',
        marginTop: 3,
        color: '#43C4F8',
        strokeWidth: '2 !important'
    },

    avatarBlock: {
        position: 'relative',
        paddingRight: 15
    },

    avatarImg: {
        width: 42,
        height: 42
    },

    text: {
        flexGrow: 1
    },

    title: {
        fontSize: 18,
        fontWeight: 500
    },

    age: {
        fontSize: 18,
        fontWeight: 300,
        color: "#ACACAC"
    },

    active: {
        color: '#67CDFD'
    }
}));

export const UserCard: React.FC<UserCardProps> = ({
    title,
    subtitle,
    avatarLetters,
    to,
    active,
    progress,
    ...props
}) => {
    const classes = useStyles(props);

    return (
        <Link to={to} className={classes.rootLink}>
            <div className={sif({ [classes.root]: true, [classes.active]: Boolean(active) })}>
                <div className={classes.content}>
                    <div className={classes.avatarBlock}>
                        <Avatar classes={{ root: classes.avatarImg }}>{avatarLetters}</Avatar>
                    </div>
                    <div className={classes.text}>
                        <p className={sif({ [classes.title]: true, [classes.active]: Boolean(active) })}>
                            {title}
                        </p>
                        <p className={classes.age}>{subtitle}</p>
                    </div>
                    <div>
                        <AppCircleProgress progress={progress} isDone={progress == 100} />
                    </div>
                </div>
            </div>
        </Link>
    );
};