import {
  ArrowPathIcon,
  CheckIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  FingerPrintIcon,
  LockClosedIcon,
  ServerIcon,
  PencilSquareIcon,
  ShoppingCartIcon,
  ShoppingBagIcon,
  WalletIcon,
} from "@heroicons/react/20/solid";

const features = [
  {
    name: "WYSIWYG",
    description: "Notionライクなエディターでカンタンに記事を編集できます。",
    icon: PencilSquareIcon,
  },
  {
    name: "NFT保有者限定コンテンツの作成",
    description:
      "チェーン、コントラクトアドレスを指定して閲覧条件を設定できます。",
    icon: LockClosedIcon,
  },
  {
    name: "販売ページへの導線",
    description:
      "NFT入手ページを設定し、マーケティングに繋げることもできます。",
    icon: ShoppingBagIcon,
  },
];
export default function Features() {
  return (
    <div className="mt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2
            id="features"
            className="text-base font-semibold leading-7 text-indigo-600"
          >
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            NFTゲート付き記事をカンタンに作成
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            発行したNFTに付加価値をつけたい！NFT保有者限定コンテンツを作りたい！でもエンジニアがいないと意外と難しい。そんなお悩みを解決します。
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <img
            src="/lp-service.png"
            alt="App screenshot"
            className="rounded-xl shadow-2xl ring-1 ring-gray-900/10"
            width={1442}
            height={1442}
          />
          <div className="relative" aria-hidden="true">
            <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]" />
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-9">
              <dt className="inline font-semibold text-gray-900">
                <feature.icon
                  className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                  aria-hidden="true"
                />
                {feature.name}
              </dt>{" "}
              <dd>{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
