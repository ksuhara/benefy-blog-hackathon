import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      {
        message: "Bad request",
      },
      {
        status: 400,
      },
    );
  }
  try {
    const body = await request.arrayBuffer();
    const event = stripe.webhooks.constructEvent(
      Buffer.from(body),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );

    // Return a response to acknowledge receipt of the event.
    // Getting the data we want from the event
    const subscription = event.data.object as Stripe.Subscription;

    switch (event.type) {
      case "customer.subscription.created":
        console.log(`🔔 Subscription created: ${subscription.id}`);
        console.log(`🔔 Subscription status: ${subscription.customer}`);
        await prisma.user.update({
          // Find the customer in our database with the Stripe customer ID linked to this purchase
          where: {
            stripeCustomerId: subscription.customer as string,
          },
          // Update that customer so their status is now active
          data: {
            stripeSubscriptionId: subscription.id,
            isActive: true,
          },
        });
        break;
      case "customer.subscription.deleted":
        await prisma.user.update({
          // Find the customer in our database with the Stripe customer ID linked to this purchase
          where: {
            stripeCustomerId: subscription.customer as string,
          },
          // Update that customer so their status is now active
          data: {
            isActive: false,
          },
        });
        break;
      default:
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    const errorMessage = `⚠️  Webhook signature verification failed. ${
      (err as Error).message
    }`;
    console.log(errorMessage);
    return new Response(errorMessage, {
      status: 400,
    });
  }
}
