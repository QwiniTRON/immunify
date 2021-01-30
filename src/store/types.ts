import {
    USER_SET_USER,
    USER_ADD_MEMBER,
    USER_SET_CURRENT_USER,
    USER_UPDATE_BY_NAME,
    USER_SET_DATA,
    APPDATA_SET_DATA,
    USER_CLEAR
} from './consts';
import { User, QuizAnswer, RegionData, UserData } from '../models/User';
import { AppDataStore } from './appData';

// USER
type userSetUser = {
    type: typeof USER_SET_USER,
    user: User
}

type userClearStore = {
    type: typeof USER_CLEAR
}

type userSetData = {
    type: typeof USER_SET_DATA,
    data: Partial<UserData>,
    userName: string
}

type userAddMember = {
    type: typeof USER_ADD_MEMBER,
    member: User
}

type userChangeCurrntUser = {
    type: typeof USER_SET_CURRENT_USER,
    member: User
}

type userUpdateByName = {
    type: typeof USER_UPDATE_BY_NAME,
    member: User,
    memberName: string
}

export type UserAction = userSetUser |
    userChangeCurrntUser |
    userUpdateByName |
    userAddMember |
    userSetData |
    userClearStore



// APPDATA
export type AppDataSetData = {
    type: typeof APPDATA_SET_DATA,
    newState: Partial<AppDataStore>
}

export type AppDataAction = AppDataSetData


// CLASSES
export enum Sex {
    man = 'man',
    woman = 'woman'
}
export { User, RegionData, UserData };
export type { QuizAnswer };