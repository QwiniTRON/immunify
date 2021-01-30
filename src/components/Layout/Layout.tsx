import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import { ReactComponent as InfoIcon } from '../../assets/info.svg';
import { ReactComponent as ExitIcon } from '../../assets/exit.svg';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import { CSSTransition } from 'react-transition-group';

import "./Layout.scss";

import MainLogo from '../../assets/splashlogo.png';
import { RootState } from '../../store';
import { BackButton } from '../BackButton';
import { sif } from '../../utils/Styels';
import { FamilyIcon, DoneIcon, ListIcon, PasportIcon } from '../../components/UI/Icons/Icons';
import { AppModal } from '../UI/AppModal';
import { AppButton } from '../UI';
import { exit } from '../../store/user/action';
import { useAccessToken } from '../../hooks';


type LayoutProps = {
    title: string
    hideNav?: boolean
    hideHeader?: boolean
    titleCurrentName?: boolean
    BackButtonCustom?: any | React.ReactElement
    domainPage?: boolean
    clearScroll?: boolean
    background?: boolean
    toolMenu?: React.ReactElement
}

const useStyles = makeStyles((theme) => ({
    avatar: {
        width: 48,
        height: 48,
        color: '#646464',
        fontWeight: 500
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
    toolMenu,
    background
}) => {
    const classes = useStyles();

    const dispatch = useDispatch();
    const history = useHistory();
    const {set: setToken} = useAccessToken();

    const locationData = useLocation();
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const mainUser = useSelector((state: RootState) => state.user.user);

    const [asideMenu, setAsideMenu] = useState(false);
    const [exitModal, setExitModal] = useState(false);

    // определяем в какой мы находимся сущности(разделе)
    const parentRoute = '/' + locationData.pathname.split('/')[1];

    // handle back click
    useEffect(() => {
        const toggleAsideMenu = (e: Event) => { setAsideMenu(false) };

        window.addEventListener('popstate', toggleAsideMenu);

        return () => {
            window.removeEventListener('popstate', toggleAsideMenu);
        }
    }, []);


    const exitHandle = () => {
        dispatch(exit());
        setToken("");
    }


    return (
        <div className={sif({
            "layout": true,
            [classes.layout]: true,
            [classes.layout__hideNav]: Boolean(hideNav)
        })}>
            {/* header */}
            {!hideHeader &&
                <header className={sif({
                    ["layout__header"]: true,
                    [classes.header__Green]: Boolean(domainPage)
                })}>
                    {BackButtonCustom ? BackButtonCustom : <BackButton />}

                    {domainPage &&
                        <IconButton
                            edge="start"
                            className="aside-menu__toggler"
                            aria-label="menu"
                            onClick={setAsideMenu.bind(null, !asideMenu)}>
                            <MenuIcon />
                        </IconButton>
                    }

                    <Typography className={classes.title} variant="h3">
                        {titleCurrentName ? currentUser?.name : title}
                    </Typography>

                    <Avatar className={classes.avatar}>
                        {currentUser ? currentUser.name[0] + currentUser.name.slice(-1) : "😎"}
                    </Avatar>
                </header>
            }


            {/* content */}
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

            {/* подменю */}
            {toolMenu}

            {/* navigation */}
            {!hideNav &&
                <div className="layout__navigation">
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

            {/* боковое меню */}
            {Boolean(domainPage) &&
                <div className={sif({
                    ["aside-menu-container"]: true,
                    ["aside-menu-container--active"]: asideMenu
                })}>
                    <div className="aside-menu__overlay" onClick={setAsideMenu.bind(null, !asideMenu)} />
                    <div className="aside-menu">
                        <img src={MainLogo} alt="immunify" className="aside-menu__logo" />

                        <Box fontSize={24} fontWeight={500}> {mainUser?.email} </Box>

                        <div className="links">
                            <Link to="/about" className="links__link" onClick={setAsideMenu.bind(null, false)}>
                                <InfoIcon className="links__icon" /> <span>О приложении</span>
                            </Link>

                            <div className="links__link" onClick={() => setExitModal(true)}>
                                <ExitIcon className="links__icon" /> <span>Выход</span>
                            </div>
                        </div>
                    </div>

                </div>
            }

            {/* модальное окно предложения выйти */}
            <CSSTransition timeout={300} in={exitModal} classNames="fade" mountOnEnter unmountOnExit>
                <AppModal onClose={setExitModal.bind(null, false)}>
                    <Box component="h2" textAlign="center" >выйти из аккаунта?</Box>

                    <Box display="flex" justifyContent="space-between" mt={5}>
                        <AppButton minWidth onClick={() => exitHandle()}>да</AppButton>
                        <AppButton minWidth appColor="white" onClick={setExitModal.bind(null, false)}>нет</AppButton>
                    </Box>
                </AppModal>
            </CSSTransition>

        </div>
    );
};