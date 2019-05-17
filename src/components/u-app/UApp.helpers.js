export function isAdmin(user) {
    return user.role === 'admin';
}

export function isMember(user) {
    return user.role === 'member';
}

export function isNotAuthenticated(user) {
    return !user || !user.role || user.role === 'anonymous';
}

export function isAuthenticated(user) {
    return ['admin', 'member'].includes(user.role);
}