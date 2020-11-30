import react, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { makeStyles } from '@material-ui/core/styles';

import './reg.scss';

type RegProps = {

}

const useStyle = makeStyles({
    sexLabel: {
        fontSize: 14
    }
});

export const Reg: React.FC<RegProps> = (props) => {
    const [sex, setSex] = useState('');
    const clasess = useStyle();

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

                <form className="reg__form">
                    <TextField label="как вас зовут?" variant="outlined" className="reg__input" />

                    <TextField
                        label="сколько вам лет?"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className="reg__input"
                    />

                    <p>ваш пол?</p>
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
                    <button type="submit" className="reg_start">
                        Начать
                    </button>
                </form>


            </div>
        </div>
    );
};