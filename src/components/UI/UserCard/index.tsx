import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import { s, sif } from '../../../utils/Styels';


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
        textDecoration: 'none',
        display: 'block',
        cursor: 'pointer'
    },

    content: {
        display: 'flex',
        alignItems: 'center'
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
        flexGrow: 1,
        marginRight: 10
    },

    title: {
        fontSize: 18,
        fontWeight: 500,
        color: 'var(--textColor)',

        '@media (max-width: 340px)': {
            fontSize: 14,
        }
    },

    age: {
        fontSize: 18,
        fontWeight: 300,
        color: "#ACACAC",
        display: 'flex',

        '@media (max-width: 340px)': {
            fontSize: 14,
        }
    },

    active: {
        backgroundColor: 'var(--accentColor)',
    },

    indicator: {
        position: 'relative',
        height: 24,
        width: 24,
        minWidth: 24,
        border: '1px solid #DADADA',
        borderRadius: 12,
        display: 'inline-block',
        verticalAlign: 'baseline',
        marginRight: 10,
        padding: 2,
        backgroundClip: 'content-box',
        textAlign: 'center',

        '@media (max-width: 340px)': {
            marginRight: 5
        }
    },

    chooseButton: {
        color: 'var(--mainColor2)',
        border: '1px solid var(--mainColor2)',
        padding: 5,
        textAlign: 'center',
        borderRadius: 4,
        position: 'relative',
        zIndex: 5,
        textDecoration: 'none',
        minWidth: 90,

        ':visited': {
            color: 'currentColor'
        }
    },

    chooseButton__active: {
        backgroundColor: 'var(--mainColor2, #67CDFD)',
        color: 'white'
    },

    doneIcon__active: {
        opacity: 1
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
        <div className={classes.rootLink}>
            <div className={classes.root}>
                <div className={classes.content}>
                    <div className={sif({ [classes.indicator]: true, [classes.active]: Boolean(active) })} >
                        {active &&
                            <svg width="11" height="9" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.11207 5.99238L5.49827 10.5063L11.6417 1.26501" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        }
                    </div>

                    {/* текст */}
                    <div className={classes.text}>
                        <p className={classes.title}>
                            <span>{title}</span>
                            <p className={classes.age}> <span>{progress < 100 ? "Профиль заполнен" : "Профиль не заполнен"} </span></p>
                        </p>
                    </div>

                    {progress == 100 &&
                        <Link to={to} className={classes.chooseButton}>Изменить</Link>
                    }

                    {progress < 100 &&
                        <Link to={to} className={s(classes.chooseButton, classes.chooseButton__active)}>Заполнить</Link>
                    }
                </div>
            </div>
        </div>
    );
};