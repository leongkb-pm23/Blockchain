import { formatEther } from "ethers";
import { create } from "zustand";
import {
  getBrowserProvider,
  getEthereumProvider,
  getRequiredChainId,
  getRequiredNetworkName,
  getRpcUrl,
} from "./ethereum";

interface WalletState {
  hasProvider: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  chainId: number | null;
  balance: string | null;
  error: string | null;
  initialize: () => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
  switchToRequiredNetwork: () => Promise<void>;
  clearError: () => void;
}

let listenersAttached = false;

async function syncWalletState(set: (state: Partial<WalletState>) => void) {
  const provider = getBrowserProvider();
  const ethereum = getEthereumProvider();

  if (!provider || !ethereum) {
    set({
      hasProvider: false,
      isConnected: false,
      address: null,
      chainId: null,
      balance: null,
      isConnecting: false,
    });
    return;
  }

  const accounts = (await ethereum.request({ method: "eth_accounts" })) as string[];
  const network = await provider.getNetwork();

  if (accounts.length === 0) {
    set({
      hasProvider: true,
      isConnected: false,
      address: null,
      chainId: Number(network.chainId),
      balance: null,
      isConnecting: false,
    });
    return;
  }

  const signer = await provider.getSigner();
  const balance = await provider.getBalance(accounts[0]);

  set({
    hasProvider: true,
    isConnected: true,
    address: await signer.getAddress(),
    chainId: Number(network.chainId),
    balance: formatEther(balance),
    isConnecting: false,
    error: null,
  });
}

function attachListeners(set: (state: Partial<WalletState>) => void) {
  const ethereum = getEthereumProvider();

  if (!ethereum || listenersAttached) {
    return;
  }

  const sync = () => {
    void syncWalletState(set);
  };

  ethereum.on?.("accountsChanged", sync);
  ethereum.on?.("chainChanged", sync);
  listenersAttached = true;
}

export const useWalletStore = create<WalletState>((set) => ({
  hasProvider: Boolean(getEthereumProvider()),
  isConnected: false,
  isConnecting: false,
  address: null,
  chainId: null,
  balance: null,
  error: null,
  initialize: async () => {
    attachListeners(set);
    await syncWalletState(set);
  },
  connect: async () => {
    const ethereum = getEthereumProvider();

    if (!ethereum) {
      set({
        hasProvider: false,
        error: "MetaMask is not installed. Install the browser extension first.",
      });
      return;
    }

    set({ isConnecting: true, error: null, hasProvider: true });

    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      await syncWalletState(set);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Wallet connection failed.";

      set({
        isConnecting: false,
        error: message,
      });
    }
  },
  disconnect: () =>
    set({
      isConnected: false,
      address: null,
      balance: null,
      error: null,
    }),
  refreshBalance: async () => {
    await syncWalletState(set);
  },
  switchToRequiredNetwork: async () => {
    const ethereum = getEthereumProvider();

    if (!ethereum) {
      set({ error: "MetaMask is not installed." });
      return;
    }

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${getRequiredChainId().toString(16)}` }],
      });
      await syncWalletState(set);
    } catch (error) {
      const switchError = error as { code?: number };

      if (switchError.code === 4902) {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${getRequiredChainId().toString(16)}`,
              chainName: getRequiredNetworkName(),
              nativeCurrency: {
                name: "Ether",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: [getRpcUrl()],
            },
          ],
        });
        await syncWalletState(set);
        return;
      }

      const message =
        error instanceof Error ? error.message : "Unable to switch MetaMask network.";

      set({ error: message });
    }
  },
  clearError: () => set({ error: null }),
}));
