import { getRandomStore, getStoreById } from "@/actions/store.action";
import { getAuthUser } from "@/actions/user.action";

export type User = Awaited<ReturnType<typeof getAuthUser>>;
export type Roles = ["OWNER", "STAFF", "CUSTOMER", "ADMIN"];
export type Store = Awaited<ReturnType<typeof getStoreById>>;
export type StoreDetails = Awaited<ReturnType<typeof getRandomStore>>;
export const ROLES = ["OWNER", "STAFF", "CUSTOMER", "ADMIN"] as const;
export interface StoreData {
  name: string;
  location: string;
  workHours: string;
  requesterId: string;
}
