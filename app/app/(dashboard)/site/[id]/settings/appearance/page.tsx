import prisma from "@/lib/prisma";
import Form from "@/components/form";
import { updateSite } from "@/lib/actions";

export default async function SiteSettingsAppearance({
  params,
}: {
  params: { id: string };
}) {
  const data = await prisma.site.findUnique({
    where: {
      id: decodeURIComponent(params.id),
    },
  });

  return (
    <div className="flex flex-col space-y-6">
      <Form
        title="サムネイル画像"
        description="サイトのサムネイル画像です。受け入れ可能なフォーマット: .png、.jpg、.jpeg"
        helpText="最大ファイルサイズは50MBです。推奨サイズは1200x630です。"
        inputAttrs={{
          name: "image",
          type: "file",
          defaultValue: data?.image!,
        }}
        handleSubmit={updateSite}
      />
      <Form
        title="Logo"
        description="サイトのロゴ画像です。 受け入れ可能なフォーマット: .png、.jpg、.jpeg"
        helpText="最大ファイルサイズは50MBです。推奨サイズは400x400です。"
        inputAttrs={{
          name: "logo",
          type: "file",
          defaultValue: data?.logo!,
        }}
        handleSubmit={updateSite}
      />
      <Form
        title="Font"
        description="サイトの見出しテキスト用のフォントです。"
        helpText="Please select a font."
        inputAttrs={{
          name: "font",
          type: "select",
          defaultValue: data?.font!,
        }}
        handleSubmit={updateSite}
      />
      <Form
        title="404 Page Message"
        description="404ページに表示されるメッセージです。"
        helpText="最大240文字以内で使用してください。"
        inputAttrs={{
          name: "message404",
          type: "text",
          defaultValue: data?.message404!,
          placeholder: "おや！ 存在しないページを見つけてしまいました。",
          maxLength: 240,
        }}
        handleSubmit={updateSite}
      />
    </div>
  );
}
