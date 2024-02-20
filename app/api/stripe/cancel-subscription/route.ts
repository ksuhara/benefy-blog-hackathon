import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY!, {
    apiVersion: "2023-10-16",
  });

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      {
        error: {
          code: "no-access",
          message: "You are not signed in.",
        },
      },
      { status: 401 },
    );
  }
  console.log(session.user.stripeSubscriptionId, "stripeSubscriptionId");
  if (!session.user.stripeSubscriptionId) {
    return NextResponse.json(
      {
        error: {
          code: "stripe-error",
          message: "User does not have subscription",
        },
      },
      { status: 500 },
    );
  }
  const cancelSession = await stripe.subscriptions.cancel(
    session.user.stripeSubscriptionId,
  );

  return NextResponse.json({ session: cancelSession }, { status: 200 });
}
