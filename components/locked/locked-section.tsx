"use client";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

import {
  Connector,
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import SignMessageButton from "./sign-message-button";
import Link from "next/link";
import { LockedContent } from "./locked-content";

export function WalletOptions() {
  const { connectors, connect } = useConnect();
  return (
    <div className="mt-8 flex">
      {connectors[0] && (
        <WalletOption
          connector={connectors[0]}
          onClick={() => connect({ connector: connectors[0] })}
        />
      )}
      {connectors[1] && (
        <WalletOption
          connector={connectors[1]}
          onClick={() => connect({ connector: connectors[1] })}
        />
      )}
    </div>
  );
}

function WalletOption({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => void;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <button
      disabled={!ready}
      onClick={onClick}
      className="mx-2 w-full rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
    >
      {connector.name} で接続
    </button>
  );
}

export function LockedSection({
  params,
}: {
  params: {
    domain: string;
    slug: string;
    nftLockConditions: {
      id: string;
      chainId: string;
      contractAddress: string;
      postId: string;
      collectionName: string | null;
    }[];
    conditionLogic: string;
  };
}) {
  const { isConnected } = useAccount();
  console.log(isConnected, "isConnected");

  const { domain, slug } = params;

  return (
    <>
      <div className="mx-auto my-8 w-10/12 text-center md:w-7/12">
        {/* <!-- Card container --> */}
        <div className="overflow-hidden rounded-lg border-dashed bg-stone-100 shadow-md dark:bg-stone-200">
          {/* <!-- Card header --> */}
          <div className="border-b border-dashed border-stone-300 p-5">
            <h1 className="text-lg font-semibold">続きをみるには</h1>
            <p className="text-sm text-stone-600">残り 3,912字 / 5画像</p>
            {params.nftLockConditions.length >= 2 && (
              <>
                {params.conditionLogic === "AND" ? (
                  <p className="text-sm text-stone-600">
                    以下の条件を全て満たす場合にのみコンテンツが閲覧可能です。
                  </p>
                ) : (
                  <p className="text-sm text-stone-600">
                    以下の条件のいずれかを満たす場合にコンテンツが閲覧可能です。
                  </p>
                )}
              </>
            )}
          </div>
          {/* <!-- Card body --> */}
          <div className="p-5">
            {/* <!-- Price display --> */}
            <div className="my-4">
              {params.nftLockConditions.map((condition, i) => (
                <div key={i} className="mb-4 flex items-center justify-between">
                  <Link
                    href={`https://mumbai.polygonscan.com/address/${condition.contractAddress}`}
                    target="_blank"
                  >
                    <span className="text-sm font-medium text-blue-800 underline">
                      {condition.collectionName} の保有
                    </span>
                  </Link>
                  <span className="text-lg font-semibold text-gray-900">
                    ¥500
                  </span>
                </div>
              ))}
            </div>

            {/* <!-- Main action button --> */}
            {/* <button className="w-full rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-green-600">
              購入手続きへ
            </button> */}
            {isConnected ? (
              <>
                <Account />
                <SignMessageButton />
              </>
            ) : (
              <WalletOptions />
            )}
            {/* <!-- Subscription option --> */}
            {/* <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">
                  定期購読オプション
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  ¥1,000/月 ▼
                </span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      {isConnected && <LockedContent params={{ domain, slug }} />}
    </>
  );
}

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  return (
    <div className="flex items-center justify-between">
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && (
        <div>
          Connected:{" "}
          {ensName
            ? `${ensName} (${address})`
            : address?.substring(0, 12) + "..."}
        </div>
      )}
      <button
        className={
          "ml-4 flex h-7 w-24 items-center justify-center space-x-2 rounded-lg bg-stone-500 text-sm text-white transition-all hover:bg-white hover:text-black focus:outline-none active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
        }
        onClick={() => {
          disconnect();
          signOut({
            redirect: false,
          });
        }}
      >
        Disconnect
      </button>
    </div>
  );
}
