"use server";

import { isAdmin, ownsStore } from "@/lib/auth";
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

// real time
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
      include: {
        Product: true,
      },
    });
    if (!store) return { success: false, error: "Store not found" };

    if (!(isAdmin(user) || ownsStore(user, store))) {
      return { success: false, error: "Unauthorized" };
    }
    if (
      user?.subscriptions[0].plan.maxProductsPerStore === store.Product.length
    )
      return {
        success: false,
        error: "You have reached the limit of products per store",
      };
    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });

    const newProduct = await prisma.product.create({
      data: { ...productData, categoryId: category.id },
    });
    revalidatePath(`/${store?.name}/products`);
    return { success: true, product: newProduct };
  } catch (error) {
    console.log("error in add product to store", error);
  }
};

// store owner see detailed information
export const getStoreById = async (storeId: string) => {
  try {
    if (!storeId) return { success: false, error: "Store id is required" };
    const user = await getAuthUser();
    if (!user) return { success: false, error: "User is required" };

    const store = await prisma.store.findUnique({
      where: {
        id: storeId,
      },
      include: {
        staff: {
          select: {
            clerkId: true,
            name: true,
            avatar: true,
            email: true,
            role: true,
          },
          orderBy: {
            role: "asc",
          },
        },
        Product: {
          select: {
            Category: true,
            name: true,
            price: true,
            quantity: true,
            stock: true,
            minStock: true,
            id: true,
          },
        },
        owner: {
          select: {
            id: true,
            clerkId: true,
            name: true,
            avatar: true,
            email: true,
            role: true,
            storeId: true,
            _count: {
              select: {
                ownedStores: true,
              },
            },
          },
        },
        _count: {
          select: {
            Product: true,
            staff: true,
          },
        },
      },
    });
    if (!store) {
      return { success: false, error: "Store not found" };
    }
    if (!ownsStore(user, store))
      return { success: false, error: "Unauthorized" };
    return { success: true, data: store };
  } catch (error) {
    console.log("error in get store", error);
  }
};
