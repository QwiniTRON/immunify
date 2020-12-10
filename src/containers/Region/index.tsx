import react, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { useSelector, useDispatch } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import MuiAlert from '@material-ui/lab/Alert';

import './region.scss';

import { PageLayout } from '../../components/UI/PageLayout';
import { AppButton } from '../../components/UI/AppButton';
import { updateCurrentUserData } from '../../store/user/action';
import { RootState } from '../../store';


type RegionProps = {

}

export const Region: React.FC<RegionProps> = (props) => {
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [otherWork, setOtherWork] = useState(false);
    const [region, setRegion] = useState(currentUser?.data?.region!);
    const [errors, setErrors] = useState({
        region: ''
    });

    const handleEdit = () => {
        if (!region) return setErrors({ region: 'укажите профессию' });
        (dispatch(updateCurrentUserData({ region })) as any)
            .then((r: any) => {
                setOpen(true);
            });
    }

    return (
        <PageLayout className="region-page">
            <h4 className="region-page__title">В каком регионе Вы проживаете?</h4>

            <Typography color="error">{errors.region}</Typography>
            <FormControl variant="outlined" fullWidth className={'region-page__region'}>
                <InputLabel htmlFor="filled-age-native-simple">Выбирите регион</InputLabel>
                <Select
                    native
                    value={region}
                    onChange={(e) => setRegion(String(e.target.value))}
                    inputProps={{
                        name: 'region',
                        id: 'filled-age-native-simple',
                    }}
                    label="Выбирите регион"
                >
                    <option aria-label="None" value="" />
                    <option value={'10'}>Южный федеральный округ 1</option>
                    <option value={'20'}>Южный федеральный округ 2</option>
                    <option value={'30'}>Южный федеральный округ 3</option>
                </Select>
            </FormControl>

            <FormControlLabel className="region-page__work"
                control={
                    <Checkbox
                        checked={otherWork}
                        onChange={(e) => setOtherWork(e.target.checked)}
                        color="primary"
                    />
                }
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
    );
};