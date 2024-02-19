"use client";
import { getStripe } from "@/lib/stripe";
import { useState } from "react";

export default function Checkout() {
  const [type, setType] = useState<string>("monthly");
  const [plan, setPlan] = useState<string>(
    process.env.NEXT_PUBLIC_VERCEL_ENV
      ? "price_1OlRpmDg03Vrdi3nXazFHRc6"
      : "price_1OkPmfDg03Vrdi3nCzdTl2BU",
  );

  const handleCreateCheckoutSession = async (productId: string) => {
    const res = await fetch(`/api/stripe/checkout-session`, {
      method: "POST",
      body: JSON.stringify(productId),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const checkoutSession = await res.json().then((value) => {
      return value.session;
    });

    const stripe = await getStripe();
    const { error } = await stripe!.redirectToCheckout({
      sessionId: checkoutSession.id,
    });

    console.warn(error.message);
  };

  return (
    <button
      className="mt-6 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      onClick={() => handleCreateCheckoutSession(plan)}
    >
      アップグレードする
    </button>
  );
}
