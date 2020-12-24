import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import './region.scss';

import { PageLayout } from '../../components/UI/PageLayout';
import { AppButton } from '../../components/UI/AppButton';
import { RootState } from '../../store';
import { updateCurrentUserData } from '../../store/user/action';
import { Layout } from '../../components/Layout/Layout';
import { BackButton } from '../../components/BackButton';
import { useIsEmptyFamily } from '../../hooks';


type ProfessionProps = {

}

export const Profession: React.FC<ProfessionProps> = (props) => {
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const isEmptyFamily = useIsEmptyFamily();
    const pathToBack = isEmptyFamily ? '/profile' : `/profile/${currentUser?.name}`;
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [profession, setProfession] = useState(currentUser?.data?.profession);
    const [errors, setErrors] = useState({
        profession: ''
    });

    const handleEdit = () => {
        if (!profession) return setErrors({ profession: '* укажите профессию' });
        (dispatch(updateCurrentUserData({ profession })) as any)
            .then((r: any) => {
                setOpen(true);
            });
    }

    const top100Films = [
        'профессия 1',
        'профессия 2',
        'профессия 3',
        'профессия 4',
        'профессия 5',
        'профессия 6',
        'профессия 7',
        'профессия 8',
        'профессия 9',
        'профессия 10',
        'профессия 11',
        'профессия 12',
        'профессия 13'
    ];

    return (
        <Layout title="выбор профессии" BackButtonCustom={<BackButton to={pathToBack} />} >
            <PageLayout className="profession-page">
                <h4 className="region-page__title">Чем вы занимаетесь?</h4>

                <Typography color="error">{errors.profession}</Typography>
                <Autocomplete
                    id="combo-profession"
                    options={top100Films}
                    getOptionLabel={(option) => option}
                    value={profession}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="выбирите профессию" variant="outlined" />}
                    onChange={(event, newValue) => {
                        setProfession(newValue!);
                    }}
                />

                <div className="region-page__btns">
                    <AppButton className="region-page__save" color="default">отмена</AppButton>

                    <AppButton className="region-page__save" onClick={handleEdit}>
                        сохранить
                </AppButton>
                </div>

                <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
                    <MuiAlert onClose={() => setOpen(false)} elevation={6} variant="filled">
                        данные сохранены.
                </MuiAlert>
                </Snackbar>
            </PageLayout>
        </Layout>
    );
};