// /lib/auth.ts
import { User, StoreDetails } from "../types/index";
export function isAdmin(user: User) {
  if (!user) {
    throw new Error("User is required");
  }
  return user.role === "ADMIN";
}

export function ownsStore(user: User, store: StoreDetails) {
  if (!user || !store) {
    throw new Error("User is required");
  }
  return user.role === "OWNER" && store.ownerId === user.id;
}

export function worksAtStore(user: User, store: StoreDetails) {
  if (!user || !store) {
    throw new Error("User is required");
  }
  return user.role === "STAFF" && user.storeId === store.id;
}
