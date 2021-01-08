import { RootState } from '..';
import { AppDataStore } from '.';
import {
  APPDATA_SET_DATA
} from '../consts';
import {
  AppDataAction
} from '../types';
import { AxiosFetcher, CalculateRisk, GetQuestionnaire } from '../../server';
import { getYearOffsetNow } from '../../utils';
import { updateMember } from '../user/action';


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

export function claculateRisks(authOidc: string) {
  return async function (dispatch: Function, getState: Function) {
    const fetcher = new AxiosFetcher(CalculateRisk, authOidc);
    const state: RootState = getState();
    const currentUser = state.user.currentUser;

    if (!currentUser) return;

    const lastQuestionnaireId = currentUser?.data?.quiz?.questionnaireId;
    const userAnswersIds = currentUser?.data?.quiz?.answers.map((a) => Number(a.answerId));
    const userId = currentUser?.id;
    const userProfessionId = currentUser?.data?.profession?.id;
    const userRegionId = currentUser?.data?.region?.main?.id;

    const calculateReq = await fetcher.Fetch({
      answerIds: userAnswersIds!,
      patientId: Number(userId),
      professionId: Number(userProfessionId),
      questionnaireId: Number(lastQuestionnaireId)!,
      regionId: Number(userRegionId)
    });

    if (calculateReq.succeeded) {
      await dispatch(updateMember({ Risks: (calculateReq.data as any) }, currentUser.name));
    }

    return;
  }
}


export function appDataInit(authOidc: string) {
  return async function (dispatch: Function, getState: Function) {
    const fetcher = new AxiosFetcher(GetQuestionnaire, authOidc);
    const state: RootState = getState();
    const currentUser = state.user.currentUser;

    if (!currentUser) return;

    const currentUserAge = getYearOffsetNow(Number(currentUser?.age));
    const currentUserMale = currentUser?.sex == 'man' ? 'М' : 'Ж';

    const appDataReq = await fetcher.Fetch({ age: currentUserAge, male: currentUserMale });

    if (appDataReq.succeeded) {
      dispatch(setData(appDataReq.data as object));
    }

    return;
  }
}


