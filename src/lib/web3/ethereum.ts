import { BrowserProvider, JsonRpcProvider } from "ethers";

export interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>;
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
}

export function getEthereumProvider(): EthereumProvider | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.ethereum ?? null;
}

export function getBrowserProvider() {
  const provider = getEthereumProvider();
  return provider ? new BrowserProvider(provider) : null;
}

export function getReadonlyProvider() {
  return new JsonRpcProvider(import.meta.env.VITE_LUMIFILM_RPC_URL ?? "http://127.0.0.1:7545");
}

export function getRequiredChainId() {
  return Number(import.meta.env.VITE_LUMIFILM_CHAIN_ID ?? "1337");
}

export function getRequiredNetworkName() {
  return import.meta.env.VITE_LUMIFILM_NETWORK_NAME ?? "Ganache Local";
}

export function getRpcUrl() {
  return import.meta.env.VITE_LUMIFILM_RPC_URL ?? "http://127.0.0.1:7545";
}
