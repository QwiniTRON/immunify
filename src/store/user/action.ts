import { RootState } from '..';
import {
    USER_SET_USER,
    USER_ADD_MEMBER,
    USER_SET_CURRENT_USER,
    USER_UPDATE_BY_NAME,
    USER_SET_DATA
} from '../consts';
import { Sex, User, UserAction, UserData } from '../types';
import { UserModel } from '../../models/User';

// setUser
export function setUser(user: User): UserAction {
    return {
        type: USER_SET_USER,
        user
    }
}

// setUserData
export function setUserData(data: UserData, userName: string): UserAction {
    return {
        type: USER_SET_DATA,
        data,
        userName
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
        const user: User = new User(name, age, sex);

        UserModel.saveUser(user);
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
        const newMember = new User(name, age, sex)
        dispatch(addNewMember(newMember));

        // обновляем localeStorage пользователя
        const state: RootState = getState();
        try {
            state.user.user && UserModel.saveUser(state.user.user);
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
        let state: RootState = getState();
        const isCurrentUser = state.user.currentUser?.name == memberName;

        const updatedMember = {
            age,
            name,
            sex
        }
        dispatch(updateByName(updatedMember as User, memberName));

        state = getState();

        // обновляем localeStorage пользователя
        try {
            state.user.user && UserModel.saveUser(state.user.user);
            isCurrentUser && UserModel.changeCurrentUser(state.user.currentUser?.name!);
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
            const newCurrentUser = UserModel.getUserByName(store.user, userName);

            if (newCurrentUser) {
                UserModel.changeCurrentUser(newCurrentUser.name);
                dispatch(setCurrentUser(newCurrentUser));
            }
        } catch (err) {
            console.log('changeCurrentUser', err);
        }
    }
}

// updateUserData
/*
   
*/
export function updateCurrentUserData(userData: Partial<UserData>) {
    return async function (dispatch: Function, getState: Function) {
        try {
            // в currentUser добавляем новые данные и просто их сохраняем везде
            let state: RootState = getState();

            dispatch(setUserData(userData as UserData, state.user.currentUser?.name!));

            state = getState();
            UserModel.saveUser(state.user.user!);
            UserModel.changeCurrentUser(state.user.currentUser?.name!);
        } catch (err) {
            console.log('updateCurrentUserData', err);
        }
    }
}

// userInit
/*
   
*/
export function userInit() {
    return async function (dispatch: Function, getState: Function) {
        try {
            const userFromStore = UserModel.getUserData();
            const currentUserName = UserModel.CurrentUser;

            if (userFromStore) {
                dispatch(setUser(userFromStore));

                if (currentUserName && userFromStore.name !== currentUserName) {
                    const newCurrentUser = UserModel.getUserByName$u(userFromStore, currentUserName);
                    dispatch(setCurrentUser(newCurrentUser!));
                }

                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log('userInit', err);
        }
    }
}