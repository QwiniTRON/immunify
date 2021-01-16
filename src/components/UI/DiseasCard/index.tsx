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
        color: '#999'
    },

    text: {
        fontSize: 18,
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

    line: {
        display: 'flex',
        alignItems: 'center',
    },

    icon: {
        marginLeft: 'auto'
    },

    red: {
        color: '#ED1C24'
    },

    yellow: {
        color: '#FFB800'
    },

    green: {
        color: '#3BCF1A'
    }
});


export const DiseasCard: React.FC<DiseasCardProps> = ({
    to,
    risk,
    vaccination
}) => {
    const classes = useStyels();


    let shieldIcon = <ShieldNoneIcon className={classes.icon} />;
    if(vaccination?.vaccinationStatus?.statusColor == "red") shieldIcon = <ShieldLowIcon className={classes.icon} />; 
    if(vaccination?.vaccinationStatus?.statusColor == "yellow") shieldIcon = <ShieldMedIcon className={classes.icon} />; 
    if(vaccination?.vaccinationStatus?.statusColor == "green") shieldIcon = <ShieldFullIcon className={classes.icon} />; 


    let riskStatus = Math.max(risk.risk, risk.regionRisk + 1, risk.regionRisk + 1);
    let currentRisk = <div className={s(classes.text, classes.green)}>Низкий</div>;
    if(riskStatus == 2) currentRisk = <div className={s(classes.text, classes.yellow)}>Средний</div>;
    if(riskStatus == 3) currentRisk = <div className={s(classes.text, classes.red)}>Высокий</div>;


    let vaccinationStatus = 'отсутствует';
    if(vaccination?.vaccinationStatus?.statusColor == "red") vaccinationStatus = "Истекла"; 
    if(vaccination?.vaccinationStatus?.statusColor == "yellow") vaccinationStatus = "Частичная"; 
    if(vaccination?.vaccinationStatus?.statusColor == "green") vaccinationStatus = "Полная"; 


    return (
        <Link className={classes.rootLink} to={to}>
            <Paper classes={{ root: classes.root }}>
                <div className={classes.head}>
                    <div className={classes.title}>{risk.disease}</div>

                    <ArrowForwardIosIcon classes={{root: classes.linkIcon}} />
                </div>

                <div className={classes.line}>
                    <div>
                        <div className={classes.subTitle}>Риск заражения:</div>

                        <div className={classes.text}>{currentRisk}</div>
                    </div>

                    <VirusIcon className={classes.icon} />
                </div>

                <Divider color="gray" />
                <div className={classes.line}>
                    <div>
                        <div className={classes.subTitle}>Защита: </div>

                        <div className={classes.text}>{vaccinationStatus}</div> 
                    </div>

                    {shieldIcon}
                </div>                
            </Paper>
        </Link>
    );
};