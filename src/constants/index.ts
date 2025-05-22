// This happens ONCE during app setup/deployment
export const plans = {
  EXPLORER: {
    name: "Explorer",
    price: 0,
    maxStores: 0,
    features: {
      support: { level: "community" },
      limits: { maxWishlistItems: 50 },
    },
  },

  STARTER: {
    name: "Starter",
    price: 29.99,
    maxStores: 1,
    features: {
      analytics: { enabled: true, basic: true },
      support: { level: "email" },
      limits: {
        maxProductImages: 5,
        maxStaffPerStore: 2,
        storageGB: 10,
      },
    },
  },

  GROWTH: {
    name: "Growth",
    price: 79.99,
    maxStores: 5,
    features: {
      analytics: { enabled: true, advanced: true },
      support: { level: "priority", phoneSupport: true },
      limits: {
        maxProductImages: 15,
        maxStaffPerStore: 10,
        storageGB: 100,
      },
      integrations: { stripeConnect: true, mailchimp: true },
    },
  },

  ENTERPRISE: {
    name: "Enterprise",
    price: 199.99,
    maxStores: -1, // Unlimited
    features: {
      analytics: { enabled: true, advanced: true, realTime: true },
      support: {
        level: "dedicated",
        phoneSupport: true,
        dedicatedManager: true,
      },
      limits: {
        maxProductImages: -1, // Unlimited
        maxStaffPerStore: -1, // Unlimited
        storageGB: 1000,
      },
      integrations: { stripeConnect: true, mailchimp: true, zapier: true },
      customization: { customThemes: true, customDomain: true },
    },
  },
};
