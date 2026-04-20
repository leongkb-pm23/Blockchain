import {
  ArrowRight,
  Building2,
  Clapperboard,
  Globe,
  HandCoins,
  Shield,
  Zap,
} from "lucide-react";
import { IMAGES } from "@/assets/images";
import { ROUTE_PATHS } from "@/lib/index";

export const heroContent = {
  title: "LumiFilm",
  subtitle: "Decentralized Film Crowdfunding",
  backgroundImage: IMAGES.HERO_BG_3,
  primaryAction: {
    label: "Explore Campaigns",
    href: ROUTE_PATHS.EXPLORE,
    icon: ArrowRight,
  },
  secondaryAction: {
    label: "Start a Campaign",
    href: ROUTE_PATHS.CREATE,
  },
};

export const features = [
  {
    icon: Shield,
    title: "Transparency",
    description:
      "Every transaction is recorded on the blockchain, ensuring complete visibility and accountability for all contributions.",
  },
  {
    icon: Zap,
    title: "No Fees",
    description:
      "Direct peer-to-peer funding means creators receive 100% of contributions without platform fees or intermediaries.",
  },
  {
    icon: Globe,
    title: "Decentralized Logic",
    description:
      "Smart contracts automate fund distribution and refunds, eliminating the need for centralized control or trust.",
  },
];

export const ecosystemRoles = [
  {
    icon: HandCoins,
    title: "Investor",
    description:
      "Fund movie campaigns with transparent on-chain transactions and monitor portfolio growth in real time.",
    cta: "View Investor Dashboard",
    href: ROUTE_PATHS.DASHBOARD,
  },
  {
    icon: Clapperboard,
    title: "Campaign",
    description:
      "Launch and manage film campaigns with clear goals, deadlines, and progress milestones.",
    cta: "Start New Campaign",
    href: ROUTE_PATHS.CREATE,
  },
  {
    icon: Building2,
    title: "Company",
    description:
      "Track studio treasury, active productions, and funding health from one centralized control view.",
    cta: "Open Company View",
    href: ROUTE_PATHS.DASHBOARD,
  },
];

export const ctaContent = {
  title: "Ready to Fund the Future of Cinema?",
  description:
    "Join LumiFilm today and be part of a revolutionary platform where creativity meets blockchain technology",
  backgroundImage: IMAGES.HERO_BG_8,
  primaryAction: {
    label: "Launch Your Campaign",
    href: ROUTE_PATHS.CREATE,
    icon: ArrowRight,
  },
  secondaryAction: {
    label: "Explore Projects",
    href: ROUTE_PATHS.EXPLORE,
  },
};
