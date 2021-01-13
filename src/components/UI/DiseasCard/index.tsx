import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Box from '@material-ui/core/Box';

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
        marginBottom: 5
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
        justifyContent: 'space-between',
        fontSize: 18,
        fontWeight: 400,
        borderTop: "1px solid #eee",
        padding: '10px 0'
    },

    line__bnone: {
        borderTop: 'none'
    },

    indicator: {
        height: 12,
        width: 12,
        borderRadius: 6,
        margin: "7px 10px 10px 10px",
        display: 'inline-block',
        verticalAlign: 'middle'
    },

    status: {
        fontWeight: 300
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

const riskBackgroundColors: {[p: string]: string} = {
    '1': 'green',
    '2': 'yellow',
    '3': 'red'
}

const riskText: {[p: string]: string} = {
    '1': 'низкий',
    '2': 'средний',
    '3': 'высокий'
}

export const DiseasCard: React.FC<DiseasCardProps> = ({
    risks,
    name,
    to
}) => {
    const classes = useStyels();
    const personRisk: RiskStage = risks[0] as RiskStage;
    const profRisk: RiskCoefficient = risks[1] + 1 as RiskCoefficient;
    const epicRisk: RiskCoefficient = risks[2] + 1 as RiskCoefficient;

    const indicatorColor = String(Math.max(personRisk, (profRisk), (epicRisk)));

    return (
        <Link className={classes.rootLink} to={to}>
            <Paper classes={{ root: classes.root }}>
                <div className={classes.head}>
                    <p className={classes.title}>
                        <div className={s(classes.indicator, (classes as any)[riskBackgroundColors[indicatorColor]])} />

                        {name}
                    </p>

                    <ArrowForwardIosIcon classes={{ root: classes.headArrow }} />
                </div>

                <Box fontWeight={300}>Риск заражения:</Box>

                <div className={s(classes.line, classes.line__bnone)}>
                    Индивидуальный

                    <span className={classes.status}>{riskText[personRisk]}</span>
                </div>

                <div className={classes.line}>
                    Профессиональный

                    <span className={classes.status}>{riskText[String(profRisk)]}</span>
                </div>

                <div className={classes.line}>
                    Эпидемиологический

                    <span className={classes.status}>{riskText[String(epicRisk)]}</span>
                </div>
            </Paper>
        </Link>
    );
};