import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import { s } from '../../../utils/Styels';
import { Link } from 'react-router-dom';
import { RiskCoefficient, RiskStage } from '../../../server';


type riskString = "low" | "medium" | "high"
type DiseasCardProps = {
    risks: number[]
    name: string
    to: string
}

const useStyels = makeStyles({
    rootLink: {
        textDecoration: 'none'
    },
    root: {
        padding: 5,
        margin: '5px 0'
    },
    title: {
        fontSize: 18,
        fontWeight: 500
    },
    line: {
        display: 'flex',
        marginBottom: 10
    },
    lineRisk: {
        height: 3,
        flexGrow: 1,
        marginRight: 5
    },
    lineRiskLast: {
        marginRight: 0
    },
    riskCalculated: {
        float: 'right'
    },
    green: {
        backgroundColor: '#3BCF1A'
    },
    red: {
        backgroundColor: '#FF003D'
    },
    yellow: {
        backgroundColor: '#FFB800'
    },
    greenT: {
        color: '#3BCF1A'
    },
    redT: {
        color: '#FF003D'
    },
    yellowT: {
        color: '#FFB800'
    }
});

const riskLabels = {
    [RiskStage.Low]: 'низкий',
    [RiskStage.Medium]: 'умеренный',
    [RiskStage.High]: 'высокий',
    [RiskCoefficient.None]: 'не опасная',
    [RiskCoefficient.Low]: 'умеренная',
    [RiskCoefficient.High]: 'высокий'
}

const riskBackgroundColors = {
    [RiskStage.Low]: 'green',
    [RiskStage.Medium]: 'yellow',
    [RiskStage.High]: 'red',
    [RiskCoefficient.None]: 'green',
    [RiskCoefficient.Low]: 'yellow',
    [RiskCoefficient.High]: 'red'
}
const riskColors = {
    [RiskStage.Low]: 'greenT',
    [RiskStage.Medium]: 'yellowT',
    [RiskStage.High]: 'redT',
    [RiskCoefficient.None]: 'greenT',
    [RiskCoefficient.Low]: 'yellowT',
    [RiskCoefficient.High]: 'redT'
}

export const DiseasCard: React.FC<DiseasCardProps> = ({
    risks,
    name,
    to
}) => {
    const classes = useStyels();
    const personRisk: RiskStage = risks[0] as RiskStage;
    const profRisk: RiskCoefficient = risks[1];
    const epicRisk: RiskCoefficient = risks[2];


    return (
        <Link className={classes.rootLink} to={to}>
            <Paper classes={{ root: classes.root }}>
                <p className={classes.title}>{name}</p>
                <div className={classes.line}>
                    <div className={classes.lineRisk + ' ' + (classes as any)[riskBackgroundColors[personRisk]]}></div>

                    <div className={classes.lineRisk + ' ' + (classes as any)[riskBackgroundColors[profRisk]]}></div>

                    <div className={s(classes.lineRisk, classes.lineRiskLast, (classes as any)[riskBackgroundColors[epicRisk]])}></div>

                </div>
                <div>Личная защита <span className={s(classes.riskCalculated, (classes as any)[riskColors[personRisk]])}>
                    {riskLabels[personRisk]}</span>
                </div>

                <div>Проф. риск <span className={s(classes.riskCalculated, (classes as any)[riskColors[profRisk]])}>
                    {riskLabels[profRisk]}</span>
                </div>

                <div>Эпид обстановка <span className={s(classes.riskCalculated, (classes as any)[riskColors[epicRisk]])}>
                    {(riskLabels)[epicRisk]}</span>
                </div>
            </Paper>
        </Link>
    );
};