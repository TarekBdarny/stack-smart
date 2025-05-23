import { Plan } from "@prisma/client";
import { prisma } from "./prisma";

export async function canCreateStore(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      ownedStores: true,
      subscriptions: {
        where: { status: "ACTIVE" },
        include: { plan: true },
      },
    },
  });

  if (!user) return { success: false, error: "User not found" };

  const currentPlan = user.subscriptions[0]?.plan;
  const currentStoreCount = user.ownedStores.length;

  // FREE plan: maxStores = 0, so this returns false
  // TIER_1: maxStores = 1, allows 1 store
  if (!currentPlan) return false;
  return currentStoreCount < currentPlan.maxStores;
}
export function hasFeature(userPlan: Plan, featurePath: string): boolean {
  const features = userPlan.features as any;
  const keys = featurePath.split(".");

  let current = features;
  for (const key of keys) {
    if (!current?.[key]) return false;
    current = current[key];
  }

  return current === true;
}

// Usage
// const canUseAdvancedAnalytics = hasFeature(plan, 'analytics.advanced');
// const hasPhoneSupport = hasFeature(plan, 'support.phoneSupport');
