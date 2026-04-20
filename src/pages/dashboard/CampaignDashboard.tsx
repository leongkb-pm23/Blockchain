import { motion } from "framer-motion";
import { Calendar, Film } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Campaign, formatETH, getStatusColor, getStatusLabel } from "@/lib/index";

interface CampaignDashboardProps {
  campaigns: Campaign[];
}

export function CampaignDashboard({ campaigns }: CampaignDashboardProps) {
  if (campaigns.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted/30">
              <Film className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-2xl font-semibold">No Campaigns Yet</h3>
            <p className="mb-6 max-w-md text-center text-muted-foreground">
              You have not created any campaigns yet. Start your filmmaking
              journey by launching your first project.
            </p>
            <Button
              onClick={() => (window.location.hash = "/create")}
              className="bg-gradient-to-r from-primary to-accent transition-opacity hover:opacity-90"
            >
              Create Campaign
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {campaigns.map((campaign, index) => (
        <motion.div
          key={campaign.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-colors hover:border-primary/50">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="h-32 w-full flex-shrink-0 overflow-hidden rounded-lg md:w-48">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="mb-2 text-2xl font-semibold">{campaign.title}</h3>
                      <p className="line-clamp-2 text-muted-foreground">
                        {campaign.shortDescription}
                      </p>
                    </div>
                    <Badge className={getStatusColor(campaign.status)}>
                      {getStatusLabel(campaign.status)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Funding Progress</span>
                      <span className="font-mono font-semibold">
                        {formatETH(campaign.current)} / {formatETH(campaign.goal)}
                      </span>
                    </div>
                    <Progress value={(campaign.current / campaign.goal) * 100} className="h-2" />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{Math.round((campaign.current / campaign.goal) * 100)}% funded</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(campaign.deadline).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => (window.location.hash = `/campaign/${campaign.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
