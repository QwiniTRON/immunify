import { UserStore } from '../store/user';
import { RootState, store } from '../store';
import { RiskViewModel } from '../server';
import { Profession, Region } from '../type';

///////////////////////////////////////////////////////////////////////////////
// * methodName$suffix - Это тот же метод только с перегрузкой параметров  *///
///////////////////////////////////////////////////////////////////////////////


export type QuizAnswer = {
    questionId: string,
    answerId: string
}
export class QuizData {
    public lastDate: string;
    public isDone: boolean;
    public questionnaireId: string;
    public answers: QuizAnswer[];

    constructor(
        lastDate: string = '',
        isDone: boolean = false,
        questionnaireId: string = '',
        answers: QuizAnswer[] = []
    ) {
        this.lastDate = lastDate;
        this.isDone = isDone;
        this.questionnaireId = questionnaireId;
        this.answers = answers;
    }
}
export class RegionData {
    constructor(public main?: Region, public work?: Region) { }
}
export class UserData {
    public profession?: Profession;
    public region?: RegionData;
    public quiz?: QuizData;

    constructor(profession?: Profession, region: RegionData = new RegionData(), quiz: QuizData = new QuizData()) {
        this.profession = profession;
        this.region = region;
        this.quiz = quiz;
    }
}
export class User {
    public name: string;
    public age: number;
    public sex: 'man' | 'woman';
    public family: User[];
    public data?: UserData;
    public Risks: RiskViewModel[];
    public id?: string

    public constructor(
        name: string = '',
        age: number = 0,
        sex: 'man' | 'woman' = 'man',
        family: User[] = [],
        data: UserData = new UserData(),
        Risks: RiskViewModel[] = [],
        id?: string
    ) {
        this.name = name;
        this.age = age;
        this.sex = sex;
        this.family = family;
        this.data = data;
        this.Risks = Risks;
        this.id = id;
    }
}

export class UserModel {

    static userDataStoreKey = 'appUser'
    static currentUserStoreKey = 'currentUser'

    static get CurrentUser() {
        return localStorage.getItem(UserModel.currentUserStoreKey);
    }


    static saveUser(user: User) {
        const stateForSave = JSON.stringify(user);
        localStorage.setItem(UserModel.userDataStoreKey, stateForSave);
    }


    static getUserData(): User | null {
        const localStorageData = localStorage.getItem(UserModel.userDataStoreKey);

        if (!localStorageData) return null;
        return JSON.parse(localStorageData);
    }


    static changeCurrentUser(userName: string) {
        localStorage.setItem(UserModel.currentUserStoreKey, userName);
    }


    static getUserByName(userStore: UserStore, userName: string): User | null {
        const allUsers = [userStore.user, ...userStore.user?.family!];
        const newCurrentUser: User = allUsers.find((u) => u?.name == userName)!;

        if (!newCurrentUser) return null;
        return newCurrentUser;
    }
    static getUserByName$u(user: User, userName: string): User | null {
        const allUsers = [user, ...user?.family!];
        const newCurrentUser: User = allUsers.find((u) => u?.name == userName)!;

        if (!newCurrentUser) return null;
        return newCurrentUser;
    }


    static getCurrentUserDataStatus() {
        const user: User = store.getState().user.currentUser!;
        let userDataStatus = false;
        if (UserModel.getCompleatedStatus(user) >= 50) {
            userDataStatus = true;
        }
        
        return userDataStatus;
    }

    static getCompleatedStatus(user: User) {
        let procent = 0;

        if (Boolean(user.data?.profession)) procent += 25;
        if (Boolean(user.data?.region?.main)) procent += 25;
        if (user.data?.quiz?.isDone == true) procent += 50;

        return procent;
    }
}