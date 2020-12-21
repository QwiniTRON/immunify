import { User } from "../store/types";
import { UserStore } from '../store/user';
import { RootState, store } from '../store';

///////////////////////////////////////////////////////////////////////////////
// * methodName$suffix - Это тот же метод только с перегрузкой параметров  *///
///////////////////////////////////////////////////////////////////////////////

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
        const user: RootState = store.getState();
        let userDataStatus = false;
        if (user.user.currentUser?.data?.quiz?.length == 5) {
            userDataStatus = true;
        }

        return userDataStatus;
    }
}