import {
  getConfigResponse,
  getDomainResponse,
  verifyDomain,
} from "@/lib/domains";
import { DomainVerificationStatusProps } from "@/lib/types";
import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import prisma from "@/lib/prisma";
import { serialize } from "next-mdx-remote/serialize";
import { replaceExamples, replaceTweets } from "@/lib/remark-plugins";
import { getSession } from "@/lib/auth";
import Moralis from "moralis";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export async function POST(req: Request): Promise<Response> {
  let { slug } = await req.json();
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userAddress = session.user.id;

  const data = await prisma.post.findFirst({
    where: {
      slug: slug,
    },
    select: {
      contentLocked: true,
      conditionLogic: true,
      nftLockConditions: true,
    },
  });

  // nftLockConditionsをループして、ユーザーがNFTを持っているか確認する

  if (!data) {
    return NextResponse.json({ error: "Post not found" }, { status: 403 });
  }

  if (!Moralis.Core.isStarted) {
    await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY,
    });
  }
  let isConditionMet = data.conditionLogic === "AND"; // ANDの場合は初期値をtrueに、ORの場合はfalseに設定

  for (const nftLockCondition of data.nftLockConditions) {
    try {
      if (nftLockCondition.chainId === "aptos") {
        const APTOS_NETWORK: Network = Network.MAINNET;
        const config = new AptosConfig({ network: APTOS_NETWORK });
        const aptos = new Aptos(config);
        const owned = await aptos.getAccountOwnedTokensFromCollectionAddress({
          accountAddress: userAddress,
          collectionAddress: nftLockCondition.contractAddress,
        });
        const hasNFT = owned && owned.length > 0;
        if (data.conditionLogic === "OR" && hasNFT) {
          isConditionMet = true; // OR条件でNFTを持っている場合はtrueに設定してループを抜ける
          break;
        } else if (data.conditionLogic === "AND" && !hasNFT) {
          isConditionMet = false; // AND条件でNFTを持っていない場合はfalseに設定してループを抜ける
          break;
        }
      } else {
        const response = await Moralis.EvmApi.nft.getWalletNFTs({
          tokenAddresses: [nftLockCondition.contractAddress],
          address: userAddress,
          chain: `0x${Number(nftLockCondition.chainId).toString(16)}`,
        });

        const hasNFT = response && response.result.length > 0;

        if (data.conditionLogic === "OR" && hasNFT) {
          isConditionMet = true; // OR条件でNFTを持っている場合はtrueに設定してループを抜ける
          break;
        } else if (data.conditionLogic === "AND" && !hasNFT) {
          isConditionMet = false; // AND条件でNFTを持っていない場合はfalseに設定してループを抜ける
          break;
        }
      }
    } catch (e) {
      console.error(e, "error accessing Moralis API");
      if (data.conditionLogic === "AND") {
        // AND条件でエラーが発生した場合は、条件が満たされない
        isConditionMet = false;
        break;
      }
      // OR条件では、エラーが発生しても他の条件をチェック続ける
    }
  }

  if (!isConditionMet) {
    return NextResponse.json(
      { error: "NFT condition not met" },
      { status: 403 },
    );
  }

  console.log(data, "data");
  if (!data?.contentLocked) {
    return NextResponse.error();
  }
  const source = await getMdxSource(data?.contentLocked);

  return NextResponse.json(source);
}

async function getMdxSource(postContents: string) {
  // transforms links like <link> to [link](link) as MDX doesn't support <link> syntax
  // https://mdxjs.com/docs/what-is-mdx/#markdown
  const content =
    postContents?.replaceAll(/<(https?:\/\/\S+)>/g, "[$1]($1)") ?? "";
  // Serialize the content string into MDX
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [replaceTweets, () => replaceExamples(prisma)],
    },
  });

  return mdxSource;
}
