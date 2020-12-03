import react, { useState } from 'react';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import './region.scss';

import { PageLayout } from '../../components/UI/PageLayout';
import { AppButton } from '../../components/UI/AppButton';


type ProfessionProps = {

}

export const Profession: React.FC<ProfessionProps> = (props) => {
    const [otherWork, setOtherWork] = useState(false);
    const [region, setRegion] = useState('');

    return (
        <PageLayout className="profession-page">
            <h4 className="region-page__title">Чем вы занимаетесь?</h4>

            <FormControl variant="outlined" fullWidth className={'region-page__region'}>
                <InputLabel htmlFor="filled-age-native-simple">выбирите деятельность</InputLabel>
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
                    <option value={10}>Мясник 1</option>
                    <option value={20}>Мясник 2</option>
                    <option value={30}>Мясник 3</option>
                    <option value={40}>Инжинер конструктор</option>
                </Select>
            </FormControl>

            <div className="region-page__btns">
                <AppButton className="region-page__save" color="default">отмена</AppButton>
                <AppButton className="region-page__save">сохранить</AppButton>
            </div>
        </PageLayout>
    );
};