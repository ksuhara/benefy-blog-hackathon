"use client";

import MDX from "@/components/mdx";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function LockedContent({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const [lockedData, setLockedData] = useState<any>(null);
  const { data: session } = useSession();
  useEffect(() => {
    console.log(params, "params");
    if (!params.domain) return;
    if (!session) return;
    fetchContent();
  }, [session]);

  const fetchContent = async () => {
    console.log("fetchContet");
    const domain = decodeURIComponent(params.domain);
    const slug = decodeURIComponent(params.slug);
    console.log(domain, slug, "domain, slug");
    const response = await fetch("/api/fetch-locked-content", {
      method: "POST",
      body: JSON.stringify({ slug }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    if (response.ok) {
      const fetchedLockedData = await response.json();
      console.log(fetchedLockedData, "lockedData");
      setLockedData(fetchedLockedData);
    } else {
      window.alert("Failed to fetch locked content. Please check your wallet.");
      setLockedData(null);
    }
  };

  return <>{lockedData && <MDX source={lockedData} />}</>;
}
