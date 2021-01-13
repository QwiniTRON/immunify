import React from 'react';
import { Link } from 'react-router-dom';
import doctorLogo from '../../assets/doctor.svg';

import './MeetingPage.scss';


export const MeetingPage: React.FC = () => {
    return (
        <div className="meeting-page">
            <div className="container auth__container">
                <h1 className="title">Добро пожаловать в Immunify!</h1>

                <main>
                    <img src={doctorLogo} alt="doctor" className="auth__img" />

                    <div className="auth__buttons">
                        <Link className="button auth__button" to="/registration">
                            регистрация
                        </Link>

                        <Link className="button auth__button  button--white" to="/login">
                            войти
                        </Link>
                    </div>
                </main>
            </div>
        </div>
    );
}