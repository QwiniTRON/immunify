import {
    USER_SET_USER
} from './consts';


// USER
type userSetUser = {
    type: typeof USER_SET_USER,
    user: User
}

export type UserAction = userSetUser





// Classes
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