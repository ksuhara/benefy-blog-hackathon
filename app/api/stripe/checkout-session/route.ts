import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
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
  console.log(session.user, "stripeCustomerId");
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: session.user.stripeCustomerId,
    line_items: [
      {
        price: body,
        quantity: 1,
      },
    ],
    success_url: process.env.NEXT_PUBLIC_WEBSITE_URL + `/plans`,
    cancel_url: process.env.NEXT_PUBLIC_WEBSITE_URL + `/plans`,
    subscription_data: {
      metadata: {
        payingUserId: session.user.id,
      },
    },
  });
  if (!checkoutSession.url) {
    return NextResponse.json(
      {
        error: {
          code: "stripe-error",
          message: "Could not create checkout session",
        },
      },
      { status: 500 },
    );
  }
  return NextResponse.json({ session: checkoutSession }, { status: 200 });
}
