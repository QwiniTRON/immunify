import react, { useState } from 'react';
import Logo from '../../assets/logo.png';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import "./Layout.scss";

import { CalendarIcon, PassportIcon, ProfileIcon, TakeIcon } from '../UI/Icons/Icons';

type LayoutProps = {
    title: string
}

const useStyles = makeStyles({
    avatar: {
        width: 48,
        height: 48
    },
    title: {
        fontSize: 18
    }
});


export const Layout: React.FC<LayoutProps> = ({
    children,
    title
}) => {
    const [value, setValue] = useState(0);
    const c = useStyles();

    return (
        <div className="layout">
            <header className="layout__header">
                <img src={Logo} alt="immunify logo" />
                <Typography className={c.title}>{title}</Typography>
                <Avatar className={c.avatar}>И</Avatar>
            </header>
            <main className="layout__content">
                {children}
            </main>
            <div className="layout__navigation">
                <BottomNavigation
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    showLabels
                >
                    <BottomNavigationAction label="календарь" icon={<CalendarIcon />} />
                    <BottomNavigationAction label="профиль" icon={<ProfileIcon />} />
                    <BottomNavigationAction label="пасспорт" icon={<PassportIcon />} />
                    <BottomNavigationAction label="запись" icon={<TakeIcon />} />
                </BottomNavigation>
            </div>
        </div>
    );
};