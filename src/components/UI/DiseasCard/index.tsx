import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Box from '@material-ui/core/Box';
import { ReactComponent as ShieldLowIcon } from '../../../assets/shieldLow.svg';
import { ReactComponent as ShieldMedIcon } from '../../../assets/shieldMed.svg';
import { ReactComponent as ShieldFullIcon } from '../../../assets/shieldFull.svg';
import { ReactComponent as ShieldNoneIcon } from '../../../assets/shieldNone.svg';
import { ReactComponent as VirusIcon } from '../../../assets/virus.svg';

import './diseascard.scss';

import { s, sif } from '../../../utils/Styels';
import { Link } from 'react-router-dom';
import { RiskCoefficient, RiskStage, RiskViewModel } from '../../../server';
import { VaccinationForDiseas } from '../../../containers/Passport';
import { Divider } from '../Divider';


type riskString = "low" | "medium" | "high"
type DiseasCardProps = {
    to: string
    vaccination?: VaccinationForDiseas
    risk: RiskViewModel
}

const useStyels = makeStyles({
    rootLink: {
        textDecoration: 'none'
    },

    root: {
        padding: '10px 15px',
        margin: '5px 0',
        borderRadius: 10
    },

    subTitle: {
        fontSize: 16,
        fontWeight: 300,
        color: '#acacac'
    },

    head: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 20
    },

    linkIcon: {
        color: '#ACACAC',
        fontSize: 18,
        marginLeft: 'auto'
    },

    title: {
        fontSize: 18,
        fontWeight: 500
    },
});


const MarkersEnum: { [p: string]: string } = {
    "1": 'green',
    "2": 'yellow',
    "3": 'red'
}


export const DiseasCard: React.FC<DiseasCardProps> = ({
    to,
    risk,
    vaccination
}) => {
    const classes = useStyels();


    let shieldIcon = <ShieldLowIcon className="icon" />;
    if (vaccination?.vaccinationStatus?.statusColor == "red") shieldIcon = <ShieldLowIcon className="icon" />;
    if (vaccination?.vaccinationStatus?.statusColor == "yellow") shieldIcon = <ShieldMedIcon className="icon" />;
    if (vaccination?.vaccinationStatus?.statusColor == "green") shieldIcon = <ShieldFullIcon className="icon" />;


    let riskStatus = Math.max(risk.risk, risk.regionRisk + 1, risk.regionRisk + 1);
    let currentRisk = 'Низкий';
    if (riskStatus == 2) currentRisk = 'Средний';
    if (riskStatus == 3) currentRisk = 'Высокий';


    let riskMarker = MarkersEnum[riskStatus];


    let vaccinationStatus = 'Отсутствует';
    if (vaccination?.vaccinationStatus?.statusColor == "red") {
        vaccinationStatus = "Истекла";
    }
    if (vaccination?.vaccinationStatus?.statusColor == "yellow") {
        vaccinationStatus = "Частичная";
    }
    if (vaccination?.vaccinationStatus?.statusColor == "green") {
        vaccinationStatus = "Полная";
    }


    return (
        <Link className={s(classes.rootLink, 'diseas-card', riskMarker)} to={to}>
            <Paper classes={{ root: classes.root }}>
                <div className={classes.head}>
                    <div className={classes.title}>{risk.disease}</div>

                    <ArrowForwardIosIcon classes={{ root: classes.linkIcon }} />
                </div>

                <div>
                    <div className="line">
                        <div className={classes.subTitle}>Риск заражения:</div>

                        <div className={classes.subTitle}>Защита: </div>
                    </div>

                    <div className="line">
                        <div className="text"> <VirusIcon className="virusIcon" /> {currentRisk} </div>

                        <div className="text">{vaccinationStatus} {shieldIcon}</div>
                    </div>
                </div>
            </Paper>
        </Link>
    );
};