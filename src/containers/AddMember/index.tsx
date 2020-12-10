import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { AppButton } from '../../components/UI/AppButton';
import { addMember } from '../../store/user/action';
import { RootState } from '../../store';
import { BackButton } from '../../components/BackButton';


type AddMemberProps = {


    addMember: Function
}

const useStyle = makeStyles({
    sexLabel: {
        fontSize: 14
    },
    root: {
        height: 'auto'
    }
});

const AddMember: React.FC<AddMemberProps> = ({
    addMember
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
        // sanitize
        const sexText = sex.trim();
        const nameText = name.trim();
        const ageText = age.trim();
        const errors = {
            name: '',
            age: '',
            sex: ''
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
            addMember(name, +age, sex)
                .then((r: any) => history.push('/profile'));
        } else {
            setErrors(errors);
        }
    }

    return (
        <div className={"reg " + clasess.root}>
            <BackButton to="/profile" />
            <div className="reg__container">
                <h1 className="reg__title">
                    Добавление члена семьи
                </h1>

                <form className="reg__form" onSubmit={handleSubmit}>
                    <Typography color="error">{errors.name}</Typography>
                    <TextField
                        label="как зовут"
                        variant="outlined"
                        className="reg__input"
                        id="name-input"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />

                    <Typography color="error">{errors.age}</Typography>
                    <TextField
                        label="возраст"
                        type="number"
                        variant="outlined"
                        className="reg__input"
                        id="age-input"
                        value={age}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAge(e.target.value)}
                    />

                    <p>пол</p>
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
                    <AppButton floated disabled={loading} type="submit">
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
    addMember
}
const connectedAddMember = connect(mapStateToProps, mapDispatchToProps)(AddMember);
export { connectedAddMember as AddMember };