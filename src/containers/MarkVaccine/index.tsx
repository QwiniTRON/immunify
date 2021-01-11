import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppButton, BackButton, Layout, PageLayout } from '../../components';
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
import { GetVaccines, GetAvailableStages, CreateVaccination } from '../../server';
import { CircleLoader } from '../../components/UI/CircleLoader';
import { s } from '../../utils';


type MarkVaccineProps = {

}

type Vaccine = {
    id: string
    name: string
}

const useStyles = makeStyles({
    commandLine: {
        position: 'relative',
        height: 30,
        paddingTop: 14
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
    }
});


type VaccinePicker = {
    vaccines: Vaccine[]
    status: MarkedVaccine
    editHandle: Function
}

const VaccinePicker: React.FC<VaccinePicker> = ({
    vaccines,
    status,
    editHandle
}) => {
    const [stages, setStages] = useState<{ id: number, stage: number }[]>([]);

    const stagesRequest = useServer(GetAvailableStages);

    const successStages = !stagesRequest.state.fetching && stagesRequest.state.answer.succeeded;

    const stageError = status.vaccine && !status.stage;

    if (successStages) {
        setStages(stagesRequest.state.answer.data || []);
        stagesRequest.reload();
    }


    return (
        <div>
            <Box marginY={3}>
                <Autocomplete
                    options={vaccines}
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
                <FormControl
                    variant="outlined"
                    fullWidth
                    error={stageError}
                    disabled={!Boolean(status.vaccine)}>

                    <InputLabel htmlFor="filled-age-native-simple">какая по счёту</InputLabel>
                    <Select
                        native
                        label="какая по счёту"
                        value={status.stage}
                        onChange={(e) => editHandle(Object.assign(status, { stage: e.target.value }))}
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
            </Box>
        </div>
    );
}

type MarkedVaccine = {
    vaccine?: Vaccine
    stage?: number
}

export const MarkVaccine: React.FC<MarkVaccineProps> = (props) => {
    const classes = useStyles();
    const visit = useLocation().state;
    const history = useHistory();

    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [markedVaccines, setMarkedVaccines] = useState<MarkedVaccine[]>([
        {
            vaccine: undefined,
            stage: undefined
        }
    ]);
    const [error, setError] = useState('');

    const vaccinesRequest = useServer(GetVaccines);
    const vaccinationRequest = useServer(CreateVaccination);

    const loading = vaccinesRequest.state.fetching || vaccinationRequest.state.fetching;
    const successVaccines = !loading && vaccinesRequest.state.answer.succeeded;


    // загружаем все известные вакцины
    useEffect(() => {
        vaccinesRequest.fetch(undefined);

        return vaccinesRequest.cancel;
    }, []);

    if (successVaccines) {
        setVaccines((vaccinesRequest.state.answer.data || []) as any);
        vaccinesRequest.reload();
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
            setError('пожалуйста заполните все поля');
        } else {
            setError('');
        }

        // отправка
    }

    // если нет переданного визита, то просто переносим пользователя на календарь
    if (Boolean(visit) == false) history.push('/calendar');


    return (
        <Layout title="" BackButtonCustom={<BackButton simpleBack />}>
            <PageLayout>
                <Box p="20px">
                    {loading && <Box textAlign="center"><CircleLoader /></Box>}

                    {!loading &&
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