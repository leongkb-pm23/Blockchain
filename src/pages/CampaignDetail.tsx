import { useParams, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, User, Target, TrendingUp } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { ContributeModal } from '@/components/ContributeModal';
import {
  MOCK_CAMPAIGNS,
  formatETH,
  formatAddress,
  getDaysLeft,
  getStatusColor,
  getStatusLabel,
  useWalletStore,
  ROUTE_PATHS,
} from '@/lib/index';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const campaign = MOCK_CAMPAIGNS.find((c) => c.id === id);
  const { isConnected } = useWalletStore();
  const [modalOpen, setModalOpen] = useState(false);

  if (!campaign) {
    return <Navigate to={ROUTE_PATHS.EXPLORE} replace />;
  }

  const progress = (campaign.current / campaign.goal) * 100;
  const daysLeft = getDaysLeft(campaign.deadline);

  return (
    <Layout>
      <div className="min-h-screen py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-8">
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <div className="absolute top-6 right-6">
                <Badge
                  className={`${getStatusColor(
                    campaign.status
                  )} border px-4 py-2 text-sm font-medium backdrop-blur-sm`}
                >
                  {getStatusLabel(campaign.status)}
                </Badge>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {campaign.title}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Created by</span>
                    <code className="font-mono text-sm bg-muted/50 px-2 py-1 rounded">
                      {formatAddress(campaign.creator)}
                    </code>
                  </div>
                </div>

                <Card className="p-6 bg-card/60 backdrop-blur-md border-border/50">
                  <h2 className="text-xl font-semibold mb-4">About This Project</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {campaign.description}
                  </p>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-6 bg-card/80 backdrop-blur-md border-border/50 sticky top-24">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-3xl font-bold font-mono">
                          {formatETH(campaign.current)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          of {formatETH(campaign.goal)}
                        </span>
                      </div>
                      <div className="relative h-3 bg-muted/30 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(progress, 100)}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full"
                          style={{
                            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2 text-sm">
                        <span className="text-muted-foreground">
                          {progress.toFixed(1)}% funded
                        </span>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <TrendingUp className="w-4 h-4" />
                          <span>{Math.round((campaign.current / campaign.goal) * 100)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs uppercase tracking-wide">Time Left</span>
                        </div>
                        <p className="text-2xl font-bold">
                          {daysLeft > 0 ? `${daysLeft}d` : '0d'}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Target className="w-4 h-4" />
                          <span className="text-xs uppercase tracking-wide">Goal</span>
                        </div>
                        <p className="text-2xl font-bold font-mono">
                          {campaign.goal} ETH
                        </p>
                      </div>
                    </div>

                    {campaign.status === 'active' && (
                      <div className="pt-4 border-t border-border/50">
                        {isConnected ? (
                          <Button
                            onClick={() => setModalOpen(true)}
                            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                            size="lg"
                          >
                            Contribute Now
                          </Button>
                        ) : (
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-3">
                              Please login to continue
                            </p>
                            <Button
                              onClick={() => useWalletStore.getState().connect()}
                              variant="outline"
                              className="w-full"
                            >
                              Connect Wallet
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {campaign.status === 'successful' && (
                      <div className="pt-4 border-t border-border/50">
                        <Button
                          className="w-full bg-chart-3 hover:bg-chart-3/90 text-white"
                          size="lg"
                        >
                          Claim Reward
                        </Button>
                      </div>
                    )}

                    {campaign.status === 'failed' && (
                      <div className="pt-4 border-t border-border/50">
                        <Button
                          variant="outline"
                          className="w-full border-destructive text-destructive hover:bg-destructive/10"
                          size="lg"
                        >
                          Claim Refund
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <ContributeModal
        campaign={campaign}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Layout>
  );
}
