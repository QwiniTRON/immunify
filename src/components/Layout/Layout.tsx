import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Background from '../../assets/backgroundgeneral.svg';

import "./Layout.scss";
import { RootState } from '../../store';
import { BackButton } from '../BackButton';
import { sif } from '../../utils/Styels';
import { FamilyIcon, DoneIcon, ListIcon, PasportIcon } from '../../components/UI/Icons/Icons';

type LayoutProps = {
    title: string
    hideNav?: boolean
    hideHeader?: boolean
    titleCurrentName?: boolean
    BackButtonCustom?: any | React.ReactElement
    domainPage?: boolean
    clearScroll?: boolean
    background?: boolean
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
    },

    header__Green: {
        backgroundColor: '#E0F0BE'
    },

    layout__hideNav: {
        paddingBottom: 0
    }
}));


export const Layout: React.FC<LayoutProps> = ({
    children,
    title,
    hideNav,
    hideHeader,
    titleCurrentName,
    BackButtonCustom,
    domainPage,
    clearScroll,
    background
}) => {
    const classes = useStyles();
    const history = useHistory();
    const locationData = useLocation();
    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    // определяем в какой мы находимся сущности(разделе)
    const parentRoute = '/' + locationData.pathname.split('/')[1];


    return (
        <div className={sif({
                "layout": true,
                [classes.layout]: true,
                [classes.layout__hideNav]: Boolean(hideNav)
            })}>
            {!hideHeader &&
                <header className={sif({
                    ["layout__header"]: true,
                    [classes.header__Green]: Boolean(domainPage)
                })}>
                    {BackButtonCustom ? BackButtonCustom : <BackButton />}

                    <Typography className={classes.title} variant="h3">
                        {titleCurrentName ? currentUser?.name : title}
                    </Typography>

                    <Avatar className={classes.avatar}>
                        {currentUser ? currentUser.name[0] + currentUser.name.slice(-1) : "😎"}
                    </Avatar>
                </header>}



            <main
                className={
                    sif({
                        ["layout__content"]: true,
                        ['layout__content--scrollcleared']: Boolean(clearScroll),
                        ['layout__background']: Boolean(background)
                    })
                }
            >
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
                        label="семья"
                        icon={<FamilyIcon />}
                        value={`/profile`}
                    />

                    <BottomNavigationAction
                        classes={{
                            root: classes.navIcon,
                        }}
                        label="паспорт"
                        icon={<PasportIcon />}
                        value={`/passport`}
                    />

                    <BottomNavigationAction
                        classes={{
                            root: classes.navIcon,
                        }}
                        label="запись"
                        icon={<ListIcon />}
                        value={`/calendar`}
                    />

                    <BottomNavigationAction
                        classes={{
                            root: classes.navIcon,
                        }}
                        label="статус"
                        icon={<DoneIcon />}
                        value={`/vaccination`}
                    />
                </BottomNavigation>
            </div>}
        </div>
    );
};