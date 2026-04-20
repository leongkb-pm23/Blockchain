import {
  Contract,
  isAddress,
  formatEther,
  parseEther,
} from "ethers";
import { IMAGES } from "@/assets/images";
import type { Campaign, CampaignStatus, Contribution, CompanyProfile } from "@/lib/index";
import { MOCK_CAMPAIGNS, MOCK_COMPANY_PROFILE, MOCK_CONTRIBUTIONS } from "@/lib/index";
import {
  getBrowserProvider,
  getReadonlyProvider,
  getRequiredChainId,
  getRequiredNetworkName,
  getRpcUrl,
} from "./ethereum";
import { LUMIFILM_CROWDFUNDING_ABI } from "./lumifilm-abi";

const IMAGE_ROTATION = [
  IMAGES.CAMPAIGN_1,
  IMAGES.CAMPAIGN_3,
  IMAGES.CAMPAIGN_4,
  IMAGES.CAMPAIGN_7,
  IMAGES.CAMPAIGN_9,
  IMAGES.FILM_SCIFI_7,
  IMAGES.FILM_SCIFI_8,
  IMAGES.CAMPAIGN_10,
];

const CONTRACT_ADDRESS = import.meta.env.VITE_LUMIFILM_CONTRACT_ADDRESS ?? "";

export function getConfiguredContractAddress() {
  return CONTRACT_ADDRESS;
}

export function isLumiFilmContractConfigured() {
  return isAddress(CONTRACT_ADDRESS);
}

export function getReadonlyLumiFilmContract() {
  if (!isLumiFilmContractConfigured()) {
    return null;
  }

  return new Contract(
    CONTRACT_ADDRESS,
    LUMIFILM_CROWDFUNDING_ABI,
    getReadonlyProvider(),
  );
}

export async function getWritableLumiFilmContract() {
  if (!isLumiFilmContractConfigured()) {
    throw new Error(
      "Contract address not configured. Add VITE_LUMIFILM_CONTRACT_ADDRESS to .env.local after deploying from Remix.",
    );
  }

  const provider = getBrowserProvider();

  if (!provider) {
    throw new Error("MetaMask was not detected in this browser.");
  }

  const signer = await provider.getSigner();
  const network = await provider.getNetwork();

  if (Number(network.chainId) !== getRequiredChainId()) {
    throw new Error(
      `Wrong network. Switch MetaMask to ${getRequiredNetworkName()} (${getRequiredChainId()}).`,
    );
  }

  return new Contract(CONTRACT_ADDRESS, LUMIFILM_CROWDFUNDING_ABI, signer);
}

function deriveStatus(goal: bigint, pledged: bigint, deadline: bigint): CampaignStatus {
  const now = Math.floor(Date.now() / 1000);

  if (pledged >= goal) {
    return "successful";
  }

  if (Number(deadline) <= now) {
    return "failed";
  }

  return "active";
}

function getCampaignImage(id: number) {
  return IMAGE_ROTATION[(id - 1) % IMAGE_ROTATION.length];
}

function toShortDescription(description: string) {
  if (description.length <= 110) {
    return description;
  }

  return `${description.slice(0, 107).trim()}...`;
}

function toIsoDate(seconds: bigint) {
  return new Date(Number(seconds) * 1000).toISOString();
}

function mapContractCampaign(rawCampaign: {
  id: bigint;
  creator: string;
  title: string;
  description: string;
  goal: bigint;
  pledged: bigint;
  deadline: bigint;
  createdAt: bigint;
  claimed: boolean;
  canceled: boolean;
}): Campaign {
  const campaignId = Number(rawCampaign.id);

  return {
    id: String(campaignId),
    title: rawCampaign.title,
    description: rawCampaign.description,
    shortDescription: toShortDescription(rawCampaign.description),
    creator: rawCampaign.creator,
    goal: Number(formatEther(rawCampaign.goal)),
    current: Number(formatEther(rawCampaign.pledged)),
    deadline: toIsoDate(rawCampaign.deadline),
    status: deriveStatus(rawCampaign.goal, rawCampaign.pledged, rawCampaign.deadline),
    image: getCampaignImage(campaignId),
  };
}

function buildFallbackData(message?: string) {
  return {
    campaigns: MOCK_CAMPAIGNS,
    contributions: MOCK_CONTRIBUTIONS,
    companyProfile: MOCK_COMPANY_PROFILE,
    source: "mock" as const,
    setupMessage:
      message ??
      "Contract data is not configured yet. The UI is showing sample content until you deploy and connect your Remix contract.",
  };
}

function buildCompanyProfile(campaigns: Campaign[]) {
  const totalRaised = campaigns.reduce((sum, campaign) => sum + campaign.current, 0);
  const activeCampaigns = campaigns.filter((campaign) => campaign.status === "active");
  const uniqueCreators = new Set(campaigns.map((campaign) => campaign.creator));
  const firstCampaign = campaigns
    .map((campaign) => new Date(campaign.deadline).getTime())
    .filter((value) => !Number.isNaN(value))
    .sort((a, b) => a - b)[0];

  const companyProfile: CompanyProfile = {
    name: import.meta.env.VITE_LUMIFILM_ORG_NAME ?? "LumiFilm Protocol",
    founded: firstCampaign
      ? new Date(firstCampaign).toISOString()
      : new Date().toISOString(),
    headquarters: getRequiredNetworkName(),
    wallet: CONTRACT_ADDRESS,
    treasuryETH: totalRaised,
    monthlyBurnETH: 0,
    teamSize: uniqueCreators.size,
  };

  return {
    companyProfile,
    activeCampaigns,
  };
}

export async function fetchLumiFilmData(address?: string | null) {
  const contract = getReadonlyLumiFilmContract();

  if (!contract) {
    return buildFallbackData(
      "Deploy `contracts/LumiFilmCrowdfunding.sol` in Remix, then add the deployed address to `.env.local` to switch this app from sample data to live chain data.",
    );
  }

  try {
    const totalCampaigns = Number(await contract.campaignCount());

    if (totalCampaigns === 0) {
      return {
        campaigns: [],
        contributions: [],
        companyProfile: buildCompanyProfile([]).companyProfile,
        source: "contract" as const,
        setupMessage:
          "Your contract is connected, but there are no campaigns on-chain yet. Create the first one from the app.",
      };
    }

    const contractCampaigns = await Promise.all(
      Array.from({ length: totalCampaigns }, async (_, index) => {
        const campaignId = index + 1;
        const rawCampaign = await contract.campaigns(campaignId);

        return mapContractCampaign(rawCampaign);
      }),
    );

    let contributionHistory: Contribution[] = [];

    if (address) {
      const contributionEvents = await contract.queryFilter(
        contract.filters.ContributionReceived(null, address),
        0,
        "latest",
      );

      contributionHistory = await Promise.all(
        contributionEvents.map(async (event) => {
          if (!("args" in event) || !event.args) {
            return null;
          }

          const block = await event.getBlock();
          const campaignId = String(event.args.campaignId ?? "");
          const amount = Number(formatEther(event.args.amount ?? 0n));
          const campaign = contractCampaigns.find((item) => item.id === campaignId);

          return {
            id: `${event.transactionHash}-${event.index}`,
            campaignId,
            campaignTitle: campaign?.title ?? `Campaign #${campaignId}`,
            amount,
            date: new Date(Number(block.timestamp) * 1000).toISOString(),
          };
        }),
      );

      contributionHistory = contributionHistory.filter(
        (item): item is Contribution => item !== null,
      );

      contributionHistory.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    }

    const { companyProfile } = buildCompanyProfile(contractCampaigns);

    return {
      campaigns: contractCampaigns,
      contributions: contributionHistory,
      companyProfile,
      source: "contract" as const,
      setupMessage: `Connected to ${CONTRACT_ADDRESS} on ${getRequiredNetworkName()} via ${getRpcUrl()}.`,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to read the deployed contract.";

    return buildFallbackData(message);
  }
}

export async function createCampaignOnChain(input: {
  title: string;
  description: string;
  goalEth: string;
  deadline: string;
}) {
  const contract = await getWritableLumiFilmContract();
  const deadline = Math.floor(new Date(input.deadline).getTime() / 1000);

  const tx = await contract.createCampaign(
    input.title,
    input.description,
    parseEther(input.goalEth),
    deadline,
  );

  await tx.wait();

  return tx.hash as string;
}

export async function contributeToCampaignOnChain(campaignId: string, amountEth: string) {
  const contract = await getWritableLumiFilmContract();
  const tx = await contract.contribute(BigInt(campaignId), {
    value: parseEther(amountEth),
  });

  await tx.wait();

  return tx.hash as string;
}

export async function claimCampaignFundsOnChain(campaignId: string) {
  const contract = await getWritableLumiFilmContract();
  const tx = await contract.claimFunds(BigInt(campaignId));

  await tx.wait();

  return tx.hash as string;
}

export async function claimCampaignRefundOnChain(campaignId: string) {
  const contract = await getWritableLumiFilmContract();
  const tx = await contract.refund(BigInt(campaignId));

  await tx.wait();

  return tx.hash as string;
}
