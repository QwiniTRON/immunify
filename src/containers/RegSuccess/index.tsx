import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import SecurityIcon from '@material-ui/icons/Security';
import { connect } from 'react-redux';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

import { PageLayout } from '../../components/UI/PageLayout';
import { AppButton } from '../../components/UI/AppButton';
import { RootState } from '../../store';
import { User } from '../../store/types';

type RegSuccessProps = {
    user: User | null
}

const useStyles = makeStyles({
    title: {
        fontSize: 24,
        fontWeight: 500,
        margin: '24px 0'
    },
    accentet: {
        fontWeight: 'bold',
    },
    textIcon: {
        verticalAlign: 'middle',
        margin: 5
    }
});

const RegSuccess: React.FC<RegSuccessProps> = ({
    user
}) => {
    const classes = useStyles();

    return (
        <PageLayout ButtonBackto={`/`}>
            <Box marginBottom={1} textAlign="center">
                <Typography className={classes.title} variant="h2" >поздравляем вы зарегистрированы!</Typography>
            </Box>
            <Box>
                <Box textAlign="center">
                    <SecurityIcon fontSize="large" color="primary" />
                </Box>
                <Typography>Мы за Конфиденциальность ваших данных. По этому мы не храним ваши личные данные на сервере.</Typography>
                <Typography>ваши данные для входа. Эти данные можно будет найти в профиле</Typography>
            </Box>
            <Box mt={1} p={1}>
                <Typography component="div">ваш ключ защиты: <Typography component="div" className={classes.accentet}>
                    <VpnKeyIcon classes={{root: classes.textIcon}} color="primary" /> baa af adsf asd sdfsdf</Typography>
                </Typography>

                <Typography component="div">ваш ник для вохода: <Typography component="div" className={classes.accentet}>
                    <AssignmentIndIcon classes={{root: classes.textIcon}} color="primary" />{user?.name}</Typography>
                </Typography>
            </Box>
            <Link to={`/`}>
                <AppButton floated>
                    перейти на главную
                </AppButton>
            </Link>
        </PageLayout>
    );
};

const mapStatetoProps = (state: RootState) => ({
    user: state.user.currentUser
});
const mapDispatchToProps = {};
const connectedRegSuccess = connect(mapStatetoProps, mapDispatchToProps)(RegSuccess);
export { connectedRegSuccess as RegSuccess };