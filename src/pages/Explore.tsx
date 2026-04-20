import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { CampaignCard } from '@/components/CampaignCard';
import { MOCK_CAMPAIGNS, type CampaignStatus } from '@/lib/index';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type FilterType = 'all' | CampaignStatus;

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredCampaigns = useMemo(() => {
    let filtered = MOCK_CAMPAIGNS;

    if (searchQuery.trim()) {
      filtered = filtered.filter((campaign) =>
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeFilter !== 'all') {
      filtered = filtered.filter((campaign) => campaign.status === activeFilter);
    }

    return filtered;
  }, [searchQuery, activeFilter]);

  const filterButtons: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Successful', value: 'successful' },
    { label: 'Failed', value: 'failed' },
  ];

  return (
    <Layout>
      <div className="min-h-screen py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-chart-2 bg-clip-text text-transparent">
              Explore Campaigns
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover groundbreaking film projects seeking support
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 space-y-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search campaigns by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg bg-card/50 backdrop-blur-sm border-border/50 focus:border-accent transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filter:</span>
              </div>
              {filterButtons.map((filter) => (
                <Button
                  key={filter.value}
                  variant={activeFilter === filter.value ? 'default' : 'outline'}
                  onClick={() => setActiveFilter(filter.value)}
                  className="transition-all duration-200"
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <p className="text-muted-foreground">
              Showing <span className="text-foreground font-semibold">{filteredCampaigns.length}</span>{' '}
              {filteredCampaigns.length === 1 ? 'campaign' : 'campaigns'}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {filteredCampaigns.length > 0 ? (
              <motion.div
                key="campaigns-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredCampaigns.map((campaign, index) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <CampaignCard campaign={campaign} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-24 px-4"
              >
                <div className="w-24 h-24 rounded-full bg-muted/20 flex items-center justify-center mb-6">
                  <Search className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">No campaigns found</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Try adjusting your search query or filters to discover more projects
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                  }}
                  className="mt-6"
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
