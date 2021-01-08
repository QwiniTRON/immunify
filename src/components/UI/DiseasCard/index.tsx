import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

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
        padding: 8,
        margin: '5px 0',
        borderRadius: 10
    },

    head: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },

    headArrow: {
        color: '#acacac',
        fontSize: 14
    },

    title: {
        fontSize: 18,
        fontWeight: 500
    },

    line: {
        display: 'flex',
        alignItems: 'flex-start',
        fontSize: 18,
        fontWeight: 400,
        borderTop: "1px solid #eee",
    },

    line__bnone: {
        borderTop: 'none'
    },

    indicator: {
        height: 12,
        width: 12,
        borderRadius: 6,
        margin: "7px 10px 10px 10px"
    },

    green: {
        backgroundColor: '#3BCF1A'
    },

    red: {
        backgroundColor: '#FF003D'
    },

    yellow: {
        backgroundColor: '#FFB800'
    }
});

const riskBackgroundColors = {
    [RiskStage.Low]: 'green',
    [RiskStage.Medium]: 'yellow',
    [RiskStage.High]: 'red',
    [RiskCoefficient.None]: 'green',
    [RiskCoefficient.Low]: 'yellow',
    [RiskCoefficient.High]: 'red'
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
                <div className={classes.head}>
                    <p className={classes.title}>{name}</p>

                    <ArrowForwardIosIcon classes={{ root: classes.headArrow }} />
                </div>

                <div className={s(classes.line, classes.line__bnone)}>
                    <div
                        className={s(classes.indicator, (classes as any)[riskBackgroundColors[personRisk]])}
                    ></div>
                    Персональный риск
                </div>

                <div className={classes.line}>
                    <div
                        className={s(classes.indicator, (classes as any)[riskBackgroundColors[profRisk]])}
                    ></div>
                    Профессиональный риск
                </div>

                <div className={classes.line}>
                    <div
                        className={s(classes.indicator, (classes as any)[riskBackgroundColors[epicRisk]])}
                    ></div>
                    Эпидемиологическая обстановка
                </div>
            </Paper>
        </Link>
    );
};