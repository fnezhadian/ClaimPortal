import type { IPublicClientApplication } from '@azure/msal-browser';
import { apiRequest } from '../authConfig';

export async function getAccessToken(instance: IPublicClientApplication, account: any): Promise<string> {
  const response = await instance.acquireTokenSilent({
    ...apiRequest,
    account,
  });
  return response.accessToken;
}