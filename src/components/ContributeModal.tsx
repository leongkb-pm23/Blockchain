import { useState } from 'react';
import { Campaign, useWalletStore, formatETH } from '@/lib/index';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  contributeToCampaignOnChain,
  getReadableWeb3Error,
} from '@/lib/web3/lumifilm-contract';
import { ContractStatusCard } from '@/components/web3/ContractStatusCard';

interface ContributeModalProps {
  campaign: Campaign;
  open: boolean;
  onClose: () => void;
}

export function ContributeModal({ campaign, open, onClose }: ContributeModalProps) {
  const { isConnected } = useWalletStore();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      const hash = await contributeToCampaignOnChain(campaign.id, amount);
      setTxHash(hash);
      setSuccess(true);
    } catch (submitError) {
      setError(getReadableWeb3Error(submitError, 'Contribution failed. Please try again.'));
    } finally {
      setLoading(false);
    }

    setTimeout(() => {
      setSuccess(false);
      setAmount('');
      setTxHash('');
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    if (!loading) {
      setAmount('');
      setError('');
      setSuccess(false);
      setTxHash('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-md border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Contribute to Campaign
          </DialogTitle>
          <DialogDescription className="text-muted-foreground break-words">
            {campaign.title}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!isConnected ? (
            <motion.div
              key="not-connected"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-8 text-center"
            >
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Please login to continue
              </p>
              <Button
                onClick={handleClose}
                variant="outline"
                className="border-border/50 hover:bg-muted/50"
              >
                Close
              </Button>
            </motion.div>
          ) : success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-chart-3" />
              </motion.div>
              <p className="text-lg font-medium text-foreground mb-2">
                Transaction successful
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Your contribution of {formatETH(parseFloat(amount))} has been recorded on-chain.
              </p>
              <p className="text-xs font-mono text-muted-foreground break-all">
                {txHash}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSubmit}
              className="space-y-6 py-4"
            >
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-foreground">
                  Amount (ETH)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={loading}
                  className="bg-background/50 border-border/50 focus:border-accent font-mono text-lg"
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </motion.p>
                )}
              </div>

              <ContractStatusCard />

              <div className="bg-muted/30 rounded-lg p-4 space-y-2 border border-border/30">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Campaign Goal</span>
                  <span className="font-mono text-foreground">
                    {formatETH(campaign.goal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Funding</span>
                  <span className="font-mono text-foreground">
                    {formatETH(campaign.current)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-mono text-accent">
                    {formatETH(Math.max(0, campaign.goal - campaign.current))}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 border-border/50 hover:bg-muted/50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing transaction...
                    </>
                  ) : (
                    'Contribute'
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
