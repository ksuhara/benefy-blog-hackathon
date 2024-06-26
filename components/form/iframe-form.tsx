"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";

export default function IframeForm({ url }: { url: string }) {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  const [width, setWidth] = useState(isMobile ? 400 : 1024);
  const [height, setHeight] = useState(400);

  function FormButton() {
    const { pending } = useFormStatus();
    return (
      <button
        className={cn(
          "flex h-8 w-32 items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none sm:h-10",
          pending
            ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
            : "border-indigo-600 bg-indigo-600 text-white hover:bg-white hover:text-indigo-600 dark:hover:bg-transparent",
        )}
        onClick={() => {
          navigator.clipboard.writeText(`<iframe
          width="${width}"
          height="${height}"
          src="${url}/embedded"></iframe>`);
          toast.success("コピーしました");
        }}
        disabled={pending}
      >
        {pending ? <LoadingDots color="#808080" /> : <p>コピーする</p>}
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-indigo-600 bg-white dark:bg-black">
      <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
        <h2 className="font-cal text-xl dark:text-white">iframe設定</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          iframeでNFT限定部分をご自身のサイトに埋め込むことができます。
          <Link href={"/plans"} className="text-blue-500">
            有料プラン
          </Link>
          ユーザー限定機能です。
        </p>
        <div className="flex items-center">
          <label className="mr-4 text-sm">width</label>
          <input
            name="width"
            type="number"
            required
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value))}
            className="w-full max-w-xs rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
          />
        </div>
        <div className="flex items-center">
          <label className="mr-4 text-sm">height</label>
          <input
            name="height"
            type="number"
            required
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value))}
            className="w-full max-w-xs rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
          />
        </div>
        <p className="text-sm font-semibold">プレビュー</p>
        <div className="border text-center">
          <iframe
            width={width}
            height={height}
            src={`${url}/embedded`}
          ></iframe>
        </div>
        <div className="my-2 flex">
          {url && (
            <div className="overflow-x-auto whitespace-nowrap rounded-lg bg-gray-100 p-2">
              {`<iframe
                width="${width}"
                height="${height}"
                src="${url}/embedded"></iframe>`}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
        <p className="text-center text-sm text-stone-500 dark:text-stone-400">
          iframe埋め込み機能を利用するためには、
          <Link href="/plans">
            <span className="underline">
              記事投稿者が有料ユーザーである必要があります
            </span>
          </Link>
          。
        </p>
        <div className="w-32">
          <FormButton />
        </div>
      </div>
    </div>
  );
}
