import React from 'react';
import { useSelector } from 'react-redux';
import { useServer } from '.';
import { UserModel } from "../models/User";
import { UpdatePersonality } from '../server';
import { RootState } from "../store";
import { decodeUserPersonality } from '../utils';


export function useUpdatePersonality() {
  const mainUser = useSelector((state: RootState) => state.user.user);
  const updatePersonalityReq = useServer(UpdatePersonality);

  return () => {
    if (mainUser?.savePersonality) {
      const userData = UserModel.MainUser;

      if (userData) {
        updatePersonalityReq.fetch({
          NewPersonalityState: decodeUserPersonality(userData)
        });
      }
    }
  }
}