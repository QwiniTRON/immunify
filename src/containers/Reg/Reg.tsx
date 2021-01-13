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

import './reg.scss';

import { AppButton } from '../../components/UI/AppButton';
import { register } from '../../store/user/action';
import { RootState } from '../../store';
import { AppRadioGroup } from '../../components/UI/AppRadioGroup';
import { AppRadioButton } from '../../components/UI/AppRadioButton';
import { CreatePatient } from '../../server';
import { useServer } from '../../hooks/useServer';
import { appDataInit } from '../../store/appData/action';

import { useAccessToken } from '../../hooks/useAccessToken';
import { Divider } from '../../components';


type RegProps = {
    register: Function
    appDataInit: Function
}

const useStyle = makeStyles({
    sexLabel: {
        fontSize: 14
    },

    genderImg: {
        maxWidth: '100%'
    }
});


// todo или формик или переписать под декларатив
const Reg: React.FC<RegProps> = ({
    register,
    appDataInit
}) => {
    const clasess = useStyle();
    const history = useHistory();
    const { token } = useAccessToken();

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
    const [inputTouches, setInputTouches] = useState({
        name: false,
        age: false,
        sex: false
    });
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        appDataInit(token);
    }, []);

    useLayoutEffect(() => {
        if (success) {
            register(name, selectedDate?.getTime(), sex, addReq.state?.answer?.data?.id)
                .then(() => {
                    history.push(`/profile/${name.trim()}`);
                });
        } else if (addReq.state.answer.errorMessage) { }
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
            errors.name = 'имя должно быть не короче 2 символов';
            valid = false;
        } else if (!Boolean(selectedDate) && inputTouches.age) {
            errors.age = 'возраст обязателен';
            valid = false;
        } else if (!sexText && (inputTouches.name || inputTouches.age)) {
            errors.sex = 'пол обязателен';
            valid = false;
        }

        if (!inputTouches.name || !inputTouches.age || !inputTouches.sex) {
            valid = false;
        }
        setIsValid(valid);
        setErrors(errors);

        return [valid, errors]
    }


    useEffect(() => {
        validate();
    }, [sex, selectedDate]);

    /**
     * отправка данных для регистрации нового пользователя
     * 
     * @param e 
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        const [valid, errors] = validate();

        if (valid) {
            addReq.fetch(undefined);
        }
    }

    return (
        <div className="reg">
            <div className="reg__container">
                <h1 className="reg__title">
                    Ваши данные
                </h1>

                <Divider />

                <p className="reg__desc">
                    Узнайте каким рискам
                    вы подвержены и устраните их
                </p>

                <form className="reg__form" onSubmit={handleSubmit}>

                    <Typography color="error">{errors.sex}</Typography>
                    <Box display="flex" justifyContent="space-evenly" marginBottom={3}>
                        <AppRadioGroup onChange={(value: string) => {
                            setInputTouches(Object.assign({}, inputTouches, { sex: true }));
                            setSex(value);
                        }}
                            value={sex}
                        >
                            <AppRadioButton value="man"
                                text="Мужчина"
                                component={
                                    (
                                        <img src={ManImg} className={clasess.genderImg} />
                                    )
                                }
                            />
                            <AppRadioButton value="woman"
                                text="Женщина"
                                component={
                                    (
                                        <img src={WomanImg} className={clasess.genderImg} />
                                    )
                                }
                            />
                        </AppRadioGroup>
                    </Box>

                    <TextField
                        label="введите имя"
                        id="name-field"
                        variant="outlined"
                        className="reg__input"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setName(e.target.value);
                            setInputTouches(Object.assign({}, inputTouches, { name: true }));
                        }}
                        onBlur={validate}
                        error={Boolean(errors.name)}
                        helperText={errors.name} />


                    <Box mb={2}>
                        <Box className="error">{errors.age}</Box>
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
                                onBlur={validate}
                                onFocus={() => setInputTouches(Object.assign({}, inputTouches, { age: true }))}
                            />
                        </MuiPickersUtilsProvider>
                    </Box>

                    <AppButton disabled={loading || !isValid} type="submit" className="reg_start" appColor="linear">
                        Начать
                    </AppButton>
                </form>
            </div>
        </div>
    );
};

const mapStateToProps = (state: RootState) => ({
});
const mapDispatchToProps = {
    register,
    appDataInit
}
const connectedReg = connect(mapStateToProps, mapDispatchToProps)(Reg);
export { connectedReg as Reg };