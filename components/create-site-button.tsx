"use client";

import { useModal } from "@/components/modal/provider";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";

export default function CreateSiteButton({
  children,
}: {
  children: ReactNode;
}) {
  const modal = useModal();

  return (
    <button
      onClick={() => modal?.show(children)}
      // disabled={status === "loading" || !session?.user?.isActive}
      className="rounded-lg border border-black bg-black px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-stone-100 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800 dark:disabled:bg-stone-800 dark:disabled:text-stone-300"
    >
      新しいサイトを作る
    </button>
  );
}
