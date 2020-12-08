import {
    USER_SET_USER,
    USER_ADD_MEMBER
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

export type UserAction = userSetUser | userAddMember





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