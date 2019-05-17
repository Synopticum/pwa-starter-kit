export function isAdmin(user) {
    return user.role === 'admin';
}

export function isMember(user) {
    return user.role === 'member';
}

export function isAnonymous(user) {
    return user && user.role === 'anonymous';
}