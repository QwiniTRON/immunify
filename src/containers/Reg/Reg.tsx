import react, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import './reg.scss';

import { AppButton } from '../../components/UI/AppButton';
import { register } from '../../store/user/action';
import { RootState } from '../../store';
import { AppLink } from '../../components/UI/AppLink';
import { AppRadioGroup } from '../../components/UI/AppRadioGroup';
import { AppRadioButton } from '../../components/UI/AppRadioButton';


type RegProps = {


    register: Function
}

const useStyle = makeStyles({
    sexLabel: {
        fontSize: 14
    }
});

const Reg: React.FC<RegProps> = ({
    register
}) => {
    const [sex, setSex] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        name: '',
        age: '',
        sex: '',
    });
    const clasess = useStyle();
    const history = useHistory();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        let valid = true;

        // sanitize
        const sexText = sex.trim();
        const nameText = name.trim();
        const ageText = age.trim();
        const errors = {
            name: '',
            age: '',
            sex: '',
        }

        // валидация
        if (nameText.length < 2) {
            errors.name = 'имя должно быть не короче 2 символов';
            valid = false;
        }
        if (+ageText < 1 || +age > 150) {
            errors.age = 'возраст обязателен';
            valid = false;
        }
        if (!sexText) {
            errors.sex = 'пол обязателен';
            valid = false;
        }

        if (valid) {
            register(name, +age, sex)
                .then((r: any) => {
                    if (r) {
                        history.push('/reg/success');
                    }
                })
                .catch((e: any) => {
                    console.log(e);
                });
        } else {
            setErrors(errors);
        }
    }

    return (
        <div className="reg">
            <div className="reg__container">
                <h1 className="reg__title">
                    Ваши данные
                </h1>
                <p className="reg__desc">
                    Узнайте каким рискам
                    вы подвержены и устраните их
                </p>

                <form className="reg__form" onSubmit={handleSubmit}>

                    <Typography color="error">{errors.name}</Typography>
                    <TextField
                        label="как вас зовут?"
                        id="name-field"
                        variant="outlined"
                        className="reg__input"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />

                    <Typography color="error">{errors.age}</Typography>
                    <TextField
                        id="age-field"
                        label="сколько вам лет?"
                        type="number"
                        variant="outlined"
                        className="reg__input"
                        value={age}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAge(e.target.value)}
                    />

                    <p>ваш пол?</p>
                    <Typography color="error">{errors.sex}</Typography>

                    <AppRadioGroup onChange={(value: string) => {
                        setSex(value);
                    }}
                        value={sex}
                    >
                        <AppRadioButton value="man" text="М" />
                        <AppRadioButton value="woman" text="Ж" />
                    </AppRadioGroup>

                    <AppButton disabled={loading} type="submit" className="reg_start">
                        Начать
                    </AppButton>
                </form>
            </div>
        </div>
    );
};

const mapStateToProps = (state: RootState) => ({
});
const mapDispatchToProps = {
    register
}
const connectedReg = connect(mapStateToProps, mapDispatchToProps)(Reg);
export { connectedReg as Reg };