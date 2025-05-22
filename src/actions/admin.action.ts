"use server";

import { prisma } from "@/lib/prisma";
import { StoreData } from "@/types";
import { getAuthUser } from "./user.action";

export const confirmStoreRequest = async (requestId: string) => {
  try {
    if (!requestId) return;

    const user = await getAuthUser();
    if (!user) return;
    // update the storeRequest to approved
    const request = await prisma.storeRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: "APPROVED",
        responseById: user.id,
      },
      include: {
        requester: true,
        responseBy: true,
      },
    });
    // create the store
    const store = await createStore({ ...request });
    // promote the user to be an OWNER
    await prisma.user.update({
      where: {
        id: request.requester.id,
      },
      data: {
        role: "OWNER",
        storeId: store?.data.id,
      },
    });
    // send mail
    return { success: true, message: "Store created successfully" };
  } catch (error) {
    console.log("error in confirm store request", error);
  }
};
export const rejectStoreRequest = async (
  requestId: string,
  description: string
) => {
  try {
    if (!requestId) return;
    await prisma.storeRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: "REJECTED",
        description,
      },
    });
    // send mail
    return { success: true, message: "Store request rejected successfully" };
  } catch (error) {
    console.log("error in reject store request", error);
  }
};
export const getAllRequestedStores = async () => {
  try {
    const stores = await prisma.storeRequest.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        requester: true,
      },
    });
    return { success: true, data: stores ? stores : [] };
  } catch (error) {
    console.log("error in get all requested stores", error);
  }
};
export const getAllStores = async () => {
  try {
    const stores = await prisma.store.findMany({
      include: {
        _count: {
          select: {
            Product: true,
            staff: true,
          },
        },
      },
    });
    return { success: true, data: stores ? stores : [] };
  } catch (error) {
    console.log("error in get all stores", error);
  }
};

//helper
export const createStore = async (storeData: StoreData) => {
  try {
    const newStore = await prisma.store.create({
      data: {
        name: storeData.name,
        location: storeData.location,
        workHours: storeData.workHours,
        isOpen: false,
        ownerId: storeData.requesterId,
      },
    });
    return { success: true, data: newStore };
  } catch (error) {
    console.log("error in create store", error);
  }
};
