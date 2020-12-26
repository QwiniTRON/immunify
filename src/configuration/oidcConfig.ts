import { UserManagerSettings } from 'oidc-client';

export const ProductionConfig: UserManagerSettings = {
  authority: '/',
  client_id: 'react-client',
  client_secret: 'react-secret',
  scope: 'openid profile offline_access',
  response_type: 'code',

  redirect_uri: 'https://app.immunify.co/app/authentication/callback',
  silent_redirect_uri: 'https://app.immunify.co/app/authentication/silent_callback',
  automaticSilentRenew: true,
}

export const DeveloperConfig: UserManagerSettings = {
  authority: 'https://app.immunify.co/',
  client_id: 'react-client',
  client_secret: 'react-secret',
  scope: 'openid profile offline_access',
  response_type: 'code',

  clockSkew: 1e6,

  redirect_uri: 'http://localhost:3000/authentication/callback',
  silent_redirect_uri: 'http://localhost:3000/authentication/silent_callback',
  automaticSilentRenew: true,
}