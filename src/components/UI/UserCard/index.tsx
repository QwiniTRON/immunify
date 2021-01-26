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

        '&:visited': {
            color: 'currentColor'
        }
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
        backgroundColor: 'var(--accentColor)'
    },

    indicator: {
        height: 12,
        width: 12,
        border: '1px solid #DADADA',
        borderRadius: 12,
        display: 'inline-block',
        verticalAlign: 'baseline',
        marginRight: 10
    },

    chooseButton: {
        color: 'var(--mainColor2)',
        border: '1px solid var(--mainColor2)',
        padding: 5,
        textAlign: 'center',
        borderRadius: 4,
        position: 'relative',
        zIndex: 5
    },

    chooseButton__active: {
        color: 'var(--accentColor)',
        border: '1px solid var(--accentColor)',
    },

    doneIcon: {
        marginRight: 13,
        opacity: 0,
        color: 'var(--mainColor2)',
        stroke: 'currentColor',
        marginTop: 5
    },

    doneIcon__active: {
        opacity: 1
    }
}));

const DoneIcon: React.FC<{ [p: string]: any }> = (props) => (
    <svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M2.36172 5.97908L6.48606 10.7368L13.1472 1.85585" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
);



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
            <div className={classes.root}>
                <div className={classes.content}>

                    {/* текст */}
                    <div className={classes.text}>
                        {/* имя */}
                        <p className={classes.title}>
                            <div className={sif({ [classes.indicator]: true, [classes.active]: Boolean(active) })} /> <span>{title}</span>
                        </p>

                        {progress == 100 &&
                            <p className={classes.age}>
                                <DoneIcon className={s(classes.doneIcon, classes.doneIcon__active)} />

                                <span>Профиль заполнен</span>
                            </p>
                        }

                        {progress < 100 &&
                            <p className={classes.age}><DoneIcon className={classes.doneIcon} /> <span>Профиль не заполнен</span></p>
                        }

                    </div>

                    {/* <AppCircleProgress progress={progress} isDone={progress == 100} /> */}
                    {!active &&
                        <div className={classes.chooseButton}>Выбрать</div>
                    }
                </div>
            </div>
        </Link>
    );
};