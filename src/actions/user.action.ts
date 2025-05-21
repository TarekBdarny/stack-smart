"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export const syncUser = async () => {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId || !user) return;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (existingUser) return existingUser;
    const newUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        avatar: user.imageUrl,
      },
    });
    return newUser;
  } catch (error) {
    console.log("error in sync user", error);
  }
};
export const getUserId = async () => {};
export const getUserByClerkId = async () => {};
export const getAuthUser = async () => {};
export const updateUserInfo = async () => {};
