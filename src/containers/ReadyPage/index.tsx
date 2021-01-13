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

import { GetVaccines, GetAvailableStages, CreateVaccination, GetDiseases } from '../../server';
import { RootState } from '../../store';
import { Divider, Loader } from '../../components';



type ReadyPageProps = {

}

type Vaccine = {
    id: string
    name: string
    diseaseIds: number[]
}

type Diseas = {
    id: number
    name: string
}

type DiseasFull = {
    detailedShort: string
    detailedFull: string
    id: number
    name: string
    vaccines: Vaccine[]
}

type LocationDataArrived = {
    type: 'diseas' | 'vaccine'
    data: Diseas | Vaccine
}


export const ReadyPage: React.FC<ReadyPageProps> = (props) => {
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const history = useHistory();

    const routerData = useLocation<LocationDataArrived | undefined>().state;
    let arrivedVaccine: Vaccine | undefined;
    let arrivedDiseas: Diseas | undefined;

    // определяем откуда мы пришли и что нам передали
    if(routerData?.type == 'diseas') {
        arrivedDiseas = routerData.data as Diseas;
    } 
    if(routerData?.type == 'vaccine') {
        arrivedVaccine = routerData.data as Vaccine;
    } 

    // общие списки
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [diseases, setDiseases] = useState<Diseas[]>([]);
    const [stages, setStages] = useState<{ id: number, stage: number }[]>([]);

    const [selectedDate, handleDateChange] = useState(new Date());
    const [vaccine, setVaccine] = useState<Vaccine | null>(arrivedVaccine ?? null);
    const [diseas, setDiseas] = useState<Diseas | null>(arrivedDiseas ?? null);
    const [currentStage, setCurrentStage] = useState(0);

    const [errors, setErrors] = useState({
        'vaccine': '',
        'stage': '',
        'date': ''
    });

    // запросы
    const vaccinesRequest = useServer(GetVaccines);
    const stagesRequest = useServer(GetAvailableStages);
    const vaccinationRequest = useServer(CreateVaccination);
    const diseasRequest = useServer(GetDiseases);

    // загружаем все известные вакцины
    useEffect(() => {
        if (Boolean(arrivedVaccine)) {
            stagesRequest.fetch({ vaccineId: Number(arrivedVaccine?.id) });
        }
        vaccinesRequest.fetch(undefined);
        diseasRequest.fetch(undefined);

        return vaccinesRequest.cancel;
    }, []);


    // блок запросов
    const loading = vaccinesRequest.state.fetching || stagesRequest.state.fetching || vaccinationRequest.state.fetching || diseasRequest.state.fetching;
    const successVaccines = !loading && vaccinesRequest.state.answer.succeeded;
    const successStages = !loading && stagesRequest.state.answer.succeeded;
    const successVaccination = !loading && vaccinationRequest.state.answer.succeeded;
    const successDiseas = !loading && diseasRequest.state.answer.succeeded;

    // фильтруем вакцины по выбранной болезни
    let filteredVaccines: Vaccine[] = vaccines;
    if(Boolean(diseas)) {
        filteredVaccines = vaccines.filter((vaccine) => vaccine.diseaseIds.includes(Number(diseas?.id)) );
    }

    
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


    // пришли вакцины
    if (successVaccines) {
        setVaccines((vaccinesRequest.state.answer.data || []) as any);
        vaccinesRequest.reload();
    }

    // пришли стадии для вакцины
    if (successStages) {
        setStages(stagesRequest.state.answer.data || []);
        stagesRequest.reload();
    }

    // пришли болезни
    if(successDiseas) {
        setDiseases(diseasRequest.state.answer.data as Diseas[]);
        diseasRequest.reload();
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

                {diseasRequest.state.fetching &&
                    <Box marginY={2} height="78px"><Loader /></Box>}

                {!diseasRequest.state.fetching &&
                    <Box marginY={2}>
                        <Autocomplete
                            id="combo-region-main"
                            options={diseases}
                            getOptionLabel={(option) => option.name}
                            value={diseas}
                            fullWidth
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    helperText="найти вакцины по болезни"
                                    label="болезнь"
                                    variant="outlined" />
                            }
                            onChange={(event, newValue) => {
                                setDiseas(newValue);
                            }}
                        />
                    </Box>
                }


                {vaccinesRequest.state.fetching &&
                    <Box marginY={2} height="56px"><Loader /></Box>}

                {!vaccinesRequest.state.fetching &&
                    <Box marginY={2}>
                        <Autocomplete
                            id="combo-region-main"
                            options={filteredVaccines}
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