// /lib/auth.ts
export function hasRole(user, ...roles) {
  return roles.includes(user.role);
}

export function ownsStore(user, store) {
  return user.role === "OWNER" && store.ownerId === user.id;
}

export function worksAtStore(user, store) {
  return user.role === "STAFF" && user.storeId === store.id;
}
