import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { useSelector, useDispatch } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Snackbar from '@material-ui/core/Snackbar';
import Box from '@material-ui/core/Box';
import MuiAlert from '@material-ui/lab/Alert';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import './region.scss';

import { PageLayout } from '../../components/UI/PageLayout';
import { AppButton } from '../../components/UI/AppButton';
import { updateCurrentUserData } from '../../store/user/action';
import { RootState } from '../../store';
import { Layout } from '../../components/Layout/Layout';
import { useIsEmptyFamily } from '../../hooks';
import { BackButton } from '../../components/BackButton';
import { Region as RegionType } from '../../type';
import { useReactOidc } from '@axa-fr/react-oidc-context';
import { claculateRisks } from '../../store/appData/action';



type RegionProps = {}


const top100Films: RegionType[] = [
    { id: 1, name: 'профессия 1' },
    { id: 2, name: 'профессия 2' },
    { id: 3, name: 'профессия 3' },
    { id: 4, name: 'профессия 4' },
    { id: 5, name: 'профессия 5' },
    { id: 6, name: 'профессия 6' },
    { id: 7, name: 'профессия 7' },
    { id: 8, name: 'профессия 8' },
    { id: 9, name: 'профессия 9' },
    { id: 10, name: 'профессия 10' }
];

export const Region: React.FC<RegionProps> = (props) => {
    const dispatch = useDispatch();
    const { oidcUser } = useReactOidc();

    const regions = useSelector((state: RootState) => state.appData.regions) ?? [];
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const isEmptyFamily = useIsEmptyFamily();
    const pathToBack = isEmptyFamily ? '/profile' : `/profile/${currentUser?.name}`;

    const [open, setOpen] = useState(false);
    const [region, setRegion] = useState(currentUser?.data?.region!);
    const [otherWork, setOtherWork] = useState(Boolean(region?.work));
    const [errors, setErrors] = useState({
        region: '',
        workRegion: ''
    });

    const handleEdit = () => {
        if (!region.main) return setErrors(Object.assign({}, errors, { region: '* укажите регион' }));
        if (otherWork && !region.work) return setErrors(Object.assign({}, errors, { workRegion: '* укажите регоин' }));

        setErrors({ workRegion: '', region: '' })
        let regionToSave = region;
        if (!otherWork) region.work = undefined;

        (dispatch(updateCurrentUserData({ region: regionToSave })) as any)
            .then((r: any) => {
                setOpen(true);
                dispatch(claculateRisks(oidcUser.access_token));
            });
    }


    return (
        <Layout title="" BackButtonCustom={<BackButton text="Вернуться в профиль" to={pathToBack} />} >
            <PageLayout className="region-page">
                <h4 className="region-page__title">В каком регионе Вы проживаете?</h4>

                <Typography color="error">{errors.region}</Typography>
                <Autocomplete
                    id="combo-region-main"
                    options={regions}
                    getOptionLabel={(option) => option.name}
                    value={region?.main}
                    fullWidth
                    renderInput={(params) =>
                        <TextField
                            {...params}
                            helperText={errors.region}
                            error={Boolean(errors.region)}
                            label="выбирите регион"
                            variant="outlined" />
                    }
                    onChange={(event, newValue) => {
                        setRegion(Object.assign({}, region, { main: newValue }));
                    }}
                />

                {otherWork &&
                    <Box mt={2}>
                        <h4 className="region-page__title">В каком регионе Вы работаете?</h4>
                        <Typography color="error">{errors.workRegion}</Typography>
                        <Autocomplete
                            id="combo-region-work"
                            options={regions}
                            getOptionLabel={(option) => option.name}
                            value={region?.work}
                            fullWidth
                            renderInput={(params) => <TextField {...params} label="выбирите регион" variant="outlined" />}
                            onChange={(event, newValue) => {
                                setRegion(Object.assign({}, region, { work: newValue }));
                            }}
                        />
                    </Box>
                }


                <FormControlLabel className="region-page__work"
                    control={
                        <Checkbox
                            checked={otherWork}
                            onChange={(e) => setOtherWork(e.target.checked)}
                            color="primary"
                        />}
                    label="Я работаю в другом регионе"
                />


                <div className="region-page__btns">
                    <AppButton className="region-page__save" color="default">отмена</AppButton>
                    <AppButton className="region-page__save" onClick={handleEdit}>сохранить</AppButton>
                </div>

                <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
                    <MuiAlert onClose={() => setOpen(false)} elevation={6} variant="filled">
                        данные сохранены.
                    </MuiAlert>
                </Snackbar>
            </PageLayout>
        </Layout >
    );
};