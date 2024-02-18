import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Form from "@/components/form";
import { updatePostMetadata } from "@/lib/actions";
import DeletePostForm from "@/components/form/delete-post-form";
import IframeForm from "@/components/form/iframe-form";

export default async function PostSettings({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const data = await prisma.post.findUnique({
    where: {
      id: decodeURIComponent(params.id),
    },
    include: {
      site: {
        select: {
          subdomain: true,
        },
      },
    },
  });
  if (!data || data.userId !== session.user.id) {
    notFound();
  }

  const url = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? `https://${data.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${data.slug}`
    : `http://${data.site?.subdomain}.localhost:8888/${data.slug}`;

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-6">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          記事設定
        </h1>
        <Form
          title="記事のスラッグ"
          description="スラッグは、名前のURLに適したバージョンです。通常、すべて小文字で、文字、数字、ハイフンのみを含みます。"
          helpText="この記事に固有のスラッグを使用してください。"
          inputAttrs={{
            name: "slug",
            type: "text",
            defaultValue: data?.slug!,
            placeholder: "slug",
          }}
          handleSubmit={updatePostMetadata}
        />

        <Form
          title="サムネイル画像"
          description="記事のサムネイル画像です。受け入れ可能なフォーマット: .png、.jpg、.jpeg"
          helpText="最大ファイルサイズは50MBです。推奨サイズは1200x630です。"
          inputAttrs={{
            name: "image",
            type: "file",
            defaultValue: data?.image!,
          }}
          handleSubmit={updatePostMetadata}
        />
        <IframeForm url={url} />
        <DeletePostForm postName={data?.title!} />
      </div>
    </div>
  );
}
