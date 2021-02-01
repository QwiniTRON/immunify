import { RootState } from '..';
import {
    USER_SET_USER,
    USER_ADD_MEMBER,
    USER_SET_CURRENT_USER,
    USER_UPDATE_BY_NAME,
    USER_SET_DATA,
    USER_CLEAR,
    USER_CHANGE_LOADING
} from '../consts';
import { Sex, User, UserAction, UserData } from '../types';
import { UserModel } from '../../models/User/User';
import { eyars18 } from '../../utils';
import { AppModel } from '../../models/App';
import { LoginMark } from '../../models';


//  ***************************
//? ********** STATIC *********
//  ***************************

/**
 * установить главного пользователя
 * 
 * @param {User} user пользователь
 */
export function setUser(user: User): UserAction {
    return {
        type: USER_SET_USER,
        user
    }
}

export function changeUserLoading(loading: boolean): UserAction {
    return {
        type: USER_CHANGE_LOADING,
        loading
    }
}

export function clearUserStore(): UserAction {
    return {
        type: USER_CLEAR
    }
}

/**
 * обновить данные для пациента
 * 
 * @param {UserData} data данные для обновления
 * @param {string} userName имя пациента
 */
export function setUserData(data: UserData, userName: string): UserAction {
    return {
        type: USER_SET_DATA,
        data,
        userName
    }
}

/**
 * добавить нового пациента
 * 
 * @param {User} member пациент
 */
export function addNewMember(member: User): UserAction {
    return {
        type: USER_ADD_MEMBER,
        member
    }
}

/**
 * обновить пациента
 * 
 * @param {User} member новые данные пациента
 * @param {string} memberName имя пациента
 */
export function updateByName(member: User, memberName: string): UserAction {
    return {
        type: USER_UPDATE_BY_NAME,
        member,
        memberName
    }
}

/**
 * сменить активного пользователя
 * 
 * @param {User} member новый активный пользователь
 */
export function setCurrentUser(member: User): UserAction {
    return {
        type: USER_SET_CURRENT_USER,
        member
    }
}

//  ***************************
//? ********** ASYNC **********
//  ***************************

/**
 * login
 */
export function login() {
    return async function (dispatch: Function, getState: Function) {

    }
}


/**
 * выход из аккаунта
 */
export function exit() {
    return async function (dispatch: Function, getState: Function) {
        dispatch(clearUserStore());
        AppModel.clearAppData();
        window.location.reload();
    }
}


/**
 * регистрация главного пользователя
 * 
 * @param {string} name имя
 * @param {number} age возраст
 * @param {Sex} sex пол
 * @param {string} id id из базы
 * @param {boolean} savePersonality разрешение на синхронизацию данных с сервером
 */
export function register(name: string, age: number, sex: Sex, email: LoginMark, id: string, savePersonality: boolean) {
    return async function (dispatch: Function, getState: Function) {
        const user: User = new User(
            name,
            age,
            sex,
            undefined,
            undefined,
            undefined,
            email,
            id,
            savePersonality
        );

        UserModel.saveUser(user);
        dispatch(setUser(user));

        return true;
    }
}


/**
 * добавление нового пациента
 * 
 * @param {string} name имя
 * @param {number} age возраст
 * @param {Sex} sex пол
 * @param {string} id id из базы
 */
export function addMember(name: string, age: number, sex: Sex, id: string) {
    return async function (dispatch: Function, getState: Function) {

        let state: RootState = getState();

        // добавляем в store нового члена семьи
        let userData: UserData | undefined = undefined;
        if (Date.now() - age < eyars18) {
            userData = new UserData(
                undefined,
                state.user.user?.data?.region,
                undefined
            );
        }
        const newMember = new User(
            name,
            age,
            sex,
            undefined,
            userData,
            undefined,
            undefined,
            id,
            false
        )

        dispatch(addNewMember(newMember));

        // обновляем localeStorage пользователя
        state = getState();
        try {
            state.user.user && UserModel.saveUser(state.user.user);
        } catch (err) {
            console.log(err);
        }

    }
}


/**
 * обновление пациента
 * 
 * @param {Partial<User>} memberNextState новые данные пациента для обновления
 * @param {string} memberName имя пациента
 */
export function updateMember(memberNextState: Partial<User>, memberName: string) {
    return async function (dispatch: Function, getState: Function) {
        let state: RootState = getState();
        const isCurrentUser = state.user.currentUser?.name == memberName;

        dispatch(updateByName(memberNextState as User, memberName));

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


/**
 * смена активного пациента
 * 
 * @param {string} userName имя пользователя
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

/**
 * обновление данных активного пациента
 * 
 * @param {Partial<UserData>} userData новые данные для пользователя
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

/**
 * инициация данных пользователя и пациентов 
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
                dispatch(clearUserStore());

                return false;
            }
        } catch (err) {
            console.log('userInit', err);
        }
    }
}