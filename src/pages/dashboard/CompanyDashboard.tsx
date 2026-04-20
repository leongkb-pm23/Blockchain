import { Building2, PiggyBank, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Campaign,
  CompanyProfile,
  formatETH,
} from "@/lib/index";

interface CompanyDashboardProps {
  companyProfile: CompanyProfile;
  activeCampaigns: Campaign[];
}

export function CompanyDashboard({
  companyProfile,
  activeCampaigns,
}: CompanyDashboardProps) {
  const companyRunwayMonths = Math.floor(
    companyProfile.treasuryETH / companyProfile.monthlyBurnETH,
  );

  return (
    <>
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-5">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Treasury
            </p>
            <p className="text-3xl font-bold font-mono">
              {formatETH(companyProfile.treasuryETH)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-5">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Monthly Burn
            </p>
            <p className="text-3xl font-bold font-mono">
              {formatETH(companyProfile.monthlyBurnETH)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-5">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Runway
            </p>
            <p className="text-3xl font-bold">{companyRunwayMonths} months</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-2">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{companyProfile.name}</h3>
                <p className="text-xs text-muted-foreground">Production Company</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">HQ</span>
                <span>{companyProfile.headquarters}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Founded</span>
                <span>
                  {new Date(companyProfile.founded).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Team Size</span>
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {companyProfile.teamSize}
                </span>
              </div>
              <div className="space-y-1 pt-1">
                <span className="block text-muted-foreground">Treasury Wallet</span>
                <code className="inline-block rounded bg-muted/40 px-2 py-1 text-xs font-mono">
                  {companyProfile.wallet}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-3">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Studio Campaign Operations</h3>
              <Badge className="border-primary/40 bg-primary/20 text-primary">
                {activeCampaigns.length} Active
              </Badge>
            </div>

            <div className="space-y-5">
              {activeCampaigns.map((campaign) => {
                const percent = (campaign.current / campaign.goal) * 100;

                return (
                  <div key={campaign.id} className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">{campaign.title}</p>
                      <p className="font-mono text-sm text-muted-foreground">
                        {formatETH(campaign.current)} / {formatETH(campaign.goal)}
                      </p>
                    </div>
                    <Progress value={percent} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{Math.round(percent)}% funded</span>
                      <span className="inline-flex items-center gap-1">
                        <PiggyBank className="h-3 w-3" />
                        Investor momentum
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
