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


type RegionProps = {

}


export const Region: React.FC<RegionProps> = (props) => {
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const isEmptyFamily = useIsEmptyFamily();
    const pathToBack = isEmptyFamily ? '/profile' : `/profile/${currentUser?.name}`;
    const dispatch = useDispatch();

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

        setErrors(Object.assign({}, errors, { workRegion: '', region: '' }))
        let regionToSave = region;
        if (!otherWork) region.work = '';

        (dispatch(updateCurrentUserData({ region: regionToSave })) as any)
            .then((r: any) => {
                setOpen(true);
            });
    }

    const top100Films = [
        'Регион 1',
        'Регион 2',
        'Регион 3',
        'Регион 4',
        'Регион 5',
        'Регион 6',
        'Регион 7',
        'Регион 8',
        'Регион 9',
        'Регион 10',
        'Регион 11',
        'Регион 12',
        'Регион 13'
    ];


    return (
        <Layout title="" BackButtonCustom={<BackButton text="Вернуться в профиль" to={pathToBack} />} >
            <PageLayout className="region-page">
                <h4 className="region-page__title">В каком регионе Вы проживаете?</h4>

                <Typography color="error">{errors.region}</Typography>
                <Autocomplete
                    id="combo-region-main"
                    options={top100Films}
                    getOptionLabel={(option) => option}
                    value={region?.main}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="выбирите регион" variant="outlined" />}
                    onChange={(event, newValue) => {
                        console.log(newValue);
                        
                        setRegion(Object.assign({}, region, { main: newValue }));
                    }}
                />

                {otherWork &&
                    <Box mt={2}>
                        <h4 className="region-page__title">В каком регионе Вы работаете?</h4>
                        <Typography color="error">{errors.workRegion}</Typography>
                        <Autocomplete
                            id="combo-region-work"
                            options={top100Films}
                            getOptionLabel={(option) => option}
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