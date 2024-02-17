"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import va from "@vercel/analytics";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { updatePostNFTGateway } from "@/lib/actions";

export default function NFTLockForm({ data }: { data: any }) {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { update } = useSession();

  const [lockConditions, setLockConditions] = useState(
    data?.nftLockConditions || [],
  );
  const [conditionLogic, setConditionLogic] = useState(
    data.conditionLogic || "AND",
  );

  // ロック条件を追加する関数
  const addLockCondition = () => {
    //上限を3つに設定したい
    if (lockConditions.length >= 3) {
      alert("You can only add up to 3 lock conditions.");
      return;
    }

    setLockConditions([
      ...lockConditions,
      { chainId: "1", contractAddress: "" },
    ]);
  };

  // 特定のロック条件を削除する関数
  const removeLockCondition = (index: number) => {
    setLockConditions(
      lockConditions.filter((_: any, idx: number) => idx !== index),
    );
  };
  const validateContractAddress = (address: string) => {
    // Ethereumアドレスの基本的なバリデーション（0xで始まる42文字の長さ）
    return address.startsWith("0x") && address.length === 42;
  };

  const handleChangeContractAddress = (index: number, value: string) => {
    const newConditions = [...lockConditions];
    if (validateContractAddress(value)) {
      newConditions[index].contractAddress = value;
      newConditions[index].error = ""; // エラーをクリア
    } else {
      newConditions[index].contractAddress = value;
      newConditions[index].error = "Invalid Ethereum contract address"; // エラーメッセージを設定
    }
    setLockConditions(newConditions);
  };

  const handleChangeCollectionName = (index: number, value: string) => {
    const newConditions = [...lockConditions];
    newConditions[index].collectionName = value;
    newConditions[index].error = ""; // エラーをクリア

    setLockConditions(newConditions);
  };

  return (
    <form
      action={async (data: FormData) => {
        console.log(lockConditions, "lockConditions");
        const formData = new FormData();
        formData.append("lockConditions", JSON.stringify(lockConditions));
        formData.append("conditionLogic", conditionLogic);

        console.log(formData, "formData");

        updatePostNFTGateway(formData, id, "conditions").then(
          async (res: any) => {
            if (res.error) {
              toast.error(res.error);
            } else {
              va.track(`Updated conditions`, id ? { id } : {});
              if (id) {
                router.refresh();
              } else {
                await update();
                router.refresh();
              }
              toast.success(`Successfully updated conditions!`);
            }
          },
        );
      }}
      className="rounded-lg border border-stone-200 bg-white dark:border-stone-700 dark:bg-black"
    >
      <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
        <h2 className="font-cal text-xl dark:text-white">
          NFT Lock Conditions
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Users can only view your post if they own the NFTs you specify here.
        </p>
        <label className="text-stone-900 dark:text-white">
          Condition Logic
        </label>
        <select
          name="conditionLogic"
          value={conditionLogic}
          onChange={(e) => {
            setConditionLogic(e.target.value);
          }}
          className="w-32 rounded-md border border-stone-300 px-4 py-2 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
        >
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
        <div className="flex flex-col space-y-4">
          {lockConditions.map((condition: any, index: number) => (
            <div
              key={index}
              className="space-y-2 rounded bg-stone-100 p-4 dark:bg-stone-900"
            >
              <div className="flex max-w-sm items-center overflow-hidden rounded-lg border border-stone-300 ">
                <select
                  name={`chain-${index}`}
                  value={condition.chainId}
                  onChange={(e) => {
                    const newConditions = [...lockConditions];
                    newConditions[index].chainId = e.target.value;
                    setLockConditions(newConditions);
                  }}
                  className="w-full rounded-none border-none bg-white px-4 py-2 text-sm font-medium text-stone-700 focus:outline-none focus:ring-black dark:bg-black dark:text-stone-200 dark:focus:ring-white"
                >
                  <option value="1">Ethereum</option>
                  <option value="137">Polygon</option>
                  <option value="80001">Mumbai</option>
                  <option value="111111">Base</option>
                </select>
              </div>
              <input
                name={`nftContractAddress-${index}`}
                value={condition.contractAddress}
                onChange={(e) =>
                  handleChangeContractAddress(index, e.target.value)
                }
                required
                placeholder="0x1234..."
                className="mt-2 w-full max-w-md rounded-md border border-stone-300 px-4 py-2 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
              />
              <input
                name={`collection-${index}`}
                value={condition.collectionName}
                onChange={(e) =>
                  handleChangeCollectionName(index, e.target.value)
                }
                required
                placeholder="ex) Bored Ape Yacht Club"
                className="mt-2 w-full max-w-md rounded-md border border-stone-300 px-4 py-2 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
              />

              {lockConditions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLockCondition(index)}
                  className="ml-4 rounded bg-red-500 px-4 py-2 text-sm text-white"
                >
                  Remove
                </button>
              )}
              {condition.error && (
                <p className="mt-1 text-xs text-red-500">{condition.error}</p>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addLockCondition}
            className="mt-2 w-full rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            + Add Condition
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
        <p className="text-center text-sm text-stone-500 dark:text-stone-400">
          Supports both ERC721 and ERC1155.
        </p>
        <div className="w-32">
          <FormButton />
        </div>
      </div>
    </form>
  );
}

function FormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={cn(
        "flex h-8 w-32 items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none sm:h-10",
        pending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Save Changes</p>}
    </button>
  );
}
