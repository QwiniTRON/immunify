import { UserModel } from '../../models/User';
import {
    USER_SET_USER,
    USER_ADD_MEMBER,
    USER_SET_CURRENT_USER,
    USER_UPDATE_BY_NAME,
    USER_SET_DATA
} from '../consts';
import {
    UserAction,
    User,
} from '../types';



export type UserStore = {
    user: User | null
    currentUser: User | null
    loading: boolean
}


const initialState: UserStore = {
    user: null,
    currentUser: null,
    loading: false
}


const setUser = (state: UserStore = initialState, action: UserAction) => {
    if (action.type !== USER_SET_USER) return state;
    return { ...state, user: action.user, currentUser: action.user };
}


const setCurrentUser = (state: UserStore = initialState, action: UserAction) => {
    if (action.type !== USER_SET_CURRENT_USER) return state;
    return { ...state, currentUser: action.member };
}


const updateByName = (state: UserStore = initialState, action: UserAction) => {
    if (action.type !== USER_UPDATE_BY_NAME) return state;

    const user: User = UserModel.getUserByName(state, action.memberName)!;
    Object.assign(user, action.member);

    return Object.assign({}, state);
}


const addMember = (state: UserStore = initialState, action: UserAction) => {
    if (action.type !== USER_ADD_MEMBER) return state;

    const user: User = state.user!;
    user?.family.push(action.member);
    return Object.assign({}, state);
}


const setUserData = (state: UserStore = initialState, action: UserAction) => {
    if (action.type !== USER_SET_DATA) return state;

    const currentUser = UserModel.getUserByName(state, action.userName);
    Object.assign(currentUser?.data, action.data);

    return Object.assign({}, state);
}


const handlerDictionary: { [p: string]: any } = {
    [USER_SET_DATA]: setUserData,
    [USER_ADD_MEMBER]: addMember,
    [USER_UPDATE_BY_NAME]: updateByName,
    [USER_SET_CURRENT_USER]: setCurrentUser,
    [USER_SET_USER]: setUser
}


export const userReducer = function (state: UserStore = initialState, action: UserAction): UserStore {
    const handler = handlerDictionary[action?.type];
    return handler ? handler.call(null, state, action) : state;
}


// Замечание: Для пользователей вложенных в поле family мы не будем сохранять их поле family 