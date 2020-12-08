import { RootState } from '..';
import {
    USER_SET_USER,
    USER_ADD_MEMBER
} from '../consts';
import { Sex, User, UserAction } from '../types';

// setUser
export function setUser(user: User): UserAction {
    return {
        type: USER_SET_USER,
        user
    }
}

export function addNewMember(member: User): UserAction {
    return {
        type: USER_ADD_MEMBER,
        member
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


// ADDMEMBER
/*
    
*/
export function addMember(name: string, age: number, sex: Sex) {
    return async function (dispatch: Function, getState: Function) {
        // добавляем в store нового члена семьи
        const newMember = {
            age,
            name,
            sex,
            family: []
        }
        dispatch(addNewMember(newMember));

        // обновляем localeStorage пользователя
        const state: RootState = getState();
        try {
            const stateForSave = JSON.stringify(state.user.user);
            localStorage.setItem('appUser', stateForSave);

        } catch (err) {
            console.log(err);
        }

    }
}


// userInit
/*
   
*/
export function userInit() {
    return async function (dispatch: Function, getState: Function) {
        const localStorageData = localStorage.getItem('appUser');
        
        if (localStorageData) {
            dispatch(setUser(JSON.parse(localStorageData)));
            return true;
        } else {
            return false;
        }
    }
}