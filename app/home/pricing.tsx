import { cn } from "@/lib/utils";
import { CheckIcon } from "@heroicons/react/20/solid";

const url = process.env.NEXT_PUBLIC_VERCEL_ENV
  ? `https://app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  : `http://app.localhost:8888`;
const tiers = [
  {
    name: "Free",
    id: "tier-hobby",
    href: url,
    priceMonthly: "無料",
    description: "ベーシックな機能は無料でご利用いただけます。",
    features: ["1 サイト(サブドメイン)まで作成可能", "3 記事まで作成可能"],
    featured: false,
    cta: "はじめる",
  },
  {
    name: "Standard",
    id: "tier-standard",
    href: `${url}/plans`,
    priceMonthly: "¥2,000",
    description: "一般的なご利用に適したプランです。",
    features: [
      "3 サイト(サブドメイン)まで作成可能",
      "100 記事まで作成可能",
      "iframe 埋め込み機能",
      "アナリティクス (準備中)",
    ],
    featured: true,
    cta: "プランページへ",
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "https://pontech.dev/contact",
    priceMonthly: "カスタム",
    description: "事業者向けにカスタマイズいたします。",
    features: [
      "無制限のサイト作成",
      "無制限の記事作成",
      "ホワイトラベルの提供",
      "デザインのカスタマイズ",
      "テクニカルサポート",
    ],
    featured: false,
    cta: "セールスにお問い合わせ",
  },
];

export default function Pricing() {
  return (
    <div className="relative isolate mt-32 bg-white px-6 sm:mt-56 lg:px-8">
      <div
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
        aria-hidden="true"
      >
        <div
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
        <h2 className="text-base font-semibold leading-7 text-indigo-600">
          Pricing plans for teams of all sizes
        </h2>
        <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          ご利用プラン
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
        有料プランにすることで、より多くの記事を投稿したり、便利な機能を使うことができます。
      </p>
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={cn(
              tier.featured
                ? "relative bg-gray-900 shadow-2xl"
                : "bg-white/60 sm:mx-8 lg:mx-0",
              tier.featured
                ? ""
                : tierIdx === 0
                  ? "rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-tr-none"
                  : "sm:rounded-t-none lg:rounded-bl-none lg:rounded-tr-3xl",
              "rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10",
            )}
          >
            <h3
              id={tier.id}
              className={cn(
                tier.featured ? "text-indigo-400" : "text-indigo-600",
                "text-base font-semibold leading-7",
              )}
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={cn(
                  tier.featured ? "text-white" : "text-gray-900",
                  "text-5xl font-bold tracking-tight",
                )}
              >
                {tier.priceMonthly}
              </span>
              {tier.id == "tier-standard" && (
                <span
                  className={cn(
                    tier.featured ? "text-gray-400" : "text-gray-500",
                    "text-base",
                  )}
                >
                  /月
                </span>
              )}
            </p>
            <p
              className={cn(
                tier.featured ? "text-gray-300" : "text-gray-600",
                "mt-6 text-base leading-7",
              )}
            >
              {tier.description}
            </p>
            <ul
              role="list"
              className={cn(
                tier.featured ? "text-gray-300" : "text-gray-600",
                "mt-8 space-y-3 text-sm leading-6 sm:mt-10",
              )}
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    className={cn(
                      tier.featured ? "text-indigo-400" : "text-indigo-600",
                      "h-6 w-5 flex-none",
                    )}
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href={tier.href}
              aria-describedby={tier.id}
              className={cn(
                tier.featured
                  ? "bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500"
                  : "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600",
                "mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10",
              )}
            >
              {tier.cta}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
