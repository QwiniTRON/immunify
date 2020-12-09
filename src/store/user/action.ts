import { RootState } from '..';
import {
    USER_SET_USER,
    USER_ADD_MEMBER,
    USER_SET_CURRENT_USER,
    USER_UPDATE_BY_NAME
} from '../consts';
import { Sex, User, UserAction } from '../types';

// setUser
export function setUser(user: User): UserAction {
    return {
        type: USER_SET_USER,
        user
    }
}

// addNewMember
export function addNewMember(member: User): UserAction {
    return {
        type: USER_ADD_MEMBER,
        member
    }
}

// updateByName
export function updateByName(member: User, memberName: string): UserAction {
    return {
        type: USER_UPDATE_BY_NAME,
        member,
        memberName
    }
}

// changeCurrentUser
export function setCurrentUser(member: User): UserAction {
    return {
        type: USER_SET_CURRENT_USER,
        member
    }
}

//  ***************************
//? ********** ASYNC **********
//  ***************************

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


// updateMember
/*
    
*/
export function updateMember(name: string, age: number, sex: Sex, memberName: string) {
    return async function (dispatch: Function, getState: Function) {
        // добавляем в store нового члена семьи
        const newMember = {
            age,
            name,
            sex
        }
        dispatch(updateByName(newMember as User, memberName));

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


// chaneCurrentUser
/*
   
*/
export function changeCurrentUser(userName: string) {
    return async function (dispatch: Function, getState: Function) {
        try {
            const store: RootState = getState();
            const userState = store.user.user;
            const allUsers = [userState, ...userState?.family!];
            const newCurrentUser: User = allUsers.find((u) => u?.name == userName)!;
            
            if(newCurrentUser) {
                dispatch(setCurrentUser(newCurrentUser));
            }
        } catch (err) {
            console.log('changeCurrentUser', err);
        }
    }
}

// userInit
/*
   
*/
export function userInit() {
    return async function (dispatch: Function, getState: Function) {
        try {
            const localStorageData = localStorage.getItem('appUser');

            if (localStorageData) {
                dispatch(setUser(JSON.parse(localStorageData)));
                return true;
            } else {
                return false;
            }
        } catch (err) {

        }
    }
}