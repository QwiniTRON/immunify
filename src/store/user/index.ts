import {
    USER_SET_USER,
    USER_ADD_MEMBER
} from '../consts';
import { UserAction, User } from '../types';

type UserStore = {
    user: User | null
    currentUser: User | null
    loading: boolean
}

export const initialState: UserStore = {
    user: null,
    currentUser: null,
    loading: false
}

export const userReducer = function (state: UserStore = initialState, action: UserAction): UserStore {
    switch (action.type) {
        case USER_SET_USER:
            return { ...state, user: action.user, currentUser: action.user };

        case USER_ADD_MEMBER:
            const oldUser: User = state.user!;
            oldUser?.family.push(action.member);
            const newUser: User = { ...oldUser };
            return { ...state, user: newUser, currentUser: newUser };

        default:
            return state;
    }
}

// Замечание: Для пользователей вложенных в поле family мы не будем сохранять их поле family 