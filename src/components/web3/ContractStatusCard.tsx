import { AlertTriangle, CheckCircle2, ExternalLink, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAddress } from "@/lib/index";
import {
  getConfiguredContractAddress,
  isLumiFilmContractConfigured,
} from "@/lib/web3/lumifilm-contract";
import { useWalletStore } from "@/lib/web3/wallet-store";
import { getRequiredChainId, getRequiredNetworkName } from "@/lib/web3/ethereum";

interface ContractStatusCardProps {
  message?: string | null;
}

export function ContractStatusCard({ message }: ContractStatusCardProps) {
  const {
    hasProvider,
    isConnected,
    isConnecting,
    address,
    chainId,
    connect,
    switchToRequiredNetwork,
  } = useWalletStore();

  const contractConfigured = isLumiFilmContractConfigured();
  const onRequiredNetwork = chainId === null || chainId === getRequiredChainId();

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Wallet className="h-5 w-5 text-accent" />
          Web3 Status
        </CardTitle>
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-xl border border-border/50 bg-background/40 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-foreground">MetaMask</p>
              <p className="text-sm text-muted-foreground">
                {hasProvider
                  ? isConnected
                    ? `Connected as ${formatAddress(address ?? "")}`
                    : "Installed but not connected to this app yet."
                  : "MetaMask extension not detected in this browser."}
              </p>
            </div>
            {hasProvider && isConnected ? (
              <CheckCircle2 className="h-5 w-5 text-chart-3" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-background/40 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-foreground">Network</p>
              <p className="text-sm text-muted-foreground">
                {chainId
                  ? `Connected chain: ${chainId}. Required: ${getRequiredNetworkName()} (${getRequiredChainId()}).`
                  : `Switch MetaMask to ${getRequiredNetworkName()} (${getRequiredChainId()}).`}
              </p>
            </div>
            {onRequiredNetwork ? (
              <CheckCircle2 className="h-5 w-5 text-chart-3" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-background/40 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-foreground">Remix Deployment</p>
              <p className="text-sm text-muted-foreground">
                {contractConfigured
                  ? `Contract address configured: ${formatAddress(getConfiguredContractAddress())}`
                  : "Deploy contracts/LumiFilmCrowdfunding.sol in Remix and set VITE_LUMIFILM_CONTRACT_ADDRESS in .env.local."}
              </p>
            </div>
            {contractConfigured ? (
              <CheckCircle2 className="h-5 w-5 text-chart-3" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {!isConnected ? (
            <Button onClick={() => void connect()} disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect MetaMask"}
            </Button>
          ) : null}

          {!onRequiredNetwork ? (
            <Button variant="outline" onClick={() => void switchToRequiredNetwork()}>
              Switch To {getRequiredNetworkName()}
            </Button>
          ) : null}

          <Button variant="ghost" asChild>
            <a
              href="https://remix.ethereum.org"
              target="_blank"
              rel="noreferrer"
            >
              Open Remix
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
