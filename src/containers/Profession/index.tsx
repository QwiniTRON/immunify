import react, { useState } from 'react';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import './region.scss';

import { PageLayout } from '../../components/UI/PageLayout';
import { AppButton } from '../../components/UI/AppButton';
import { RootState } from '../../store';
import { updateCurrentUserData } from '../../store/user/action';
import { Layout } from '../../components/Layout/Layout';
import { BackButton } from '../../components/BackButton';
import { usePathByMainUser } from '../../hooks';


type ProfessionProps = {

}

export const Profession: React.FC<ProfessionProps> = (props) => {
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const pathToBack = usePathByMainUser('/profile', '/profile/data');
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [profession, setProfession] = useState(currentUser?.data?.profession);
    const [errors, setErrors] = useState({
        profession: ''
    });

    const handleEdit = () => {
        if (!profession) return setErrors({ profession: 'укажите профессию' });
        (dispatch(updateCurrentUserData({ profession })) as any)
            .then((r: any) => {
                setOpen(true);
            });
    }

    return (
        <Layout title="выбор профессии" BackButtonCustom={<BackButton to={pathToBack} />} >
            <PageLayout className="profession-page">
                <h4 className="region-page__title">Чем вы занимаетесь?</h4>

                <Typography color="error">{errors.profession}</Typography>
                <FormControl variant="outlined" fullWidth className={'region-page__region'}>
                    <InputLabel htmlFor="filled-age-native-simple">выбирите деятельность</InputLabel>
                    <Select
                        native
                        value={profession}
                        label="выбирите деятельность"
                        onChange={(e) => setProfession(String(e.target.value))}
                        inputProps={{
                            name: 'region',
                            id: 'filled-age-native-simple',
                        }}
                    >
                        <option aria-label="None" value="" />
                        <option value={'10'}>Мясник 1</option>
                        <option value={'20'}>Мясник 2</option>
                        <option value={'30'}>Мясник 3</option>
                        <option value={'40'}>Инжинер конструктор</option>
                    </Select>
                </FormControl>

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