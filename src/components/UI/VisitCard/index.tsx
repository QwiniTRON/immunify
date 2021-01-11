import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { Divider } from '../Divider';
import { Link } from 'react-router-dom';
import DateRangeIcon from '@material-ui/icons/DateRange';
import TimerIcon from '@material-ui/icons/Timer';
import { ReactComponent as TargetIcon } from '../../../assets/calendarList.svg';
import { ReactComponent as SyringeIcon } from '../../../assets/syringe.svg';


type VisitCardProps = {
    visit: Visit
}

type Visit = {
    date: string
    hospital: {
        id: number
        name: string
    }
    id: number
}

const useStyles = makeStyles({
    ticket: {
        display: 'flex'
    },

    ticketDate: {
        flexGrow: 4,
        fontWeight: 300
    },

    ticketTime: {
        flexGrow: 3,
        fontWeight: 300,
        borderLeft: '1px solid #dadada',
        textAlign: 'center'
    },

    ticketText: {
        fontWeight: 500,
        display: 'inline-block',
        verticalAlign: 'middle'
    },

    ticketIcon: {
        verticalAlign: 'middle',
        color: '#acacac',
        marginRight: 12,
        fontSize: 30
    },

    content: {
        padding: 10
    },

    root: {
        textDecoration: 'none'
    }
});


export const VisitCard: React.FC<VisitCardProps> = ({ visit }) => {
    const classes = useStyles();


    return (
        <Link to={`/calendar/${visit.id}`} className={classes.root}>
            <Paper key={visit.id}>
                <div className={classes.content}>
                    <div className={classes.ticket}>
                        <div className={classes.ticketDate}>
                            <DateRangeIcon className={classes.ticketIcon} />

                            <div className={classes.ticketText}>
                                {new Date(visit?.date ?? '').toLocaleDateString('ru', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>

                        <div className={classes.ticketTime}>
                            <TimerIcon className={classes.ticketIcon} />

                            <div className={classes.ticketText}>
                                {new Date(visit?.date ?? '').toLocaleTimeString('ru', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>

                    </div>

                    <Divider color="gray" />
                    <Box display="flex" fontSize={18} alignItems="center">
                        <TargetIcon className={classes.ticketIcon} />
                        <div>
                            <Box>{visit.hospital.name}</Box>
                            <Box fontWeight={300}>Москва, улица Перерва, дом 53</Box>
                        </div>
                    </Box>

                    <Divider color="gray" />
                    <Box display="flex" fontSize={18} alignItems="center"   >
                        <SyringeIcon className={classes.ticketIcon} />

                        <div>
                            <Box>Вакцина</Box>
                            <Box fontWeight={300}>Инфарникс</Box>
                        </div>
                    </Box>
                </div>
            </Paper>
        </Link>
    );
}