import react, { useState } from 'react';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import ruLocale from "date-fns/locale/ru";
import DateFnsUtils from '@date-io/date-fns';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import './readypage.scss';

import { PageLayout } from '../../components/UI/PageLayout';
import { AppButton } from '../../components/UI/AppButton';
import { Layout } from '../../components/Layout/Layout';

type ReadyPageProps = {

}


export const ReadyPage: React.FC<ReadyPageProps> = (props) => {
    const [selectedDate, handleDateChange] = useState(new Date());
    const [vaccine, setVaccine] = useState(0);
    const [count, setCount] = useState(0);

    // после ввода просто делаем переадресация на риски
    return (
        <Layout title="Прошедшие вакцинации">
            <PageLayout className="ready-page">
                <p className="ready-page__text">Добавьте даные о вакцинах</p>
                <FormControl variant="outlined" fullWidth className={'ready-page__input'}>
                    <InputLabel htmlFor="filled-age-native-simple">вакцина</InputLabel>
                    <Select
                        native
                        value={vaccine}
                        onChange={(e) => setVaccine(Number(e.target.value))}
                        inputProps={{
                            name: 'region',
                            id: 'filled-age-native-simple',
                        }}
                        label="вакцина"
                    >
                        <option aria-label="None" value="" />
                        <option value={10}>БСЖ</option>
                        <option value={20}>Спутник-5</option>
                        <option value={30}>Вакцинушка</option>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" fullWidth className={'ready-page__input'}>
                    <InputLabel htmlFor="filled-age-native-simple">какая по счёту</InputLabel>
                    <Select
                        native
                        label="какая по счёту"
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                        inputProps={{
                            name: 'region',
                            id: 'filled-age-native-simple',
                        }}
                    >
                        <option aria-label="None" value="" />
                        <option value={10}>1</option>
                        <option value={20}>2</option>
                        <option value={30}>3</option>
                    </Select>
                </FormControl>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                    <DatePicker
                        label="дата последней вакцинации"
                        value={selectedDate}
                        onChange={handleDateChange as any}
                        fullWidth
                        cancelLabel="отмена"
                        format="d MMM yyyy"
                        disableFuture
                        inputVariant="outlined"
                        clearable
                    />
                </MuiPickersUtilsProvider>

                <AppButton floated>
                    Сохранить
                </AppButton>
            </PageLayout>
        </Layout>
    );
};