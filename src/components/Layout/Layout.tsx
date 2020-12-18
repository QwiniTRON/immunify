import react, { useState, useEffect } from 'react';
import Logo from '../../assets/logo.png';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { useHistory, useLocation, Link } from 'react-router-dom';
import InsertInvitationIcon from '@material-ui/icons/InsertInvitation';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PostAddIcon from '@material-ui/icons/PostAdd';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import { useSelector } from 'react-redux';

import "./Layout.scss";
import { RootState } from '../../store';
import { User } from '../../store/types';
import { BackButton } from '../BackButton';

// import { CalendarIcon, PassportIcon, ProfileIcon, TakeIcon } from '../UI/Icons/Icons';

type LayoutProps = {
    title: string
    hideNav?: boolean
    hideHeader?: boolean
    titleCurrentName?: boolean
}

const useStyles = makeStyles((theme) => ({
    avatar: {
        width: 48,
        height: 48
    },
    title: {
        fontSize: 18,
        padding: theme.spacing(0, 1),
        textAlign: 'center'
    },
    navIcon: {
    },
    layout: {
    }
}));


export const Layout: React.FC<LayoutProps> = ({
    children,
    title,
    hideNav,
    hideHeader,
    titleCurrentName
}) => {
    const classes = useStyles();
    const history = useHistory();
    const locationData = useLocation();
    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    // определяем в какой мы находимся сущности(разделе)
    const parentRoute = '/' + locationData.pathname.split('/')[1];

    return (
        <div className={"layout " + classes.layout}>
            {!hideHeader && <header className="layout__header">
                <BackButton />

                <Typography className={classes.title} variant="h3">
                    {titleCurrentName? currentUser?.name : title}
                </Typography>

                <Avatar className={classes.avatar}>
                    {currentUser ? currentUser.name[0] + currentUser.name.slice(-1) : "😎"}
                </Avatar>
            </header>}

            <main className="layout__content">
                {children}
            </main>

            {!hideNav && <div className="layout__navigation">
                <BottomNavigation
                    value={parentRoute}
                    onChange={(event, newValue) => {
                        history.push(newValue);
                    }}
                    showLabels
                >
                    <BottomNavigationAction
                        classes={{
                            root: classes.navIcon,
                        }}
                        label="профиль"
                        icon={<SupervisorAccountIcon />}
                        value="/profile"
                    />

                    <BottomNavigationAction
                        classes={{
                            root: classes.navIcon,
                        }}
                        label="пасспорт"
                        icon={<ListAltIcon />}
                        value="/passport"
                    />

                    <BottomNavigationAction
                        classes={{
                            root: classes.navIcon,
                        }}
                        label="календарь"
                        icon={<InsertInvitationIcon />}
                        value="/calendar"
                    />

                    <BottomNavigationAction
                        classes={{
                            root: classes.navIcon,
                        }}
                        label="запись"
                        icon={<PostAddIcon />}
                        value="/take"
                    />
                </BottomNavigation>
            </div>}
        </div>
    );
};