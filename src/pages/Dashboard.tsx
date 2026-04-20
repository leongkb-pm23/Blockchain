import { Layout } from '@/components/Layout';
import {
  useWalletStore,
  formatAddress,
} from '@/lib/index';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, Film, TrendingUp, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { InvestorDashboard } from '@/pages/dashboard/InvestorDashboard';
import { CampaignDashboard } from '@/pages/dashboard/CampaignDashboard';
import { CompanyDashboard } from '@/pages/dashboard/CompanyDashboard';
import { useLumiFilmData } from '@/hooks/use-lumifilm-data';
import { ContractStatusCard } from '@/components/web3/ContractStatusCard';

export default function Dashboard() {
  const { isConnected, address, connect, isConnecting } = useWalletStore();
  const { data } = useLumiFilmData(address);
  const campaigns = data?.campaigns ?? [];
  const userCampaigns = campaigns.filter((c) => c.creator.toLowerCase() === address?.toLowerCase());
  const userContributions = data?.contributions ?? [];
  const activeStudioCampaigns = campaigns.filter((campaign) => campaign.status === 'active');
  const companyProfile = data?.companyProfile;

  if (!isConnected) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md"
          >
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Wallet className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Connect Your Wallet
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Please connect your wallet to access your dashboard and manage your campaigns and contributions.
            </p>
            <Button
              size="lg"
              onClick={() => void connect()}
              disabled={isConnecting}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              <Wallet className="mr-2 h-5 w-5" />
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-muted-foreground font-mono text-sm">
                  {formatAddress(address || '')}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <ContractStatusCard message={data?.setupMessage} />
          </div>

          <Tabs defaultValue="investor" className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-8">
              <TabsTrigger value="investor" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Investor
              </TabsTrigger>
              <TabsTrigger value="campaign" className="flex items-center gap-2">
                <Film className="w-4 h-4" />
                Campaign
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Company
              </TabsTrigger>
            </TabsList>

            <TabsContent value="investor">
              <InvestorDashboard
                campaigns={campaigns}
                contributions={userContributions}
              />
            </TabsContent>

            <TabsContent value="campaign">
              <CampaignDashboard campaigns={userCampaigns} />
            </TabsContent>

            <TabsContent value="company">
              {companyProfile ? (
                <CompanyDashboard
                  companyProfile={companyProfile}
                  activeCampaigns={activeStudioCampaigns}
                />
              ) : null}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
}
