"use client";

import { useEffect, useState, useTransition } from "react";
import { Post } from "@prisma/client";
import { updatePost, updatePostMetadata } from "@/lib/actions";
import { Editor as NovelEditor } from "novel";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import LoadingDots from "./icons/loading-dots";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

type PostWithSite = Post & { site: { subdomain: string | null } | null };

export default function Editor({ post }: { post: PostWithSite }) {
  let [isPendingSaving, startTransitionSaving] = useTransition();
  let [isPendingPublishing, startTransitionPublishing] = useTransition();
  const [data, setData] = useState<PostWithSite>(post);
  const [hydrated, setHydrated] = useState(false);

  // const [isDirty, setIsDirty] = useState(false);

  // useEffect(() => {
  //   console.log("set is dirty effect");
  //   // ページを離れる際に警告を表示する関数
  //   const handleBeforeUnload = (event: any) => {
  //     console.log("handleBeforeUnload");
  //     if (isDirty) {
  //       // デフォルトの警告メッセージを表示
  //       event.preventDefault();
  //       event.returnValue = "保存せずにページを離れますか？";
  //     }
  //   };

  //   // イベントリスナーを追加
  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   // コンポーネントがアンマウントされる時にイベントリスナーを削除
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, [isDirty]); // 依存配列にisDirtyを設定

  const url = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? `https://${data.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${data.slug}`
    : `http://${data.site?.subdomain}.localhost:8888/${data.slug}`;

  // listen to CMD + S and override the default behavior
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "s") {
        e.preventDefault();
        startTransitionSaving(async () => {
          await updatePost(data);
        });
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [data]);

  const updatePostFunction = async () => {
    startTransitionSaving(async () => {
      await updatePost(data).then(() => {
        toast.success("保存しました。");
      });
    });
  };

  return (
    <div className="relative min-h-[500px] w-full max-w-screen-lg border-stone-200 p-12 px-8 dark:border-stone-700 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg">
      <div className="absolute right-5 top-5 mb-5 flex items-center space-x-3">
        {data.published && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-sm text-stone-400 hover:text-stone-500"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        <div className="rounded-lg bg-stone-100 px-2 py-1 text-sm text-stone-400 dark:bg-stone-800 dark:text-stone-500">
          {isPendingSaving ? "Saving..." : "Saved"}
        </div>
        <button
          onClick={() => {
            const formData = new FormData();
            console.log(data.published, typeof data.published);
            formData.append("published", String(!data.published));
            startTransitionPublishing(async () => {
              await updatePostMetadata(formData, post.id, "published").then(
                () => {
                  toast.success(
                    `投稿を ${data.published ? "非公開に" : "公開"} しました🎉`,
                  );
                  setData((prev) => ({ ...prev, published: !prev.published }));
                },
              );
            });
          }}
          className={cn(
            "flex h-7 w-24 items-center justify-center space-x-2 rounded-lg border text-sm transition-all focus:outline-none",
            isPendingPublishing
              ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
              : "border border-black bg-black text-white hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800",
          )}
          disabled={isPendingPublishing}
        >
          {isPendingPublishing ? (
            <LoadingDots />
          ) : (
            <p>{data.published ? "非公開にする" : "公開する"}</p>
          )}
        </button>
      </div>
      <div className="mb-5 flex flex-col space-y-3 border-b border-stone-200 pb-5 dark:border-stone-700">
        <input
          type="text"
          placeholder="Title"
          defaultValue={post?.title || ""}
          autoFocus
          onChange={(e) => setData({ ...data, title: e.target.value })}
          className="dark:placeholder-text-600 border-none px-0 font-cal text-3xl placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white"
        />
        <TextareaAutosize
          placeholder="Description"
          defaultValue={post?.description || ""}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="dark:placeholder-text-600 w-full resize-none border-none px-0 placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white"
        />
      </div>
      <NovelEditor
        className="relative block rounded-md border-2 border-pink-200 text-stone-800 dark:border-pink-800 dark:text-stone-200"
        defaultValue={post?.content || " "}
        onUpdate={(editor) => {
          // setIsDirty(true);
          setData((prev) => ({
            ...prev,
            content: editor?.storage.markdown.getMarkdown(),
          }));
        }}
        disableLocalStorage
      />
      <h3 className="mb-2 mt-16 text-lg font-semibold dark:text-stone-200">
        以下でNFT保有者限定コンテンツを編集 ↓
      </h3>
      <NovelEditor
        className="relative block rounded-md border-2 border-indigo-200 text-stone-800 dark:border-teal-800 dark:text-stone-200"
        defaultValue={post?.contentLocked || " "}
        onUpdate={(editor) => {
          // setIsDirty(true);
          setData((prev) => ({
            ...prev,
            contentLocked: editor?.storage.markdown.getMarkdown(),
          }));
        }}
        disableLocalStorage
      />
      <button
        onClick={updatePostFunction}
        className="mt-8 w-full rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
      >
        保存する
      </button>
    </div>
  );
}
