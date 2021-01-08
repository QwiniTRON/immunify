import React, { useEffect, useLayoutEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ruLocale from "date-fns/locale/ru";
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ManImg from '../../assets/man.png';
import WomanImg from '../../assets/woman.png';

import { AppButton } from '../../components/UI/AppButton';
import { addMember } from '../../store/user/action';
import { RootState } from '../../store';
import { Layout } from '../../components/Layout/Layout';
import { AppRadioGroup } from '../../components/UI/AppRadioGroup';
import { AppRadioButton } from '../../components/UI/AppRadioButton';
import { BackButton } from '../../components/BackButton';
import { useServer } from '../../hooks/useServer';
import { CreatePatient } from '../../server';
import { Loader } from '../../components/UI/Loader';
import { s } from '../../utils';
import { Divider } from '../../components';

type AddMemberProps = {


    addMember: Function
}

const useStyle = makeStyles({
    sexLabel: {
        fontSize: 14
    },

    root: {
        height: 'auto'
    },

    genderImg: {
        maxWidth: '100%'
    },

    startButton: {
        maxWidth: 290,
        width: '100%',
        padding: 20,
        borderRadius: 20,
        bottom: 35
    },

    title: {
        marginTop: 0,
        fontSize: 24
    }
});

const AddMember: React.FC<AddMemberProps> = ({
    addMember
}) => {
    const classes = useStyle();
    const history = useHistory();

    const addReq = useServer(CreatePatient);
    const loading = addReq.state.fetching;
    const success = !loading && addReq.state.answer.succeeded;

    const [sex, setSex] = useState('');
    const [name, setName] = useState('');
    const [selectedDate, handleDateChange] = useState<Date | null>(null);
    const [errors, setErrors] = useState({
        name: '',
        age: '',
        sex: ''
    });

    useLayoutEffect(() => {
        if (success) {
            addMember(name, selectedDate?.getTime(), sex, addReq?.state?.answer?.data?.id)
                .then((r: any) => {
                    history.push(`/profile/${name}`);
                    addReq.reload();
                });
        } else if (addReq.state.answer.errorMessage) {
            // handle error
        }
    }, [success]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        let valid = true;
        // sanitize
        const sexText = sex.trim();
        const nameText = name.trim();
        const errors = {
            name: '',
            age: '',
            sex: ''
        }

        // валидация
        if (nameText.length < 2) {
            errors.name = 'имя должно быть не короче 2 символов';
            valid = false;
        }
        if (!Boolean(selectedDate)) {
            errors.age = 'возраст обязателен';
            valid = false;
        }
        if (!sexText) {
            errors.sex = 'пол обязателен';
            valid = false;
        }

        if (valid) {
            addReq.fetch(undefined);
        } else {
            setErrors(errors);
        }
    }

    return (
        <Layout title="" BackButtonCustom={<BackButton text="вернуться в профиль" />} hideNav={true}>
            <div className={"reg " + classes.root}>
                <div className="reg__container">
                    <h1 className={s(classes.title)}>
                        Новый пациент
                    </h1>

                    <Divider />

                    {loading ? <Loader /> :

                        <form className="reg__form" onSubmit={handleSubmit}>

                            <Typography color="error">{errors.sex}</Typography>
                            <Box display="flex" justifyContent="space-evenly" marginBottom={3}>
                                <AppRadioGroup onChange={(value: string) => {
                                    setSex(value);
                                }}
                                    value={sex}
                                >
                                    <AppRadioButton value="man"
                                        text="Мужчина"
                                        component={
                                            (
                                                <img src={ManImg} className={classes.genderImg} />
                                            )
                                        }
                                    />
                                    <AppRadioButton value="woman"
                                        text="Женщина"
                                        component={
                                            (
                                                <img src={WomanImg} className={classes.genderImg} />
                                            )
                                        }
                                    />
                                </AppRadioGroup>
                            </Box>

                            <Typography color="error">{errors.name}</Typography>
                            <TextField
                                label="Введите имя"
                                variant="outlined"
                                className="reg__input"
                                id="name-input"
                                value={name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />

                            <Typography color="error">{errors.age}</Typography>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                                <DatePicker
                                    label="дата рождения"
                                    value={selectedDate}
                                    onChange={handleDateChange as any}
                                    fullWidth
                                    cancelLabel="отмена"
                                    format="d MMM yyyy"
                                    disableFuture
                                    inputVariant="outlined"
                                    clearable
                                />
                            </MuiPickersUtilsProvider>

                            <AppButton
                                floated
                                className={classes.startButton}
                                appColor="linear"
                                disabled={loading || (!Boolean(name) || !Boolean(selectedDate) || !Boolean(sex))}
                                type="submit">
                                Начать
                            </AppButton>
                        </form>
                    }

                </div>
            </div>
        </Layout>
    );
};

const mapStateToProps = (state: RootState) => ({
});
const mapDispatchToProps = {
    addMember
}
const connectedAddMember = connect(mapStateToProps, mapDispatchToProps)(AddMember);
export { connectedAddMember as AddMember };