import react, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { useSelector, useDispatch } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import MuiAlert from '@material-ui/lab/Alert';

import './region.scss';

import { PageLayout } from '../../components/UI/PageLayout';
import { AppButton } from '../../components/UI/AppButton';
import { updateCurrentUserData } from '../../store/user/action';
import { RootState } from '../../store';
import { Layout } from '../../components/Layout/Layout';
import { usePathByMainUser } from '../../hooks';
import { BackButton } from '../../components/BackButton';


type RegionProps = {

}


type RegionSelectProps = {
    value: string
    changeHandle: (e: React.ChangeEvent<any>) => void
    name: string
    id: string
    label: string
    error?: any
    title: string
}
const RegionSelect: React.FC<RegionSelectProps> = ({
    changeHandle,
    id,
    label,
    name,
    value,
    children,
    error,
    title
}) => {
    return (
        <>
            <Box className="error" mb={'5px'}>{error}</Box>
            <FormControl variant="outlined" fullWidth className={'region-page__region'}>
                <InputLabel htmlFor="filled-age-native-simple">{title}</InputLabel>
                <Select
                    native
                    value={value}
                    onChange={changeHandle}
                    inputProps={{
                        name: name,
                        id: id,
                    }}
                    label={label}
                >
                    <option aria-label="None" value="" />
                    {children}
                </Select>
            </FormControl>
        </>
    );
}



export const Region: React.FC<RegionProps> = (props) => {
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const pathToBack = usePathByMainUser('/profile', '/profile/data');
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [region, setRegion] = useState(currentUser?.data?.region!);
    const [otherWork, setOtherWork] = useState(Boolean(region.work));
    const [errors, setErrors] = useState({
        region: '',
        workRegion: ''
    });


    const handleEdit = () => {
        if (!region.main) return setErrors(Object.assign({}, errors, { region: 'укажите регион' }));
        if (otherWork && !region.work) return setErrors(Object.assign({}, errors, { workRegion: 'укажите регоин' }));

        setErrors(Object.assign({}, errors, { workRegion: '', region: '' }))
        let regionToSave = region;
        if (!otherWork) region.work = '';

        (dispatch(updateCurrentUserData({ region: regionToSave })) as any)
            .then((r: any) => {
                setOpen(true);
            });
    }


    return (
        <Layout title="выбор регоина" BackButtonCustom={<BackButton to={pathToBack} />} >
            <PageLayout className="region-page">
                <h4 className="region-page__title">В каком регионе Вы проживаете?</h4>

                <RegionSelect
                    changeHandle={(e: React.ChangeEvent<any>) => setRegion({
                        ...region,
                        main: String(e.target.value)
                    })}
                    id="filled-age-native-simple1"
                    name="region"
                    title="Выбирите регион"
                    value={region.main}
                    label="Выбирите регион"
                    error={errors.region}
                >
                    <option value={'10'}>Южный федеральный округ 1</option>
                    <option value={'20'}>Южный федеральный округ 2</option>
                    <option value={'30'}>Южный федеральный округ 3</option>
                </RegionSelect>

                {otherWork &&
                    <Box mt={2}>
                        <h4 className="region-page__title">В каком регионе Вы работаете?</h4>
                        <RegionSelect
                            changeHandle={(e: React.ChangeEvent<any>) => setRegion({
                                ...region,
                                work: String(e.target.value)
                            })}
                            id="filled-age-native-simple1"
                            name="region"
                            title="Выбирите регион"
                            value={region.work}
                            label="Выбирите регион"
                            error={errors.workRegion}
                        >
                            <option value={'10'}>Южный федеральный округ 1</option>
                            <option value={'20'}>Южный федеральный округ 2</option>
                            <option value={'30'}>Южный федеральный округ 3</option>
                        </RegionSelect>
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