import react from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { s } from '../../../utils/Styels';
import { Link } from 'react-router-dom';

type riskString = "low" | "medium" | "high"
type DiseasCardProps = {
    risks: riskString[]
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
    'low': 'низкий',
    'medium': 'умеренный',
    'high': 'высокий',
}

const riskBackgroundColors = {
    'low': 'green',
    'medium': 'yellow',
    'high': 'red',
}
const riskColors = {
    'low': 'greenT',
    'medium': 'yellowT',
    'high': 'redT',
}

export const DiseasCard: React.FC<DiseasCardProps> = ({
    risks,
    name,
    to
}) => {
    const classes = useStyels();
    const personRisk = risks[0];
    const profRisk = risks[1];
    const epicRisk = risks[2];

    return (
        <Link className={classes.rootLink} to={to}>
            <Paper classes={{ root: classes.root }}>
                <p className={classes.title}>{name}</p>
                <div className={classes.line}>
                    <div className={classes.lineRisk + ' ' + (classes as any)[riskBackgroundColors[personRisk]]}></div>
                    <div className={classes.lineRisk + ' ' + (classes as any)[riskBackgroundColors[profRisk]]}></div>
                    <div className={s(classes.lineRisk, classes.lineRiskLast, (classes as any)[riskBackgroundColors[epicRisk]])}></div>
                </div>
                <div>Личная защита <span className={s(classes.riskCalculated, (classes as any)[riskColors[personRisk]])}>{riskLabels[personRisk]}</span></div>

                <div>Проф. риск <span className={s(classes.riskCalculated, (classes as any)[riskColors[profRisk]])}>{riskLabels[profRisk]}</span></div>

                <div>Эпид обстановка <span className={s(classes.riskCalculated, (classes as any)[riskColors[epicRisk]])}>{riskLabels[epicRisk]}</span></div>
            </Paper>
        </Link>
    );
};