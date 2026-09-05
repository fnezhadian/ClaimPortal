export function isAdmin(account: any): boolean {
  const roles = account?.idTokenClaims?.roles as string[] | undefined;
  return roles?.includes('Admin') ?? false;
}