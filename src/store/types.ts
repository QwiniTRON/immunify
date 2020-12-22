import {
    USER_SET_USER,
    USER_ADD_MEMBER,
    USER_SET_CURRENT_USER,
    USER_UPDATE_BY_NAME,
    USER_SET_DATA
} from './consts';


// USER
type userSetUser = {
    type: typeof USER_SET_USER,
    user: User
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
    userSetData



// CLASSES
export enum Sex {
    man = 'man',
    woman = 'woman'
}

export type QuizAnswer = {
    questionId: string,
    answerId: string
}
export type UserData = {
    profession: string
    region: {
        main: string
        work: string
    }
    quiz: QuizAnswer[]
}
export type User = {
    name: string
    age: number
    sex: Sex
    family: User[]
    data?: UserData
}