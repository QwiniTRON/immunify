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
import { useAccessToken } from '../../hooks';
import { Profession as ProfessionType } from '../../type';
import { claculateRisks } from '../../store/appData/action';
import { useTimerFunction } from '../../hooks/timerFunction';
import { useHistory } from 'react-router-dom';

import { useUpdatePersonality } from '../../hooks/updatePersonality';

type ProfessionProps = {

}

const timeToBack = 1500;

export const Profession: React.FC<ProfessionProps> = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { token } = useAccessToken();
    const updatePersonality = useUpdatePersonality();

    const mainUser = useSelector((state: RootState) => state.user.user);

    const professions = useSelector((state: RootState) => state.appData.professions);
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const pathToBack = `/profile/${currentUser?.name}`;


    const [performTimer, cancelTimer] = useTimerFunction();
    const [open, setOpen] = useState(false);
    const [profession, setProfession] = useState<ProfessionType | undefined>(currentUser?.data?.profession);
    const [errors, setErrors] = useState({
        profession: ''
    });

    const handleEdit = () => {
        if (!profession) return setErrors({ profession: '* укажите профессию' });

        setErrors({ profession: '' });

        // сохраняем риски локально
        (dispatch(updateCurrentUserData({ profession })) as any)
            .then((r: any) => {
                setOpen(true);
                performTimer(() => history.push(pathToBack), timeToBack);
                dispatch(claculateRisks(token));

                // обновление персональных данных
                if(mainUser?.savePersonality) {
                    updatePersonality();
                }
            });
    }

    return (
        <Layout title="" BackButtonCustom={<BackButton text="Вернуться в профиль" to={pathToBack} />} >
            <PageLayout flex className="profession-page">
                <h4 className="region-page__title">Чем вы занимаетесь?</h4>

                <Typography color="error">{errors.profession}</Typography>
                <Autocomplete
                    id="combo-profession"
                    options={professions ?? []}
                    getOptionLabel={(option) => option.name}
                    value={profession}
                    fullWidth
                    renderInput={(params) => <TextField
                        {...params}
                        label="выберите профессию"
                        variant="outlined"
                        helperText={errors.profession}
                        error={Boolean(errors.profession)} />}
                    onChange={(event, newValue) => {
                        setProfession(newValue!);
                    }}
                />

                <div className="btns">
                    <AppButton className="profession-button" color="default">отмена</AppButton>

                    <AppButton className="profession-button" onClick={handleEdit}>
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