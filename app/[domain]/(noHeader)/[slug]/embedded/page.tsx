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

  console.log(data, "data");

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
                }}
              />
            </>
          )}
        </>
      ) : (
        <>
          <div className="text-center">
            The author must be premium user to use embedded mode.
          </div>
        </>
      )}
    </>
  );
}
