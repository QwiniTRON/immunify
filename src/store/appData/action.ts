import { RootState } from '..';
import { AppDataStore } from '.';
import {
  APPDATA_SET_DATA
} from '../consts';
import {
  AppDataAction
} from '../types';
import { AxiosFetcher, GetQuestionnaire } from '../../server';
import { getYearOffestNow } from '../../utils';


//  ***************************
//? ********** STATIC *********
//  ***************************
export function setData(newState: Partial<AppDataStore>): AppDataAction {
  return {
    type: APPDATA_SET_DATA,
    newState
  }
}



//  ***************************
//? ********** ASYNC **********
//  ***************************

export function appDataInit(authOidc: string) {
  return async function (dispatch: Function, getState: Function) {
    const fetcher = new AxiosFetcher(GetQuestionnaire, authOidc);
    const state: RootState = getState();
    const currentUser = state.user.currentUser;

    if (!currentUser) return;

    const currentUserAge = getYearOffestNow(Number(currentUser?.age));
    const currentUserMale = currentUser?.sex == 'man' ? 'М' : 'Ж';

    const appDataReq = await fetcher.Fetch({ age: currentUserAge, male: currentUserMale });

    if (appDataReq.succeeded) {
      dispatch(setData(appDataReq.data as object));
    }

    return;
  }
}


