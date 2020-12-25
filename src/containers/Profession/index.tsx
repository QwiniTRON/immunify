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
import { Profession as  ProfessionType} from '../../type';
import { claculateRisks } from '../../store/appData/action';
import { useReactOidc } from '@axa-fr/react-oidc-context';


type ProfessionProps = {

}

const top100Films: ProfessionType[] = [
    { id: 1, name: 'профессия 1' },
    { id: 2, name: 'профессия 2' },
    { id: 3, name: 'профессия 3' },
    { id: 4, name: 'профессия 4' },
    { id: 5, name: 'профессия 5' },
    { id: 6, name: 'профессия 6' },
    { id: 7, name: 'профессия 7' },
    { id: 8, name: 'профессия 8' },
    { id: 9, name: 'профессия 9' },
    { id: 10, name: 'профессия 10' },
    { id: 11, name: 'профессия 11' }
];


export const Profession: React.FC<ProfessionProps> = (props) => {
    const dispatch = useDispatch();
    const { oidcUser } = useReactOidc();
    
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const isEmptyFamily = useIsEmptyFamily();
    const pathToBack = isEmptyFamily ? '/profile' : `/profile/${currentUser?.name}`;

    const [open, setOpen] = useState(false);
    const [profession, setProfession] = useState<ProfessionType | undefined>(currentUser?.data?.profession);
    const [errors, setErrors] = useState({
        profession: ''
    });

    const handleEdit = () => {
        if (!profession) return setErrors({ profession: '* укажите профессию' });

        setErrors({ profession: '' });

        (dispatch(updateCurrentUserData({ profession })) as any)
            .then((r: any) => {
                setOpen(true);
                dispatch(claculateRisks(oidcUser.access_token));
            });
    }

    return (
        <Layout title="" BackButtonCustom={<BackButton text="Вернуться в профиль" to={pathToBack} />} >
            <PageLayout className="profession-page">
                <h4 className="region-page__title">Чем вы занимаетесь?</h4>

                <Typography color="error">{errors.profession}</Typography>
                <Autocomplete
                    id="combo-profession"
                    options={top100Films}
                    getOptionLabel={(option) => option.name}
                    value={profession}
                    fullWidth
                    renderInput={(params) => <TextField
                        {...params}
                        label="выбирите профессию"
                        variant="outlined"
                        helperText={errors.profession}
                        error={Boolean(errors.profession)} />}
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