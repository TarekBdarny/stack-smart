"use server";

import { prisma } from "@/lib/prisma";
import { StoreData } from "@/types";

export const syncStore = async () => {};
export const getStoreById = async (storeId: string) => {
  try {
    if (!storeId) return { success: false, error: "Store id is required" };
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
    return { success: true, data: store };
  } catch (error) {
    console.log("error in get store", error);
  }
};

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
    if (!storeData.requesterId) return;
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
