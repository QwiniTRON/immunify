import {
  APPDATA_SET_DATA
} from '../consts';
import {
  AppDataAction
} from '../types';
import { Questionnaire } from '../../type';



export type AppDataStore = {
  regions?: string[]
  professions?: string[]
  questionnaire?: Questionnaire
}


const initialState: AppDataStore = {
  regions: [],
  professions: [],
  questionnaire: undefined
}

// funcs
const setData = (state: AppDataStore = initialState, action: AppDataAction) => {
  if (action.type !== APPDATA_SET_DATA) return state;

  return Object.assign({}, state, action.newState);
}

// dictionary
const handlerDictionary: { [p: string]: any } = {
  [APPDATA_SET_DATA]: setData
}

// reducer
export const AppDataReducer = function (state: AppDataStore = initialState, action: AppDataAction): AppDataStore {
  const handler = handlerDictionary[action?.type];
  return handler ? handler.call(null, state, action) : state;
}