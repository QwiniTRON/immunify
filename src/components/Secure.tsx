import React, { FC } from 'react';

import { useAccessToken } from '../hooks/useAccessToken';

type Props = {
  children: JSX.Element,
  validation: (token: string) => boolean,
  redirect?: string,
}

export const Secure: FC<Props> = ({ children, validation, redirect }: Props) => {
  const { token } = useAccessToken();

  if (redirect !== undefined && redirect !== null && !validation(token)) {
    window.location.href = redirect!;
  }

  return (
    <div>
      { validation(token) && children }
    </div>
  );
}
