"use client";
import Checkout from "@/components/checkout";
import { useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";

import { useSession, getSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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

export default function Plans() {
  const [frequency, setFrequency] = useState(frequencies[0]);
  const { data: session, status } = useSession();

  useEffect(() => {
    const refreshSession = async () => {
      const session = await getSession();
      console.log(session);
    };
    refreshSession();
  }, []);

  const handleDowngrade = async () => {
    const res = await fetch(`/api/stripe/cancel-subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      toast.success("正常にダウングレードしました");
    } else {
      toast.error("ダウングレードに失敗しました。運営にお問い合わせください。");
    }
  };

  function CurrentPlan({ featured }: { featured: boolean }) {
    return (
      <a
        aria-disabled
        className={cn(
          featured
            ? "bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white"
            : "bg-indigo-300 text-white shadow-sm hover:bg-indigo-300 focus-visible:outline-indigo-600",
          "mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        )}
      >
        現在のプラン
      </a>
    );
  }

  const tiers = [
    {
      name: "Free",
      id: "tier-freelancer",
      price: "無料",
      description: "ベーシックな機能は無料でご利用いただけます。",
      features: [
        "1 サイト(サブドメイン)まで作成可能",
        "3 記事まで作成可能",
        // "image upload size limit 10MB",
      ],
      featured: false,
      cta: session?.user?.isActive ? (
        <button
          onClick={handleDowngrade}
          className="mt-6 block rounded-md bg-stone-300 px-3 py-2 text-center text-sm font-semibold leading-6 text-white hover:bg-stone-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          ダウングレードする
        </button>
      ) : (
        <CurrentPlan featured={false} />
      ),
    },
    {
      name: "Standard",
      id: "tier-startup",
      price: { monthly: "¥2,000", annually: "$188" },
      description: "一般的なご利用に適したプランです。",
      features: [
        "3 サイト(サブドメイン)まで作成可能",
        "100 記事まで作成可能",
        "iframe 埋め込み機能",
        "アナリティクス (準備中)",
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
      href: "https://www.pontech.dev/contact",
      price: "Custom",
      description: "事業者向けにカスタマイズいたします。",
      features: [
        "無制限のサイト作成",
        "無制限の記事作成",
        "ホワイトラベルの提供",
        "デザインのカスタマイズ",
        "テクニカルサポート",
      ],
      featured: true,
      cta: (
        <a className="mt-6 block rounded-md bg-white/10 px-3 py-2 text-center text-sm font-semibold leading-6 text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          お問い合わせ
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
              className={cn(
                tier.featured ? "bg-gray-900 ring-gray-900" : "ring-gray-200",
                "rounded-3xl p-8 ring-1 xl:p-10",
              )}
            >
              <h3
                id={tier.id}
                className={cn(
                  tier.featured ? "text-white" : "text-gray-900",
                  "text-lg font-semibold leading-8",
                )}
              >
                {tier.name}
              </h3>
              <p
                className={cn(
                  tier.featured ? "text-gray-300" : "text-gray-600",
                  "mt-4 text-sm leading-6",
                )}
              >
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span
                  className={cn(
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
                    className={cn(
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
                className={cn(
                  tier.featured ? "text-gray-300" : "text-gray-600",
                  "mt-8 space-y-3 text-sm leading-6 xl:mt-10",
                )}
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className={cn(
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
