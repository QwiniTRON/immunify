import react from 'react';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';


import { sif } from '../../../utils/Styels';

type CardLinkProps = {
    title: string
    subTitle?: string
    status?: "success" | "error"
    statusLabel?: string
    to: string
    Icon?: any
}

const useStyle = makeStyles((theme) => ({
    root: {
        padding: 15,
        paddingTop: 20,
        margin: '5px 0',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rootLink: {
        textDecoration: 'none'
    },
    arrow: {
        marginLeft: 10
    },
    arrowSvg: {
        color: '#ACACAC'
    },
    title: {
        fontSize: 24
    },
    status: {
        position: 'absolute',
        top: 2,
        right: 5,
        color: theme.palette.error.main
    },
    statusCuccess: {
        color: theme.palette.success.main
    },
    statusIcon: {
        paddingBottom: 3
    },
    statusLabel: {
        verticalAlign: "top"
    }
}));

export const CardLink: React.FC<CardLinkProps> = ({
    title,
    subTitle,
    to,
    status,
    statusLabel,
    Icon
}) => {
    const classes = useStyle();
    let StatusIcon = (<ClearIcon className={classes.statusIcon} />);
    if (status == 'success') StatusIcon = (<CheckIcon className={classes.statusIcon} />);
    const isStatus = !!status;

    return (
        <Link className={classes.rootLink} to={to}>
            <Paper classes={{
                root: classes.root
            }}>
                <div>
                    <p className={classes.title}>{title}</p>
                    <p>{subTitle}</p>
                </div>
                <div className={classes.arrow}>
                    {Icon ? Icon : <ArrowForwardIosIcon className={classes.arrowSvg} />}
                </div>

                {isStatus &&
                    <div
                        className={sif({
                            [classes.status]: true,
                            [classes.statusCuccess]: status == 'success'
                        })}
                    >
                        <span className={classes.statusLabel}>{statusLabel}</span>
                        {StatusIcon}
                    </div>}
            </Paper>
        </Link>
    );
};