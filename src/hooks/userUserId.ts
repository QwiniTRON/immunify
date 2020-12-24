import { useReactOidc } from '@axa-fr/react-oidc-context';

export const useUserId = (): number => {
  const { oidcUser } = useReactOidc();

  console.log(oidcUser);
  
  return Number(oidcUser.profile.sub);
}
