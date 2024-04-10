import { notFound } from "next/navigation";
import { getPostData } from "@/lib/fetchers";
import { LockedSection } from "@/components/locked/locked-section";

export default async function SitePostPage({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const slug = decodeURIComponent(params.slug);
  const data = await getPostData(domain, slug);

  if (!data) {
    notFound();
  }

  // console.log(data, "data");
  const imageRegex: RegExp = /!\[\]\((.*?)\)/g;

  // 一致するすべての項目を配列として取得
  const images = data.content?.match(imageRegex);

  // 画像の数を計算
  const imageCount: number = images ? images.length : 0;
  console.log(imageCount, "imageCount");

  return (
    <>
      {data.site?.user?.isActive ? (
        <>
          {data.nftLockConditions && (
            <>
              <LockedSection
                params={{
                  nftLockConditions: data.nftLockConditions,
                  conditionLogic: data.conditionLogic,
                  domain: domain,
                  slug: slug,
                  contentLockedLength: data.contentLockedLength,
                  contentLockedImagesCount: data.contentLockedImagesCount,
                }}
              />
            </>
          )}
        </>
      ) : (
        <>
          <div className="text-center">
            記事投稿者が有料プランに加入している必要があります。
          </div>
        </>
      )}
    </>
  );
}
