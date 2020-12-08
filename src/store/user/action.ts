import {
    USER_SET_USER
} from '../consts';
import {Sex, User, UserAction} from '../types';

// setUser
export function setUser(user: User): UserAction {
    return {
        type: USER_SET_USER,
        user
    }
}


//? ********** ASYNC **********
// LOGIN
/*

*/
export function login() {
    return async function (dispatch: Function, getState: Function) {

    }
}

// REGISTER
/*
    метод для регистрации
*/
export function register(name: string, age: number, sex: Sex) {
    return async function (dispatch: Function, getState: Function) {
        // сервер ...
        const user: User = {
            age,
            name,
            sex,
            family: []
        };
        localStorage.setItem('appUser', JSON.stringify(user));
        dispatch(setUser(user));

        return true;
    }
}

// userInit
/*
    метод для регистрации
*/
export function userInit() {
    return async function (dispatch: Function, getState: Function) {
        const localStorageData = localStorage.getItem('appUser');
        if(localStorageData) {
            dispatch(setUser(JSON.parse(localStorageData)));
            return true;
        } else {
            return false;
        }
    }
}