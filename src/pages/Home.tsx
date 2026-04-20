import { Layout } from "@/components/Layout";
import { ContractStatusCard } from "@/components/web3/ContractStatusCard";
import { useLumiFilmData } from "@/hooks/use-lumifilm-data";
import { CtaSection } from "@/pages/home/sections/CtaSection";
import { EcosystemRolesSection } from "@/pages/home/sections/EcosystemRolesSection";
import { FeaturedCampaignsSection } from "@/pages/home/sections/FeaturedCampaignsSection";
import { FeaturesSection } from "@/pages/home/sections/FeaturesSection";
import { HeroSection } from "@/pages/home/sections/HeroSection";

export default function Home() {
  const { data } = useLumiFilmData();
  const featuredCampaigns = (data?.campaigns ?? []).slice(0, 4);

  return (
    <Layout>
      <HeroSection />
      <div className="container mx-auto px-4 pt-10">
        <ContractStatusCard message={data?.setupMessage} />
      </div>
      <FeaturesSection />
      <FeaturedCampaignsSection campaigns={featuredCampaigns} />
      <EcosystemRolesSection />
      <CtaSection />
    </Layout>
  );
}
