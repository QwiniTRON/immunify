import React, { useEffect, useLayoutEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { connect, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ruLocale from "date-fns/locale/ru";
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ManImg from '../../assets/man.png';
import WomanImg from '../../assets/woman.png';
import { ReactComponent as ShieldIcon } from '../../assets/shield.svg';

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
import { AppLinkButton } from '../../components/UI/AppLinkButton';
import { UserModel } from '../../models/User/User';
import { useUpdatePersonality } from '../../hooks';

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
        position: 'relative',
        margin: '0 auto',
        marginTop: 50
    },

    title: {
        marginTop: 0,
        fontSize: 24
    },

    genderContainer: {
        display: 'flex',
        justifyContent: 'space-evenly'
    },

    regionSet: {
        margin: '0 auto',
        width: 160,
        display: 'block'
    },
});

const AddMember: React.FC<AddMemberProps> = ({
    addMember
}) => {
    const classes = useStyle();
    const history = useHistory();
    const mainUser = useSelector((state: RootState) => state.user.user);
    const hasRegion = Boolean(mainUser?.data?.region?.main);

    const addReq = useServer(CreatePatient);
    const loading = addReq.state.fetching;
    const success = !loading && addReq.state.answer.succeeded;

    const updatePersonality = useUpdatePersonality();

    const [sex, setSex] = useState('');
    const [name, setName] = useState('');
    const [selectedDate, handleDateChange] = useState<Date | null>(null);
    const [errors, setErrors] = useState({
        name: '',
        age: '',
        sex: ''
    });
    const [inputTouches, setInputTouches] = useState({
        name: false,
        age: false,
        sex: false
    });
    const [isValid, setIsValid] = useState(false);

    // запрос добавления нового пациента
    useLayoutEffect(() => {
        if (success) {
            addMember(name, selectedDate?.getTime(), sex, addReq?.state?.answer?.data?.id)
                .then((r: any) => {
                    if(mainUser?.savePersonality) {
                        updatePersonality();
                    }

                    history.push(`/profile/${name}`);
                    addReq.reload();
                });
        } else if (addReq.state.answer.errorMessage) {
            // handle error
        }
    }, [success]);

    /**
     * валидаци данных
     */
    const validate = () => {
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
        if (nameText.length < 2 && inputTouches.name) {
            errors.name = '* имя должно быть не короче 2 символов';
            valid = false;
        } else if (!Boolean(selectedDate) && inputTouches.age) {
            errors.age = '* возраст обязателен';
            valid = false;
        } else if (inputTouches.name && UserModel.existsName(nameText)) {
            errors.name = '* данный ник уже зарегистрирован';
            valid = false;
        } else if (!sexText && (inputTouches.name || inputTouches.age)) {
            errors.sex = '* пол обязателен';
            valid = false;
        }

        if (!inputTouches.name || !inputTouches.age || !inputTouches.sex) {
            valid = false;
        }
        setIsValid(valid);
        setErrors(errors);

        return [valid, errors]
    }

    // при изменении пола
    useEffect(() => {
        validate();
    }, [sex, selectedDate]);

    /**
     * 
     * добовление нового пациента
     * 
     * @param e 
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        const [valid, errors] = validate();

        if (valid) {
            addReq.fetch({});
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

                    {!hasRegion &&
                        <Box>
                            <Box textAlign="center" mb={4}>
                                <ShieldIcon />
                            </Box>

                            <Box color="#FF003D" textAlign="center" fontSize={18}>
                                * У вас не установлен регион, установите его для добавления нового пациента
                            </Box>

                            <Box mt={7}>
                                <AppLinkButton className={classes.regionSet} appColor="linear" to={`/profile/${mainUser?.name}/region`}>
                                    установить
                                </AppLinkButton>
                            </Box>
                        </Box>
                    }

                    {hasRegion && loading &&
                        <Loader />
                    }

                    {hasRegion && !loading &&
                        <form className="reg__form" onSubmit={handleSubmit}>

                            <Typography color="error">{errors.sex}</Typography>
                            <Box marginBottom={3}>
                                <AppRadioGroup onChange={(value: string) => {
                                    setInputTouches(Object.assign({}, inputTouches, { sex: true }));
                                    setSex(value);
                                    validate();
                                }}
                                    value={sex}
                                    className={classes.genderContainer}
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
                            
                            <TextField
                                label="Введите имя"
                                variant="outlined"
                                className="reg__input"
                                id="name-input"
                                value={name}
                                error={Boolean(errors.name)}
                                helperText={errors.name}
                                onBlurCapture={validate}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setName(e.target.value);
                                    setInputTouches(Object.assign({}, inputTouches, { name: true }));
                                }}
                            />

                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                                <DatePicker
                                    label="дата рождения"
                                    value={selectedDate}
                                    onChange={handleDateChange as any}
                                    fullWidth
                                    error={Boolean(errors.age)}
                                    helperText={errors.age}
                                    cancelLabel="отмена"
                                    format="d MMM yyyy"
                                    disableFuture
                                    inputVariant="outlined"
                                    clearable
                                    onBlurCapture={validate}
                                    onFocus={() => setInputTouches(Object.assign({}, inputTouches, { age: true }))}
                                />
                            </MuiPickersUtilsProvider>

                            <div className="btns">
                                <AppButton
                                    className={classes.startButton}
                                    appColor="linear"
                                    disabled={loading || !isValid}
                                    type="submit">
                                    Начать
                                </AppButton>
                            </div>
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