import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {UserModel} from '../models/User';

export function usePathByMainUser(isMainUserPath: string, patientPath: string) {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const user = useSelector((state: RootState) => state.user.user);
  const isMainUser = currentUser == user;
  const PathToBack = isMainUser ? isMainUserPath : patientPath;

  return PathToBack;
}

// возвращяет статус заполнения данных опльзователя
export function useCheckUserDataCompoeated() {
  return UserModel.getCurrentUserDataStatus();
}

export function useIsEmptyFamily() {
  const user = useSelector((state: RootState) => state.user.user);
  return user?.family?.length == 0;
}