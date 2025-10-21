export const canAccess = (roles: string[], userRole: string): boolean => {
  return roles.includes(userRole);
};
