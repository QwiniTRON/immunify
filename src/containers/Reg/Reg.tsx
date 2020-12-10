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
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        name: '',
        age: '',
        sex: '',
        email: '',
        password: ''
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
        const loginText = login.trim();
        const passwordText = password.trim();
        const errors = {
            name: '',
            age: '',
            sex: '',
            email: '',
            password: ''
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
                    Добро пожаловать
                    в Immunify
                </h1>
                <p className="reg__desc">
                    Узнайте каким рискам вы подвержены и устраните их
                </p>

                <form className="reg__form" onSubmit={handleSubmit}>
                    <TextField
                        label="email"
                        variant="outlined"
                        className="reg__input"
                        value={login}
                        id="email-field"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)} />

                    <TextField
                        label="пароль"
                        variant="outlined"
                        id="password-field"
                        type="password"
                        className="reg__input"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />

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

                    <AppLink to="/login">войти</AppLink>

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