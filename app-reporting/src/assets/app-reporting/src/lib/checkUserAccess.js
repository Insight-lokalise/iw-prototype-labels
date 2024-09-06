export const checkUserAccess = (userPermission, permissions = {}) => {
    return permissions && Object(permissions)?.length !== 0 && permissions?.[userPermission];
}