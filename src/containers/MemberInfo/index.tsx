import React, { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Box from '@material-ui/core/Box';
import Radio from '@material-ui/core/Radio';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import './memberinfo.scss';

import { PageLayout } from '../../components/UI/PageLayout';
import { RootState } from '../../store';
import { Sex, User } from '../../store/types';
import { AppButtonGroup } from '../../components/UI/ButtonGroup';
import { AppButton } from '../../components/UI/AppButton';
import { changeCurrentUser, updateMember } from '../../store/user/action';
import { Layout } from '../../components/Layout/Layout';
import { BackButton } from '../../components/BackButton';

type MemberInfoParams = {
    id: string
}

interface MemberInfoProps {
    user: User | null
    currentUser: User | null

    changeCurrentUser: typeof changeCurrentUser
    updateMember: typeof updateMember
};

const MemberInfo: React.FC<MemberInfoProps> = ({
    user,
    changeCurrentUser,
    currentUser,
    updateMember
}) => {
    const history = useHistory();

    // определяем пользователя
    const id = useRouteMatch<MemberInfoParams>()?.params?.id;
    let allUsers = [user, ...user?.family!];
    let selectedUser = allUsers.find((u) => u?.name == id);
    const isSelected = currentUser == selectedUser;
    const isRootUser = currentUser == user;

    const [open, setOpen] = useState(false);
    const [sex, setSex] = useState<string>(String(selectedUser?.sex));
    const [name, setName] = useState<string>(String(selectedUser?.name));
    const [age, setAge] = useState<string>(String(selectedUser?.age));
    const [errors, setErrors] = useState({
        name: '',
        age: '',
        sex: ''
    });

    if (!id) return (<PageLayout className="member-page">Member page</PageLayout>);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isRootUser) return;

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
            (updateMember({ name, age: Number(age), sex: sex as Sex }, id) as any)
                .then(() => {
                    setOpen(true);
                });
        } else {
            setErrors(errors);
        }
    }

    return (
        <Layout title="Данные семьи" BackButtonCustom={<BackButton to="/profile" />}>
            <PageLayout className="member-page" ButtonBackto="/profile">
                <form className="reg__form" onSubmit={handleSubmit}>
                    <Box marginY={2}>
                        <Typography color="error">{errors.name}</Typography>
                        <TextField
                            label="как вас зовут?"
                            variant="outlined"
                            className="reg__input"
                            fullWidth
                            id="name-input"
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
                    </Box>

                    <Box marginY={2}>
                        <Typography color="error">{errors.age}</Typography>
                        <TextField
                            label="сколько вам лет?"
                            type="number"
                            variant="outlined"
                            className="reg__input"
                            fullWidth
                            id="age-input"
                            value={age}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAge(e.target.value)}
                        />
                    </Box>

                    <p>ваш пол?</p>
                    <Typography color="error">{errors.sex}</Typography>
                    <RadioGroup row name="position" onChange={(e) => setSex(e.target.value)} value={sex}>
                        <FormControlLabel
                            control={<Radio color="primary" />}
                            value="man"
                            label="мужчина"
                        />
                        <FormControlLabel
                            control={<Radio color="primary" />}
                            value="woman"
                            label="женщина"
                        />
                    </RadioGroup>

                    <Box display="none"><button type="submit"></button></Box>
                </form>

                <AppButtonGroup floated>
                    {isRootUser &&
                        <AppButton onClick={handleSubmit}>сохранить</AppButton>
                    }
                    {!isSelected &&
                        <AppButton onClick={(e: React.MouseEvent) => (changeCurrentUser as Function)(id).then(() => {
                            history.push('/profile');
                        })} color="secondary">выбрать</AppButton>
                    }
                    {isRootUser &&
                        <AppButton color="default">удалить</AppButton>
                    }
                </AppButtonGroup>

                <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
                    <MuiAlert elevation={6} variant="filled">
                        данные изменены.
                </MuiAlert>
                </Snackbar>
            </PageLayout>
        </Layout>
    );
};

const mapStatetoProps = (state: RootState) => ({
    user: state.user.user,
    currentUser: state.user.currentUser
});
const mapDispatchToProps = {
    changeCurrentUser,
    updateMember
};
const connectedMemberInfo = connect(mapStatetoProps, mapDispatchToProps)(MemberInfo as any);
export { connectedMemberInfo as MemberInfo };