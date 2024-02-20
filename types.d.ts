import { DefaultUser, DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: DefaultUser & {
      id: string;
      stripeCustomerId: string;
      isActive: boolean;
      stripeSubscriptionId?: string;
    };
  }
  interface User extends DefaultUser {
    stripeCustomerId?: string;
    isActive?: boolean;
    stripeSubscriptionId?: string;
  }
}
