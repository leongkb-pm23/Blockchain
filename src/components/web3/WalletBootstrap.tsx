import { useEffect } from "react";
import { useWalletStore } from "@/lib/web3/wallet-store";

export function WalletBootstrap(): null {
  const initialize = useWalletStore((state) => state.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return null;
}
