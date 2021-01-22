import { UserStore } from '../store/user';
import { RootState, store } from '../store';
import { RiskViewModel } from '../server';
import { Profession, Region } from '../type';
import {getYearOffsetNow} from '../utils';

///////////////////////////////////////////////////////////////////////////////
//  methodName$suffix - Это тот же метод только с перегрузкой параметров    ///
///////////////////////////////////////////////////////////////////////////////


// todo - add provider

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

    /**
     * 
     * @param {Profession?} profession - профессия
     * @param {RegionData?} region - регион
     * @param {QuizData?} quiz - опрос
     */
    constructor(profession?: Profession, region: RegionData = new RegionData(), quiz: QuizData = new QuizData()) {
        this.profession = profession;
        this.region = region;
        this.quiz = quiz;
    }
}

/**
 * класс пользователя - пациента
 */
export class User {
    public name: string;
    public age: number;
    public sex: 'man' | 'woman';
    public family: User[];
    public data?: UserData;
    public Risks: RiskViewModel[];
    public id?: string


    /**
     * Пациент
     * 
     * @param {string} name - имя
     * @param {number} age - возраст(timestamp)
     * @param {string} sex - пол
     * @param {User[]?} family - список семьи
     * @param {UserData?} data - данные(регион, профессия, опрос)
     * @param {RiskViewModel[]?} Risks - риски
     * @param {string} id - id из базы
     */
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

    private static userDataStoreKey = 'appUser'
    private static currentUserStoreKey = 'currentUser'


    static get CurrentUser() {
        return localStorage.getItem(UserModel.currentUserStoreKey);
    }


    /**
     * сохранение пользователя в хранилище
     * 
     * @param {User} user 
     */
    static saveUser(user: User) {
        const stateForSave = JSON.stringify(user);
        localStorage.setItem(UserModel.userDataStoreKey, stateForSave);
    }


    /**
     * получение пользователя из хранилища
     */
    static getUserData(): User | null {
        const localStorageData = localStorage.getItem(UserModel.userDataStoreKey);

        if (!localStorageData) return null;
        return JSON.parse(localStorageData);
    }


    /**
     * сохранить активного пациента
     * 
     * @param {string} userName имя нового активного пациента
     */
    static changeCurrentUser(userName: string) {
        localStorage.setItem(UserModel.currentUserStoreKey, userName);
    }


    /**
     * найти пациента в указанном хранилище
     * 
     * @param {UserStore} userStore хранилище приложения 
     * @param {string} userName имя пациента
     */
    static getUserByName(userStore: UserStore, userName: string): User | null {
        const allUsers = [userStore.user, ...userStore.user?.family!];
        const newCurrentUser: User = allUsers.find((u) => u?.name == userName)!;

        if (!newCurrentUser) return null;
        return newCurrentUser;
    }


    /**
     * найти пациента среди всех пациентов по главному пользователю
     * 
     * @param {User} user главный пользователь
     * @param {string} userName имя пациента
     */
    static getUserByName$u(user: User, userName: string): User | null {
        const allUsers = [user, ...user?.family!];
        const newCurrentUser: User = allUsers.find((u) => u?.name == userName)!;

        if (!newCurrentUser) return null;
        return newCurrentUser;
    }


    /**
     * достаточно ли заполнены данные активного пациента
     */
    static getCurrentUserDataStatus() {
        const user: User = store.getState().user.currentUser!;
        let userDataStatus = false;
        if (UserModel.getCompleatedStatus(user) >= 50) {
            userDataStatus = true;
        }

        return userDataStatus;
    }


    /**
     * получение процента заполненности данных для пациента
     * 
     * @param {User} user пациент
     */
    static getCompleatedStatus(user: User) {
        let procent = 0;

        const isChild = getYearOffsetNow(Number(user?.age)) < 18;

        if (Boolean(user.data?.profession)) procent += isChild? 0 : 25;
        if (Boolean(user.data?.region?.main)) procent += isChild? 0 : 25;
        if (user.data?.quiz?.isDone == true) procent += isChild? 100 : 50;

        return procent;
    }


    static existsName(name: string) {
        const state: RootState = store.getState();

        const names = [state.user?.user?.name].concat(state.user?.user?.family?.map(p => p.name));

        return names.includes(name);
    }
}