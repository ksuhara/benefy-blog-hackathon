import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useAccount, useSignMessage, useChainId } from "wagmi";

export default function SignMessageButton() {
  const { signMessageAsync } = useSignMessage();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const handleLogin = async () => {
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chainId,
        nonce: await getCsrfToken(),
      });
      console.log(message, "message");
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      console.log(signature, "signature");

      const response = await signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
      });
      console.log(response, "response");
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <button
      className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
      onClick={(e) => {
        e.preventDefault();
        handleLogin();
      }}
    >
      署名して閲覧する
    </button>
  );
}
