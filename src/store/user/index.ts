import {
    USER_SET_USER
} from '../consts';
import {UserAction, User} from '../types';

type UserStore = {
    user: User | null
    currentUser: User | null
    loading: boolean
}

const initialState: UserStore = {
    user: null,
    currentUser: null,
    loading: false
}

export const userReducer = function (state: UserStore = initialState, action: UserAction): UserStore{
    switch(action.type) {
        case 'USER_SET_USER': 
            return {...state, user: action.user, currentUser: action.user};

        default:
            return state;
    }
}