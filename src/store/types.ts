import {
    USER_SET_USER,
    USER_ADD_MEMBER,
    USER_SET_CURRENT_USER,
    USER_UPDATE_BY_NAME
} from './consts';


// USER
type userSetUser = {
    type: typeof USER_SET_USER,
    user: User
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
    userAddMember



// CLASSES
export enum Sex {
    man = 'man',
    woman = 'woman'
}
export type User = {
    name: string
    age: number
    sex: Sex
    family: User[]
}