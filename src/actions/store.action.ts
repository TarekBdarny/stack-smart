"use server";

import { isAdmin, ownsStore } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StoreData } from "@/types";
import { getAuthUser } from "./user.action";
import { canCreateStore } from "@/lib/plans";
import { revalidatePath } from "next/cache";

// for normal users
export const getStoreProductsByStoreId = async (id: string) => {
  try {
    // id: storeId
    if (!id) return { success: false, error: "Store id is required" };
    const products = await prisma.product.findMany({
      where: {
        storeId: id,
      },
      include: {
        Category: true,
      },
    });
    return { success: true, data: !products ? [] : products };
  } catch (error) {
    console.log("error in get store products", error);
  }
};
export const deleteStore = async (storeId: string) => {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return { success: false, error: "User is required" };

    if (!storeId) return;

    const store = await prisma.store.findUnique({
      where: {
        id: storeId,
      },
    });
    if (!store) return { success: false, error: "Store not found" };
    if (!(isAdmin(authUser) || ownsStore(authUser, store))) {
      return { success: false, error: "Unauthorized to delete this store" };
    }
    await prisma.store.delete({
      where: {
        id: storeId,
      },
    });
    revalidatePath("/");
    return { success: true, message: "Store deleted successfully" };
  } catch (error) {
    console.log("error in delete store", error);
  }
};
// for normal users
export const getStoreProductsByCategory = async (
  category: string,
  storeId: string
) => {
  try {
    if (!storeId) return { success: false, error: "Store id is required" };
    if (!category) return { success: false, error: "Category is required" };
    const products = await prisma.product.findMany({
      where: {
        storeId,
        Category: {
          name: category,
        },
      },
      include: {
        Category: true,
      },
    });
    if (!products) return [];
    return products;
  } catch (error) {
    console.log("error in get store products", error);
  }
};
export const getRandomStore = async () => {
  try {
    const store = await prisma.store.findFirst();
    return store;
  } catch (error) {
    console.log("error in get random store", error);
  }
};

export const requestToOpenStore = async (storeData: StoreData) => {
  try {
    const authUser = await getAuthUser();
    if (!storeData.requesterId || !authUser) return;
    if (isAdmin(authUser))
      return { success: false, error: "Admins cannot request a store" };
    if (!canCreateStore(authUser.id))
      return { success: false, error: "You cannot create more stores" };

    const user = await prisma.user.findUnique({
      where: {
        id: storeData.requesterId,
      },
    });
    if (!user) return { success: false, error: "User not found" };

    await prisma.storeRequest.create({
      data: storeData,
    });
    return { success: true, message: "Store request sent successfully!" };
  } catch (error) {
    console.log("error in request store", error);
  }
};
