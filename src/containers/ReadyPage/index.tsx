import React, { useState, useEffect } from 'react';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import ruLocale from "date-fns/locale/ru";
import DateFnsUtils from '@date-io/date-fns';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import FormHelperText from '@material-ui/core/FormHelperText';
import Box from '@material-ui/core/Box';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import './readypage.scss';

import { PageLayout } from '../../components/UI/PageLayout';
import { AppButton } from '../../components/UI/AppButton';
import { Layout } from '../../components/Layout/Layout';
import { BackButton } from '../../components/BackButton';

import { useServer } from '../../hooks/useServer';

import { GetVaccines, GetAvailableStages, CreateVaccination } from '../../server';
import { RootState } from '../../store';
import { Divider, Loader } from '../../components';



type ReadyPageProps = {

}

type Vaccine = {
    id: string
    name: string
}


export const ReadyPage: React.FC<ReadyPageProps> = (props) => {
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const history = useHistory();
    const routerData = useLocation<Vaccine | undefined>();
    const arrivedVaccine = routerData.state;

    const [selectedDate, handleDateChange] = useState(new Date());
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [stages, setStages] = useState<{ id: number, stage: number }[]>([]);
    const [vaccine, setVaccine] = useState<Vaccine | null>(arrivedVaccine ?? null);
    const [currentStage, setCurrentStage] = useState(0);
    const [errors, setErrors] = useState({
        'vaccine': '',
        'stage': '',
        'date': ''
    });

    const vaccinesRequest = useServer(GetVaccines);
    const stagesRequest = useServer(GetAvailableStages);
    const vaccinationRequest = useServer(CreateVaccination);
    const diseasRequest = useServer(CreateVaccination);

    // загружаем все известные вакцины
    useEffect(() => {
        if (Boolean(arrivedVaccine)) {
            stagesRequest.fetch({ vaccineId: Number(arrivedVaccine?.id) });
        }
        vaccinesRequest.fetch(undefined);

        return vaccinesRequest.cancel;
    }, []);


    const loading = vaccinesRequest.state.fetching || stagesRequest.state.fetching || vaccinationRequest.state.fetching;
    const successVaccines = !loading && vaccinesRequest.state.answer.succeeded;
    const successStages = !loading && stagesRequest.state.answer.succeeded;
    const successVaccination = !loading && vaccinationRequest.state.answer.succeeded;


    /**
     * валидация
     */
    const validate = () => {
        let isValid = true;
        const clearedErrors = {
            'vaccine': '',
            'stage': '',
            'date': ''
        }
        if (!vaccine) {
            clearedErrors['vaccine'] = 'сначала выбирите вакцину';
            isValid = false;
            return [isValid, clearedErrors];
        }
        if (!currentStage) {
            clearedErrors['stage'] = 'выбирите какая вакцина по счёту';
            isValid = false;
            return [isValid, clearedErrors];
        }
        if (!selectedDate) {
            clearedErrors['date'] = 'укажите дату вакцинации';
            isValid = false;
            return [isValid, clearedErrors];
        }

        return [isValid, clearedErrors];
    }

    /**
     * сохранение пройденных заявок
     */
    const saveHandle = () => {
        const [isValid, errors] = validate();

        if (!isValid) {
            return setErrors(errors as any);
        }

        vaccinationRequest.fetch({
            patientId: Number(currentUser?.id),
            stageId: currentStage,
            date: selectedDate,
        });
    }


    if (successVaccines) {
        setVaccines((vaccinesRequest.state.answer.data || []) as any);
        vaccinesRequest.reload();
    }

    if (successStages) {
        setStages(stagesRequest.state.answer.data || []);
        stagesRequest.reload();
    }

    // после ввода просто делаем переадресация на риски
    if (successVaccination) {
        history.push(`/vaccination`);
        vaccinationRequest.reload();
    }

    return (
        <Layout title="" BackButtonCustom={<BackButton simpleBack routeText />}>
            <PageLayout className="ready-page">
                <Box fontSize={24} fontWeight={500}>Прошедшие вакцинации</Box>

                <Divider />

                {vaccinesRequest.state.fetching &&
                    <Box marginY={2} height="56px"><Loader /></Box>}

                {!vaccinesRequest.state.fetching &&
                    <Box marginY={2}>
                        <Autocomplete
                            id="combo-region-main"
                            options={vaccines}
                            getOptionLabel={(option) => option.name}
                            value={vaccine}
                            fullWidth
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    helperText={errors.vaccine}
                                    error={Boolean(errors.vaccine)}
                                    label="укажите вакцину"
                                    variant="outlined" />
                            }
                            onChange={(event, newValue) => {
                                stagesRequest.cancel();
                                stagesRequest.fetch({ vaccineId: Number(newValue?.id) });
                                setErrors(Object.assign({}, errors, { 'vaccine': '' }));
                                setVaccine(newValue);
                            }}
                        />
                    </Box>
                }

                {stagesRequest.state.fetching && <Box mb="30px" height="59px"><Loader /></Box>}
                {!stagesRequest.state.fetching && <FormControl
                    variant="outlined"
                    fullWidth
                    className={'ready-page__input'}
                    error={Boolean(errors.stage)}>

                    <InputLabel htmlFor="filled-age-native-simple">какая по счёту</InputLabel>
                    <Select
                        native
                        label="какая по счёту"
                        value={currentStage}
                        onChange={(e) => setCurrentStage(Number(e.target.value))}
                        inputProps={{
                            name: 'region',
                            id: 'filled-age-native-simple',
                        }}
                        disabled={!Boolean(vaccine)}
                    >
                        <option aria-label="None" value="" />
                        {stages.map((stage) => (
                            <option value={stage.id} key={stage.id}>
                                {stage.stage}
                            </option>
                        ))}
                    </Select>
                    <FormHelperText>{errors.stage}</FormHelperText>
                </FormControl>}

                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                    <DatePicker
                        label="дата последней вакцинации"
                        value={selectedDate}
                        onChange={handleDateChange as any}
                        fullWidth
                        cancelLabel="отмена"
                        format="d MMM yyyy"
                        disableFuture
                        inputVariant="outlined"
                        clearable
                        error={Boolean(errors.date)}
                        helperText={errors.date}
                    />
                </MuiPickersUtilsProvider>

                <div className="btns centred">
                    <AppButton className="ready-page__start" onClick={saveHandle} disabled={loading}>
                        Сохранить
                    </AppButton>
                </div>
            </PageLayout>
        </Layout>
    );
};