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
export const getUserId = async () => {
  const { userId } = await auth();
  if (!userId) return;
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (!user) return;
    return user.id;
  } catch (error) {
    console.log("error in get user id", error);
  }
};
export const getUserByClerkId = async (clerkId: string) => {
  if (!clerkId) return;
  return prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      Order: true,
      _count: {
        select: {
          Order: true,
        },
      },
    },
  });
};
export const getAuthUser = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User is required");
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (!user) throw new Error("User not found!");
    return user;
  } catch (error) {
    console.log("error in get auth user", error);
  }
};
export const updateUserInfo = async () => {};
