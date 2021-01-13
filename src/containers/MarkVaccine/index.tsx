import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppButton, BackButton, Layout, Loader, PageLayout } from '../../components';
import { useHistory, useLocation } from 'react-router-dom';
import FormHelperText from '@material-ui/core/FormHelperText';
import Box from '@material-ui/core/Box';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

import { useServer } from '../../hooks/useServer';
import { GetVaccines, GetAvailableStages, CreateManyVaccination, GetDiseases } from '../../server';
import { CircleLoader } from '../../components/UI/CircleLoader';
import { s } from '../../utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';


type MarkVaccineProps = {

}

type Visit = {
    date: string
    hospital: {
        id: number,
        name: string
    }
    id: number
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


const useStyles = makeStyles({
    commandLine: {
        position: 'relative',
        height: 30,
        paddingTop: 14
    },

    pageContent: {
        paddingBottom: 75
    },

    addButton: {
        padding: 1,
        backgroundColor: '#9BC83F',
        display: 'inline-block',
        borderRadius: 15,
        width: 30,
        height: 30,
        lineHeight: '43px',
        textAlign: 'center',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translateX(-50%) translateY(-50%)',

        '& svg': {
            color: '#fff'
        }
    },

    button__red: {
        backgroundColor: '#FF003D'
    },

    line: {
        height: 1,
        backgroundColor: '#DADADA'
    },
});


type VaccinePickerProps = {
    vaccines: Vaccine[]
    status: MarkedVaccine
    editHandle: Function
    diseases: Diseas[]
}

const VaccinePicker: React.FC<VaccinePickerProps> = ({
    vaccines,
    status,
    editHandle,
    diseases
}) => {
    const [stages, setStages] = useState<{ id: number, stage: number }[]>([]);
    const [diseas, setDiseas] = useState<Diseas | null>(null);

    // запрос стадий
    const stagesRequest = useServer(GetAvailableStages);

    // блок запросов
    const successStages = !stagesRequest.state.fetching && stagesRequest.state.answer.succeeded;
    const loading = stagesRequest.state.fetching;

    // валидация поля stage
    const stageError = status.vaccine && !status.stage;

    // пришли стадии для вакцины
    if (successStages) {
        setStages(stagesRequest.state.answer.data || []);
        stagesRequest.reload();
    }

    // фильтрация вакцин по болезни
    let filteredVaccines: Vaccine[] = vaccines;
    if (Boolean(diseas)) {
        filteredVaccines = vaccines.filter((vaccine) => vaccine.diseaseIds.includes(Number(diseas?.id)));
    }


    return (
        <div>
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

            <Box marginY={3}>
                <Autocomplete
                    options={filteredVaccines}
                    getOptionLabel={(option) => option.name}
                    value={status.vaccine}
                    fullWidth
                    renderInput={(params) =>
                        <TextField
                            {...params}
                            helperText={Boolean(status.vaccine) || 'нужно указать вакцину'}
                            error={!Boolean(status.vaccine)}
                            label="укажите вакцину"
                            variant="outlined" />
                    }
                    onChange={(event, newValue) => {
                        stagesRequest.cancel();
                        stagesRequest.fetch({ vaccineId: Number(newValue?.id) });
                        editHandle(Object.assign(status, { vaccine: newValue }));
                    }}
                />
            </Box>

            <Box marginY={3}>
                {loading &&
                    <Box marginY={3} height="78px">
                        <Loader />
                    </Box>
                }

                {!loading &&
                    <FormControl
                        variant="outlined"
                        fullWidth
                        error={stageError}
                        disabled={!Boolean(status.vaccine)}>

                        <InputLabel htmlFor="filled-age-native-simple">какая по счёту</InputLabel>
                        <Select
                            native
                            label="какая по счёту"
                            value={status.stage?.id}
                            onChange={(e) => editHandle(Object.assign(status, { stage: stages.find(stage => stage.id == e.target.value) }))}
                        >
                            <option aria-label="None" value="" />
                            {stages.map((stage) => (
                                <option value={stage.id} key={stage.id}>
                                    {stage.stage}
                                </option>
                            ))}
                        </Select>
                        <FormHelperText>{stageError && 'укажите стадию'}</FormHelperText>
                    </FormControl>
                }
            </Box>
        </div>
    );
}

type MarkedVaccine = {
    vaccine?: Vaccine
    stage?: { id: number, stage: number }
}

export const MarkVaccine: React.FC<MarkVaccineProps> = (props) => {
    const classes = useStyles();
    const visit: Visit | undefined = useLocation().state as Visit;
    const history = useHistory();
    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [diseases, setDiseases] = useState<Diseas[]>([]);
    const [markedVaccines, setMarkedVaccines] = useState<MarkedVaccine[]>([
        {
            vaccine: undefined,
            stage: undefined
        }
    ]);
    const [error, setError] = useState('');

    // запросы
    const vaccinesRequest = useServer(GetVaccines);
    const vaccinationRequest = useServer(CreateManyVaccination);
    const diseasRequest = useServer(GetDiseases);

    // блок запросов
    const loading = vaccinesRequest.state.fetching || diseasRequest.state.fetching;
    const vaccinationCreateLoading = vaccinationRequest.state.fetching;
    const successVaccination = !vaccinationRequest.state.fetching && vaccinationRequest.state.answer.succeeded;
    const successVaccines = !loading && vaccinesRequest.state.answer.succeeded;
    const successDiseas = !loading && diseasRequest.state.answer.succeeded;


    // загружаем все известные вакцины
    useEffect(() => {
        vaccinesRequest.fetch(undefined);
        diseasRequest.fetch(undefined);

        return vaccinesRequest.cancel;
    }, []);

    // пришли вакцины
    if (successVaccines) {
        setVaccines((vaccinesRequest.state.answer.data || []) as any);
        vaccinesRequest.reload();
    }

    // пришли болезни
    if (successDiseas) {
        setDiseases(diseasRequest.state.answer.data as Diseas[]);
        diseasRequest.reload();
    }

    // вакцинации сохранены
    if (successVaccination) {
        history.push('/vaccination');
    }

    /**
     * добавление новой записи пройденной вакцинации
     */
    const addMark = () => {
        setMarkedVaccines(markedVaccines.concat({
            vaccine: undefined,
            stage: undefined
        }));
    }

    /**
     *  удаление прохождения из итогов
     * 
     * @param {number} markIdx индекс вакцинации
     */
    const deleteMark = (markIdx: number) => {
        setMarkedVaccines(markedVaccines.reduce((result: MarkedVaccine[], mark, idx) => {
            if (markIdx != idx) result.push(mark);

            return result;
        }, []));
    }

    /**
     * изменить состояние вакцинации
     * 
     * @param {newMark} newMark новое состояние прохождения
     * @param {number} markIdx индекс вакцинации
     */
    const editMark = (newMark: MarkedVaccine, markIdx: number) => {
        const newState = markedVaccines.map((mark, idx) => {
            if (markIdx == idx) return newMark;
            return mark;
        })

        const isInvalidVaccine = chekMarksValid(newState);

        if (!isInvalidVaccine) setError('');

        setMarkedVaccines(newState);
    }

    /**
     * сохранение пройденных прививок
     */
    const saveHandle = () => {
        const isInvalidVaccine = chekMarksValid(markedVaccines);

        if (isInvalidVaccine) {
            return setError('пожалуйста заполните все поля');
        }

        setError('');

        const stagesIds = markedVaccines.map((mark) => Number(mark?.stage?.id));


        vaccinationRequest.fetch({
            hospitalVisitId: visit.hospital.id,
            patientId: Number(currentUser?.id),
            stagesIds: stagesIds
        });
    }

    // если нет переданного визита, то просто переносим пользователя на календарь
    if (Boolean(visit) == false) history.push('/calendar');


    return (
        <Layout title="" BackButtonCustom={<BackButton simpleBack />}>
            <PageLayout>
                <Box p="20px" className={classes.pageContent}>
                    {(loading || vaccinationCreateLoading) && <Box textAlign="center"><CircleLoader /></Box>}

                    {!loading && !vaccinationCreateLoading &&
                        <div>
                            <Box mb={2} fontSize={24} fontWeight={500}>Проведенные вакцинации</Box>

                            {error}

                            {
                                markedVaccines.map((mark, idx) => {
                                    return (
                                        <div key={idx}>
                                            {idx > 0 &&
                                                (
                                                    <div
                                                        className={classes.commandLine}
                                                        onClick={() => deleteMark(idx)}>
                                                        <div className={classes.line} />
                                                        <div className={s(classes.addButton, classes.button__red)}>
                                                            <RemoveIcon />
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            <VaccinePicker
                                                status={mark}
                                                vaccines={vaccines}
                                                editHandle={(newState: MarkedVaccine) => editMark(newState, idx)}
                                                diseases={diseases}
                                            />
                                        </div>
                                    );
                                })
                            }


                            <div>
                                <Box fontSize={16} fontWeight={300} textAlign="center" mb={1}>
                                    {markedVaccines.length > 1 ?
                                        "добавить ещё" : "Мне сделали несколько прививок?"
                                    }

                                </Box>

                                <div className={classes.commandLine}>
                                    <div className={classes.line} />
                                    <div className={classes.addButton} onClick={addMark}>
                                        <AddIcon />
                                    </div>
                                </div>
                            </div>

                            <AppButton floated onClick={saveHandle}>
                                Сохранить
                            </AppButton>
                        </div>
                    }
                </Box>
            </PageLayout>
        </Layout>
    );
}


function chekMarksValid(marks: MarkedVaccine[]): boolean {
    return marks.some((mark) => !mark.stage || !mark.vaccine);
}