import {
    USER_SET_USER,
    USER_ADD_MEMBER,
    USER_SET_CURRENT_USER,
    USER_UPDATE_BY_NAME
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

        case USER_SET_CURRENT_USER:
            return { ...state, currentUser: action.member };

        case USER_UPDATE_BY_NAME:
            let userforSave: User;

            // если root user отредактирован
            if (state.user?.name === action.memberName) {
                userforSave = { ...state.user, ...action.member };
                return {
                    ...state,
                    user: userforSave,
                    currentUser: state.currentUser?.name == action.memberName ? userforSave : state.currentUser
                };
            }

            // если отредактирован член семьи
            let userToSetCurrent: User | null = null;
            const newUsers: User[] = state.user?.family!.map((u) => {
                if (u?.name === action.memberName) {
                    const updatedMember = { ...u, ...action.member };
                    if (state.currentUser?.name == action.memberName) {
                        userToSetCurrent = updatedMember;
                    }
                    return updatedMember;
                }
                return u;
            })!;

            userforSave = { ...state.user, family: newUsers } as User;
            return {
                ...state,
                user: userforSave,
                currentUser: userToSetCurrent ?? userforSave
            };

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