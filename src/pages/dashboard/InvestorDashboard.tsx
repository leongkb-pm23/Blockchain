import { motion } from "framer-motion";
import { Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Campaign,
  Contribution,
  formatETH,
  getStatusColor,
  getStatusLabel,
} from "@/lib/index";

interface InvestorDashboardProps {
  campaigns: Campaign[];
  contributions: Contribution[];
}

export function InvestorDashboard({
  campaigns,
  contributions,
}: InvestorDashboardProps) {
  const totalInvested = contributions.reduce(
    (total, item) => total + item.amount,
    0,
  );
  const supportedCampaignCount = new Set(
    contributions.map((item) => item.campaignId),
  ).size;
  const projectedReturn = totalInvested * 1.35;

  return (
    <>
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-5">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Total Invested
            </p>
            <p className="text-3xl font-bold font-mono">{formatETH(totalInvested)}</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-5">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Campaigns Backed
            </p>
            <p className="text-3xl font-bold">{supportedCampaignCount}</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-5">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Projected Return
            </p>
            <p className="text-3xl font-bold font-mono text-chart-3">
              {formatETH(projectedReturn)}
            </p>
          </CardContent>
        </Card>
      </div>

      {contributions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted/30">
                <TrendingUp className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-2xl font-semibold">No Contributions Yet</h3>
              <p className="mb-6 max-w-md text-center text-muted-foreground">
                You have not supported any campaigns yet. Explore projects and
                invest in the next great movie.
              </p>
              <Button
                onClick={() => (window.location.hash = "/explore")}
                className="bg-gradient-to-r from-primary to-accent transition-opacity hover:opacity-90"
              >
                Explore Campaigns
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {contributions.map((contribution, index) => {
            const campaign = campaigns.find((item) => item.id === contribution.campaignId);

            return (
              <motion.div
                key={contribution.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-colors hover:border-primary/50">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                      <div className="flex-1">
                        <h3 className="mb-2 text-xl font-semibold">
                          {contribution.campaignTitle}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(contribution.date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          {campaign && (
                            <Badge className={getStatusColor(campaign.status)}>
                              {getStatusLabel(campaign.status)}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="mb-1 text-sm text-muted-foreground">
                            Contributed
                          </p>
                          <p className="bg-gradient-to-r from-primary to-accent bg-clip-text text-2xl font-bold font-mono text-transparent">
                            {formatETH(contribution.amount)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            (window.location.hash = `/campaign/${contribution.campaignId}`)
                          }
                        >
                          View Campaign
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </>
  );
}
