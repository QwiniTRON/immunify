import React, { useState, useEffect } from 'react';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import ruLocale from "date-fns/locale/ru";
import DateFnsUtils from '@date-io/date-fns';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import './readypage.scss';

import { PageLayout } from '../../components/UI/PageLayout';
import { AppButton } from '../../components/UI/AppButton';
import { Layout } from '../../components/Layout/Layout';
import { BackButton } from '../../components/BackButton';

import { useServer } from '../../hooks/useServer';

import { GetVaccines, GetAvailableStages, CreateVaccination } from '../../server';
import { RootState } from '../../store';

type ReadyPageProps = {

}


export const ReadyPage: React.FC<ReadyPageProps> = (props) => {
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const history = useHistory();

    const [selectedDate, handleDateChange] = useState(new Date());
    const [vaccines, setVaccines] = useState<{ id: number, name: string }[]>([]);
    const [stages, setStages] = useState<{ id: number, stage: number }[]>([]);
    const [vaccine, setVaccine] = useState(0);
    const [currentStage, setCurrentStage] = useState(0);

    const vaccinesRequest = useServer(GetVaccines);
    const stagesRequest = useServer(GetAvailableStages);
    const vaccinationRequest = useServer(CreateVaccination);

    useEffect(() => {
        vaccinesRequest.fetch(undefined);

        return vaccinesRequest.cancel;
    }, []);

    const loading = vaccinesRequest.state.fetching || stagesRequest.state.fetching || vaccinationRequest.state.fetching;
    const successVaccines = !loading && vaccinesRequest.state.answer.succeeded;
    const successStages = !loading && stagesRequest.state.answer.succeeded;
    const successVaccination = !loading && vaccinationRequest.state.answer.succeeded;

    if (successVaccines) {
        setVaccines(vaccinesRequest.state.answer.data || []);
        vaccinesRequest.reload();
    }

    if (successStages) {
        setStages(stagesRequest.state.answer.data || []);
        stagesRequest.reload();
    }

    if (successVaccination) {
        history.push('/vaccination');
        vaccinationRequest.reload();
    }

    // после ввода просто делаем переадресация на риски
    return (
        <Layout title="" BackButtonCustom={<BackButton text="Вернуться к заболеванию" />}>
            <PageLayout className="ready-page">
                <p className="ready-page__text">Добавьте даные о вакцинах</p>
                <FormControl variant="outlined" fullWidth className={'ready-page__input'}>
                    <InputLabel htmlFor="filled-age-native-simple">вакцина</InputLabel>
                    <Select
                        native
                        value={vaccine}
                        onChange={(e) => {
                            const val = Number(e.target.value);

                            stagesRequest.cancel();
                            stagesRequest.fetch({ vaccineId: val });

                            setVaccine(val);
                        }}
                        inputProps={{
                            name: 'region',
                            id: 'filled-age-native-simple',
                        }}
                        label="вакцина"
                    >
                        <option aria-label="None" value="" />
                        {vaccines.map((vac) => (
                            <option value={vac.id} key={vac.id}>
                                {vac.name}
                            </option>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="outlined" fullWidth className={'ready-page__input'}>
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
                    >
                        <option aria-label="None" value="" />
                        {stages.map((stage) => (
                            <option value={stage.id} key={stage.id}>
                                {stage.stage}
                            </option>
                        ))}
                    </Select>
                </FormControl>
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
                    />
                </MuiPickersUtilsProvider>

                <AppButton floated onClick={() => {
                    vaccinationRequest.fetch({
                        patientId: Number(currentUser?.id),
                        stageId: currentStage,
                        date: selectedDate,
                    });
                }}>
                    Сохранить
                </AppButton>
            </PageLayout>
        </Layout>
    );
};