"use client";
import Checkout from "@/components/checkout";
import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";

import { useSession } from "next-auth/react";

// export default function Plans() {
//   return (
//     <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
//       <div className="flex flex-col space-y-6">
//         <h1 className="font-cal text-3xl font-bold dark:text-white">
//           Settings
//         </h1>
//         <Checkout />
//       </div>

//     </div>
//   );
// }

const frequencies = [
  { value: "monthly", label: "Monthly", priceSuffix: "/month" },
  { value: "annually", label: "Annually", priceSuffix: "/year" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Plans() {
  const [frequency, setFrequency] = useState(frequencies[0]);
  const { data: session, status } = useSession();

  function CurrentPlan({ featured }: { featured: boolean }) {
    return (
      <a
        href={""}
        aria-disabled
        className={classNames(
          featured
            ? "bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white"
            : "bg-indigo-300 text-white shadow-sm hover:bg-indigo-300 focus-visible:outline-indigo-600",
          "mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        )}
      >
        Yourr Current Plan
      </a>
    );
  }

  const tiers = [
    {
      name: "Free",
      id: "tier-freelancer",
      price: "Free",
      description: "The essentials to provide your best work for clients.",
      features: [
        "Up to 1 site",
        "Up to 3 posts",
        "image upload size limit 10MB",
      ],
      featured: false,
      cta: session?.user?.isActive ? (
        <p>downgrade</p>
      ) : (
        <CurrentPlan featured={false} />
      ),
    },
    {
      name: "Startup",
      id: "tier-startup",
      price: { monthly: "$20", annually: "$188" },
      description: "A plan that scales with your rapidly growing business.",
      features: [
        "Up to 2 sites",
        "Up to 100 posts",
        "image upload size limit 10MB",
        "Embedding Mode",
        "Advanced analytics (Under development)",
      ],
      featured: false,
      cta: session?.user?.isActive ? (
        <CurrentPlan featured={false} />
      ) : (
        <Checkout />
      ),
    },
    {
      name: "Enterprise",
      id: "tier-enterprise",
      href: "#",
      price: "Custom",
      description: "Dedicated support and infrastructure for your company.",
      features: [
        "Unlimited sites",
        "Unlimited posts",
        "Advanced analytics",
        "White-labeling",
        "Custom design",
        "Technical Support",
      ],
      featured: true,
      cta: (
        <a className="mt-6 block rounded-md bg-white/10 px-3 py-2 text-center text-sm font-semibold leading-6 text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          Contact sales
        </a>
      ),
    },
  ];

  return (
    <div className="bg-white py-24 sm:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            料金プラン
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Pricing plans for teams of all sizes
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          有料プランにすることで、より多くの記事を投稿したり、便利な機能を使うことができます。
        </p>

        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={classNames(
                tier.featured ? "bg-gray-900 ring-gray-900" : "ring-gray-200",
                "rounded-3xl p-8 ring-1 xl:p-10",
              )}
            >
              <h3
                id={tier.id}
                className={classNames(
                  tier.featured ? "text-white" : "text-gray-900",
                  "text-lg font-semibold leading-8",
                )}
              >
                {tier.name}
              </h3>
              <p
                className={classNames(
                  tier.featured ? "text-gray-300" : "text-gray-600",
                  "mt-4 text-sm leading-6",
                )}
              >
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span
                  className={classNames(
                    tier.featured ? "text-white" : "text-gray-900",
                    "text-4xl font-bold tracking-tight",
                  )}
                >
                  {typeof tier.price === "string"
                    ? tier.price
                    : tier.price[frequency.value as "monthly" | "annually"]}
                </span>
                {typeof tier.price !== "string" ? (
                  <span
                    className={classNames(
                      tier.featured ? "text-gray-300" : "text-gray-600",
                      "text-sm font-semibold leading-6",
                    )}
                  >
                    {frequency.priceSuffix}
                  </span>
                ) : null}
              </p>

              {tier.cta && <>{tier.cta}</>}
              <ul
                role="list"
                className={classNames(
                  tier.featured ? "text-gray-300" : "text-gray-600",
                  "mt-8 space-y-3 text-sm leading-6 xl:mt-10",
                )}
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className={classNames(
                        tier.featured ? "text-white" : "text-indigo-600",
                        "h-6 w-5 flex-none",
                      )}
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
