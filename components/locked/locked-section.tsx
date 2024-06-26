"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

import { PetraWallet } from "petra-plugin-wallet-adapter";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

import {
  Connector,
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import SignMessageButton from "./sign-message-button";
import SignMessageButtonAptos from "./sign-message-button-aptos";
import Link from "next/link";
import { LockedContent } from "./locked-content";
import BlurImage from "../blur-image";
import useWindowSize from "@/lib/hooks/use-window-size";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

const aptosWallets = [new PetraWallet()];

export function WalletOptions() {
  const { connectors, connect } = useConnect();
  const { isMobile, isDesktop } = useWindowSize();

  return (
    <>
      {isDesktop && (
        <div className="mt-8 grid gap-2 sm:grid sm:grid-cols-2">
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
      )}
      {isMobile && (
        <div className="mt-8 grid gap-2 sm:grid sm:grid-cols-2">
          {/* {connectors[0] && (
            <WalletOption
              connector={connectors[2]}
              onClick={() => connect({ connector: connectors[2] })}
            />
          )} */}
          {connectors[1] && (
            <WalletOption
              connector={connectors[1]}
              onClick={() => connect({ connector: connectors[1] })}
            />
          )}
        </div>
      )}
    </>
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
      className={cn(
        "w-full rounded-xl px-4 py-2 text-white ",
        connector.name === "Injected"
          ? "bg-orange-500 hover:bg-orange-600"
          : "bg-blue-400 hover:bg-blue-500",
      )}
    >
      {connector.name === "Injected" ? "Metamask" : connector.name} で接続
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
      collectionLogo: string | null;
      marketUrl: string | null;
    }[];
    conditionLogic: string;
    contentLockedLength: number | null;
    contentLockedImagesCount: number | null;
  };
}) {
  const { isConnected } = useAccount();
  const [isSignedAptos, setIsSignedAptos] = useState(false);

  const {
    domain,
    slug,
    nftLockConditions,
    conditionLogic,
    contentLockedLength,
    contentLockedImagesCount,
  } = params;

  return (
    <>
      <div className="mx-auto my-8 w-10/12 text-center md:w-7/12">
        {/* <!-- Card container --> */}
        <div className="overflow-hidden rounded-lg border-dashed bg-stone-100 shadow-md dark:bg-stone-200">
          {/* <!-- Card header --> */}
          <div className="border-b border-dashed border-stone-300 p-5">
            <h1 className="text-lg font-semibold">続きをみるには</h1>
            <p className="text-sm text-stone-600">
              残り {contentLockedLength || 0}字 /{" "}
              {contentLockedImagesCount || 0}画像
            </p>
            {nftLockConditions.length >= 2 && (
              <>
                {conditionLogic === "AND" ? (
                  <p className="mt-2 text-sm text-stone-600">
                    以下の条件を全て満たす場合にのみコンテンツが閲覧可能です。
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-stone-600">
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
              {nftLockConditions.map((condition, i) => (
                <div
                  key={i}
                  className="mx-4 mb-4 items-center justify-between sm:flex "
                >
                  <div className="sm:flex sm:items-center">
                    <img
                      src={condition.collectionLogo || "/nft-placeholder.webp"}
                      className="mx-auto h-12 w-auto "
                    />
                    <span className="ml-2 font-medium text-stone-800">
                      {condition.collectionName}
                    </span>
                  </div>
                  <Link href={condition.marketUrl || ""} target="_blank">
                    <span className="text-lg font-semibold text-blue-800 underline">
                      入手ページへ
                    </span>
                  </Link>
                </div>
              ))}
            </div>
            {nftLockConditions && nftLockConditions[0]?.chainId == "aptos" ? (
              <AptosWalletAdapterProvider plugins={aptosWallets}>
                <WalletSelector />
                <SignMessageButtonAptos setIsSignedAptos={setIsSignedAptos} />
              </AptosWalletAdapterProvider>
            ) : (
              <>
                {isConnected ? (
                  <>
                    <Account />
                    <SignMessageButton />
                  </>
                ) : (
                  <WalletOptions />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {isConnected && <LockedContent params={{ domain, slug }} />}
      {isSignedAptos && <LockedContent params={{ domain, slug }} />}
    </>
  );
}

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  return (
    <div className="mx-2 my-2 flex items-center justify-between">
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && (
        <div>
          Connected:{" "}
          {ensName
            ? `${ensName} (${address.substring(0, 12) + "..."})`
            : address.substring(0, 12) + "..."}
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
