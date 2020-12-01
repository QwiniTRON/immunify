import react, { useState, useEffect } from 'react';
import Logo from '../../assets/logo.png';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import {useHistory, useLocation, Link} from 'react-router-dom';

import "./Layout.scss";

import { CalendarIcon, PassportIcon, ProfileIcon, TakeIcon } from '../UI/Icons/Icons';

type LayoutProps = {
    title: string
    hideNav?: boolean
    hideHeader?: boolean
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
        '& svg': {
            fill: 'transparent',
            stroke: theme.palette.primary.main,
        }
    }
}));


export const Layout: React.FC<LayoutProps> = ({
    children,
    title,
    hideNav,
    hideHeader
}) => {
    const classes = useStyles();
    const history = useHistory();
    const locationData = useLocation();

    // определяем в какой мы находимся сущности(разделе)
    const parentRoute = '/' + locationData.pathname.split('/')[1];

    return (
        <div className="layout">
            {!hideHeader && <header className="layout__header">
                <Link to="/"><img src={Logo} alt="immunify logo" /></Link>
                <Typography className={classes.title} variant="h3">{title}</Typography>
                <Avatar className={classes.avatar}>И</Avatar>
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
                        label="календарь"
                        icon={<CalendarIcon />}
                        value="/calendar"
                    />

                    <BottomNavigationAction classes={{
                        root: classes.navIcon,
                    }}
                        label="профиль"
                        icon={<ProfileIcon />}
                        value="/profile"
                    />

                    <BottomNavigationAction classes={{
                        root: classes.navIcon,
                    }}
                        label="пасспорт"
                        icon={<PassportIcon />}
                        value="/passport"
                    />

                    <BottomNavigationAction classes={{
                        root: classes.navIcon,
                    }}
                        label="запись"
                        icon={<TakeIcon />}
                        value="/take"
                    />
                </BottomNavigation>
            </div>}
        </div>
    );
};