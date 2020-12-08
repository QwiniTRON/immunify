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
        sex: ''
    });
    const clasess = useStyle();
    const history = useHistory();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        let valid = true;
        const errors = {
            name: '',
            age: '',
            sex: ''
        }

        // валидация
        if (name.length < 2) {
            errors.name = 'имя должно быть не короче 2 символов';
            valid = false;
        }
        if (+age < 1 || +age > 150) {
            errors.age = 'возраст обязателен';
            valid = false;
        }
        if (!sex) {
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
                    Добро пожаловать
                    в Immunify
                </h1>
                <p className="reg__desc">
                    Узнайте каким рискам вы подвержены и устраните их
                </p>

                <form className="reg__form" onSubmit={handleSubmit}>
                    <Typography color="error">{errors.name}</Typography>
                    <TextField
                        label="как вас зовут?"
                        variant="outlined"
                        className="reg__input"
                        id="name-input"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />

                    <Typography color="error">{errors.age}</Typography>
                    <TextField
                        label="сколько вам лет?"
                        type="number"
                        variant="outlined"
                        className="reg__input"
                        id="age-input"
                        value={age}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAge(e.target.value)}
                    />

                    <p>ваш пол?</p>
                    <Typography color="error">{errors.sex}</Typography>
                    <RadioGroup row name="position" onChange={(e) => setSex(e.target.value)} value={sex}>
                        <FormControlLabel
                            control={<Radio color="primary" />}
                            value="man"
                            label="мужчина"
                            classes={{
                                label: clasess.sexLabel
                            }}
                        />
                        <FormControlLabel
                            control={<Radio color="primary" />}
                            value="woman"
                            label="женщина"
                            classes={{
                                label: clasess.sexLabel
                            }}
                        />
                    </RadioGroup>
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