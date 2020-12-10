import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import { AppButton } from '../../components/UI/AppButton';
import { AppLink } from '../../components/UI/AppLink';

type LoginPageProps = {

}

export const LoginPage: React.FC<LoginPageProps> = (props) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        let valid = true;
        // sanitize
        const loginText = login.trim();
        const passwordText = password.trim();

        const errors = {
            email: '',
            password: ''
        }

        // валидация
        if (!(window as any).is.email(loginText)) {
            errors.email = 'email не по формату';
            valid = false;
        }

        if (valid) {
            // вход через сервер
        } else {
            setErrors(errors);
        }
    }

    return (
        <Box className="login-page" p={1}>
            <Box fontSize={36} fontWeight={500} textAlign="center">Вход в Immunify</Box>

            <form className="reg__form" onSubmit={handleSubmit}>
                <Box marginY={2}>
                    <Typography color="error">{errors.email}</Typography>
                    <TextField
                        label="email"
                        variant="outlined"
                        className="reg__input"
                        id="email-field"
                        fullWidth
                        value={login}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)} />
                </Box>

                <Box marginBottom={2}>
                    <Typography color="error">{errors.password}</Typography>
                    <TextField
                        label="пароль"
                        variant="outlined"
                        className="reg__input"
                        type="password"
                        id="password-field"
                        fullWidth
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
                </Box>

                <AppLink to="/reg">регистрация</AppLink>

                <AppButton disabled={loading} type="submit" floated>войти</AppButton>
            </form>
        </Box>
    );
}