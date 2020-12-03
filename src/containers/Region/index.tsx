import react, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import './region.scss';

import { PageLayout } from '../../components/UI/PageLayout';
import { AppButton } from '../../components/UI/AppButton';


type RegionProps = {

}

export const Region: React.FC<RegionProps> = (props) => {
    const [otherWork, setOtherWork] = useState(false);
    const [region, setRegion] = useState('');

    return (
        <PageLayout className="region-page">
            <h4 className="region-page__title">В каком регионе Вы проживаете?</h4>

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
                >
                    <option aria-label="None" value="" />
                    <option value={10}>Южный федеральный округ 1</option>
                    <option value={20}>Южный федеральный округ 2</option>
                    <option value={30}>Южный федеральный округ 3</option>
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

            <div  className="region-page__btns">
                <AppButton className="region-page__save" color="default">отмена</AppButton>
                <AppButton className="region-page__save">сохранить</AppButton>
            </div>
        </PageLayout>
    );
};