"use server";

import { isAdmin, ownsStore, worksAtStore } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "./user.action";
import { revalidatePath } from "next/cache";

interface ProductInput {
  name: string;
  stock: number;
  quantity: number;
  price: number;
  minStock: number;
  storeId: string;
  categoryName: string;
}

export const getStoreProfits = async () => {};
export const getStoreOrders = async () => {};

export const addProductToStore = async (data: ProductInput) => {
  const { categoryName, ...productData } = data;
  try {
    const user = await getAuthUser();
    if (!user) return { success: false, error: "User is required" };
    const store = await prisma.store.findUnique({
      where: {
        id: productData.storeId,
      },
    });
    if (!store) return { success: false, error: "Store not found" };

    if (!(isAdmin(user) || ownsStore(user, store))) {
      return { success: false, error: "Unauthorized" };
    }
    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });

    const newProduct = await prisma.product.create({
      data: { ...productData, categoryId: category.id },
    });
    revalidatePath(`/stores/${productData.storeId}`);
    return { success: true, product: newProduct };
  } catch (error) {
    console.log("error in add product to store", error);
  }
};
