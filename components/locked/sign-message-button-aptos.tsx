"use client";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import nacl from "tweetnacl";
import { HexString } from "aptos";
import { Dispatch, SetStateAction } from "react";
export default function SignMessageButtonAptos({
  setIsSignedAptos,
}: {
  setIsSignedAptos: Dispatch<SetStateAction<boolean>>;
}) {
  const { signMessageAndVerify, signMessage, account } = useWallet();

  const handleLogin = async () => {
    try {
      const nonce = await getCsrfToken();
      const payload = {
        message: "Hello from Aptos Wallet Adapter",
        nonce: nonce!,
      };

      const test = await signMessageAndVerify(payload);
      console.log(test, "vefi");
      const signedMessage = await signMessage(payload);

      const response = await signIn("credentials", {
        message: payload.message,
        redirect: false,
        signature: JSON.stringify(signedMessage),
        blockchainType: "aptos",
      });
      console.log(response, "aaa");
      setIsSignedAptos(true);
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <>
      {account && (
        <button
          className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          onClick={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          署名して閲覧する
        </button>
      )}
    </>
  );
}
