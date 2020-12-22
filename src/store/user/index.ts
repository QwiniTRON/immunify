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
    UserData,

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

// export const userReducer = function (state: UserStore = initialState, action: UserAction): UserStore {
//     switch (action.type) {
//         case USER_SET_USER:
//             return { ...state, user: action.user, currentUser: action.user };

//         case USER_SET_CURRENT_USER:
//             return { ...state, currentUser: action.member };

//         case USER_UPDATE_BY_NAME:
//             let userforSave: User;

//             // если root user отредактирован
//             if (state.user?.name === action.memberName) {
//                 userforSave = { ...state.user, ...action.member };
//                 return {
//                     ...state,
//                     user: userforSave,
//                     currentUser: state.currentUser?.name == action.memberName ? userforSave : state.currentUser
//                 };
//             }

//             // если отредактирован член семьи
//             let userToSetCurrent: User | null = null;
//             const newUsers: User[] = state.user?.family!.map((u) => {
//                 if (u?.name === action.memberName) {
//                     const updatedMember = { ...u, ...action.member };
//                     if (state.currentUser?.name == action.memberName) {
//                         userToSetCurrent = updatedMember;
//                     }
//                     return updatedMember;
//                 }
//                 return u;
//             })!;

//             userforSave = { ...state.user, family: newUsers } as User;
//             return {
//                 ...state,
//                 user: userforSave,
//                 currentUser: userToSetCurrent ?? userforSave
//             };

//         case USER_ADD_MEMBER:
//             const oldUser: User = state.user!;
//             oldUser?.family.push(action.member);
//             const newUser: User = { ...oldUser };
//             return { ...state, user: newUser, currentUser: newUser };

//         case USER_SET_DATA:
//             let remarkedUser: User;
//             let isCurrentUser: boolean = false;
//             let newCurrentUser: User | null;
//             let userData: UserData;

//             if (action.userName == state.user?.name) {
//                 if (state.currentUser === state.user) isCurrentUser = true;

//                 userData = { ...state.user.data, ...action.data } as UserData;
//                 remarkedUser = { ...state.user, data: userData };

//                 if (isCurrentUser) newCurrentUser = remarkedUser;
//             } else {
//                 const userFamily = state.user?.family.map((u) => {
//                     if (u.name == action.userName) {

//                         if (u.name == action.userName) isCurrentUser = true;

//                         userData = { ...u.data, ...action.data } as UserData;
//                         let remarkedMember = { ...u, data: userData };

//                         if (isCurrentUser) newCurrentUser = remarkedMember;

//                         return remarkedMember;
//                     }
//                     return u;
//                 })!;

//                 remarkedUser = ({ ...state.user, family: userFamily } as User);
//             }

//             return {
//                 ...state,
//                 user: remarkedUser,
//                 currentUser: isCurrentUser ? newCurrentUser! : state.currentUser
//             };

//         default:
//             return state;
//     }
// }

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
}

const addMember = (state: UserStore = initialState, action: UserAction) => {
    if (action.type !== USER_ADD_MEMBER) return state;

    const oldUser: User = state.user!;
    oldUser?.family.push(action.member);
    const newUser: User = { ...oldUser };
    return { ...state, user: newUser, currentUser: newUser };
}

const setUserData = (state: UserStore = initialState, action: UserAction) => {
    if (action.type !== USER_SET_DATA) return state;

    let remarkedUser: User;
    let isCurrentUser: boolean = false;
    let newCurrentUser: User | null;
    let userData: UserData;

    if (action.userName == state.user?.name) {
        if (state.currentUser === state.user) isCurrentUser = true;

        userData = { ...state.user.data, ...action.data } as UserData;
        remarkedUser = { ...state.user, data: userData };

        if (isCurrentUser) newCurrentUser = remarkedUser;
    } else {
        const userFamily = state.user?.family.map((u) => {
            if (u.name == action.userName) {

                if (u.name == action.userName) isCurrentUser = true;

                userData = { ...u.data, ...action.data } as UserData;
                let remarkedMember = { ...u, data: userData };

                if (isCurrentUser) newCurrentUser = remarkedMember;

                return remarkedMember;
            }
            return u;
        })!;

        remarkedUser = ({ ...state.user, family: userFamily } as User);
    }

    return {
        ...state,
        user: remarkedUser,
        currentUser: isCurrentUser ? newCurrentUser! : state.currentUser
    };
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