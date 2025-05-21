"use server";

import { prisma } from "@/lib/prisma";

export const addOrder = async () => {};
export const updateOrderStatus = async () => {};
export const test = async (name: string) => {
  try {
    await prisma.category.create({
      data: {
        name,
      },
    });
  } catch (error) {
    console.log("error in test with database", error);
  }
};
export const test2 = async () => {
  try {
    const categories = await prisma.category.findMany();
    return categories;
  } catch (error) {
    console.log("error in test 2 ", error);
  }
};
