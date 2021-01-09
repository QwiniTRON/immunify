import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { BackButton, Layout, PageLayout } from '../../components';
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
}

const VaccinePicker: React.FC<VaccinePicker> = ({
    vaccines,
    status
}) => {
    const [currentStage, setCurrentStage] = useState(0);
    const [stages, setStages] = useState<{ id: number, stage: number }[]>([]);
    const [vaccine, setVaccine] = useState<Vaccine | null>(null);

    const stagesRequest = useServer(GetAvailableStages);

    const successStages = !stagesRequest.state.fetching && stagesRequest.state.answer.succeeded;

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
                    value={vaccine}
                    fullWidth
                    renderInput={(params) =>
                        <TextField
                            {...params}
                            helperText={status.vaccineId || 'нужно указать вакцину'}
                            error={Boolean(status.vaccineId)}
                            label="укажите вакцину"
                            variant="outlined" />
                    }
                    onChange={(event, newValue) => {
                        stagesRequest.cancel();
                        stagesRequest.fetch({ vaccineId: Number(newValue?.id) });
                        setVaccine(newValue);
                    }}
                />
            </Box>

            <Box marginY={3}>
                <FormControl
                    variant="outlined"
                    fullWidth
                    error={Boolean(status.stage)}
                    disabled={!Boolean(vaccine)}>

                    <InputLabel htmlFor="filled-age-native-simple">какая по счёту</InputLabel>
                    <Select
                        native
                        label="какая по счёту"
                        value={currentStage}
                        onChange={(e) => setCurrentStage(Number(e.target.value))}
                    >
                        <option aria-label="None" value="" />
                        {stages.map((stage) => (
                            <option value={stage.id} key={stage.id}>
                                {stage.stage}
                            </option>
                        ))}
                    </Select>
                    <FormHelperText>{status.stage || 'укажите стадию'}</FormHelperText>
                </FormControl>
            </Box>
        </div>
    );
}

type MarkedVaccine = {
    vaccineId?: number
    stage?: number
}

export const MarkVaccine: React.FC<MarkVaccineProps> = (props) => {
    const classes = useStyles();
    const visit = useLocation().state;
    const history = useHistory();

    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [markedVaccines, setMarkedVaccines] = useState<MarkedVaccine[]>([
        {
            vaccineId: undefined,
            stage: undefined
        }
    ]);

    const vaccinesRequest = useServer(GetVaccines);
    const stagesRequest = useServer(GetAvailableStages);
    const vaccinationRequest = useServer(CreateVaccination);

    const loading = vaccinesRequest.state.fetching || vaccinationRequest.state.fetching;
    const successVaccines = !loading && vaccinesRequest.state.answer.succeeded;

    const successVaccination = !loading && vaccinationRequest.state.answer.succeeded;


    // загружаем все известные вакцины
    useEffect(() => {
        vaccinesRequest.fetch(undefined);

        return vaccinesRequest.cancel;
    }, []);

    if (successVaccines) {
        setVaccines((vaccinesRequest.state.answer.data || []) as any);
        vaccinesRequest.reload();
    }


    if (Boolean(visit) == false) history.push('/calendar');


    return (
        <Layout title="" BackButtonCustom={<BackButton simpleBack />}>
            <PageLayout>
                <Box p="20px">
                    {loading && <Box textAlign="center"><CircleLoader /></Box>}

                    {!loading &&
                        <div>
                            <Box mb={2} fontSize={24} fontWeight={500}>Проведенные вакцинации</Box>

                            <div className={classes.commandLine}>
                                <div className={classes.line} />
                                <div className={s(classes.addButton, classes.button__red)}>
                                    <RemoveIcon />
                                </div>
                            </div>
                            <VaccinePicker status={markedVaccines[0]} vaccines={vaccines} />

                            <div className={classes.commandLine}>
                                <div className={classes.line} />
                                <div className={classes.addButton}>
                                    <AddIcon />
                                </div>
                            </div>
                        </div>
                    }
                </Box>
            </PageLayout>
        </Layout>
    );
}