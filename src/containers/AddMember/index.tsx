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

import { AppButton } from '../../components/UI/AppButton';
import { addMember } from '../../store/user/action';
import { RootState } from '../../store';
import { Layout } from '../../components/Layout/Layout';
import { AppRadioGroup } from '../../components/UI/AppRadioGroup';
import { AppRadioButton } from '../../components/UI/AppRadioButton';
import { s } from '../../utils/Styels';
import { BackButton } from '../../components/BackButton';
import { useServer } from '../../hooks/useServer';
import { CreatePatient } from '../../server';
import { Loader } from '../../components/UI/Loader';

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
    sexInput: {
        fontSize: 36,
        flexGrow: 1
    },
    _sexInputMarginRight: {
        marginRight: 15
    }
});

const AddMember: React.FC<AddMemberProps> = ({
    addMember
}) => {
    const clasess = useStyle();
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
        <Layout title="" BackButtonCustom={<BackButton text="вернуться в профиль" />}>
            <div className={"reg " + clasess.root}>
                <div className="reg__container">
                    <h1 className="reg__title">
                        Добавление члена семьи
                    </h1>

                    {loading ? <Loader /> :

                        <form className="reg__form" onSubmit={handleSubmit}>
                            <Typography color="error">{errors.name}</Typography>
                            <TextField
                                label="как зовут"
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

                            <Box fontSize={16} fontWeight="bold" mb={1}>пол</Box>
                            <Typography color="error">{errors.sex}</Typography>
                            <Box display="flex" justifyContent="space-between">
                                <AppRadioGroup onChange={(value: string) => {
                                    setSex(value);
                                }}
                                    value={sex}
                                >
                                    <AppRadioButton value="man" text="М" classes={{ root: s(clasess.sexInput, clasess._sexInputMarginRight) }} />
                                    <AppRadioButton value="woman" text="Ж" classes={{ root: clasess.sexInput }} />
                                </AppRadioGroup>
                            </Box>


                            <AppButton
                                floated
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