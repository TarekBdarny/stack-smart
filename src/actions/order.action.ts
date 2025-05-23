"use server";

import { prisma } from "@/lib/prisma";
import { getAuthUser } from "./user.action";
import { ownsStore, worksAtStore } from "@/lib/auth";

export const placeOrder = async (orderItems: unknown) => {};
export const updateOrderStatus = async () => {};

export const getAllOrders = async (storeId: string) => {
  try {
    const user = await getAuthUser();
    if (!user || !storeId) return;

    const store = await prisma.store.findUnique({
      where: {
        id: storeId,
      },

      include: {
        Orders: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            price: true,
            customer: {
              select: {
                clerkId: true,
                id: true,
                name: true,
                avatar: true,
              },
            },
            OrderItem: {
              select: {
                orderId: true,
                price: true,
                quantity: true,
                Product: {
                  select: {
                    Category: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            Orders: true,
            Product: true,
          },
        },
      },
    });
    if (!store) return { success: false, error: "Store not found" };
    if (!(ownsStore(user, store) || worksAtStore(user, store))) {
      return { success: false, error: "Unauthorized to view this store" };
    }
    return { success: true, data: store };
  } catch (error) {
    console.log("error in get all orders", error);
  }
};
