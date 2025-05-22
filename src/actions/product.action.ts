"use server";

import { prisma } from "@/lib/prisma";
import { getAuthUser } from "./user.action";
import { isAdmin, ownsStore, worksAtStore } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const getProductById = async (productId: string) => {
  try {
    if (!productId) return;
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        Category: true,
      },
    });
    if (!product) return { success: false, error: "Product not found" };
    return { success: true, data: product };
  } catch (error) {
    console.log("error in get product by id", error);
  }
};
export const updateProduct = async (
  productId: string,
  storeId: string,
  productData: Prisma.ProductUpdateInput
) => {
  try {
    const user = await getAuthUser();
    if (!user) return;
    const store = await prisma.store.findUnique({
      where: {
        id: storeId,
      },
    });

    if (!(ownsStore(user, store) || worksAtStore(user, store))) {
      return { success: false, error: "Unauthorized to edit this product" };
    }
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        storeId: storeId, // Ensure product belongs to specified store
      },
    });

    if (!product) {
      return { success: false, error: "Product not found in this store" };
    }

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        ...productData,
      },
    });
    revalidatePath(`/${store?.name}/products`);
    return { success: true, message: "Product updated successfully" };
  } catch (error) {
    console.log("error in update product", error);
  }
};
export const deleteProduct = async (productId: string, storeId: string) => {
  try {
    if (!productId || !storeId) return;
    const user = await getAuthUser();
    if (!user) return;
    const store = await prisma.store.findUnique({
      where: {
        id: storeId,
      },
    });
    if (!store) return { success: false, error: "Store not found" };
    if (!(ownsStore(user, store) || isAdmin(user))) {
      return { success: false, error: "Unauthorized to delete this product" };
    }
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        storeId: storeId, // Ensure product belongs to specified store
      },
    });

    if (!product) {
      return { success: false, error: "Product not found in this store" };
    }
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });
    revalidatePath(`/${store?.name}/products`);
    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    console.log("error in delete product", error);
  }
};
