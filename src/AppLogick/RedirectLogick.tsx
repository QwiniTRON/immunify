import React, {FC} from 'react';
import { Secure } from '../components';

export const appValidation = (tokenToCheck: string) => tokenToCheck.length > 0;
export const loginValidation = (tokenToCheck: string) => tokenToCheck.length === 0;

type SecureProps = {
  children: JSX.Element,
}

export const ApplicationSecure: FC<SecureProps> = (props) => (
  <Secure validation={appValidation} redirect="/">
    {props.children}
  </Secure>
);

export const LoginnSecure: FC<SecureProps> = (props) => (
  <Secure validation={loginValidation} redirect="/profile">
    {props.children}
  </Secure>
);