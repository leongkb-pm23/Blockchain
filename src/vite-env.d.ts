/// <reference types="vite/client" />

// Global constants defined at build time
declare const __ROUTE_MESSAGING_ENABLED__: boolean;

interface ImportMetaEnv {
  readonly VITE_LUMIFILM_RPC_URL?: string;
  readonly VITE_LUMIFILM_CHAIN_ID?: string;
  readonly VITE_LUMIFILM_NETWORK_NAME?: string;
  readonly VITE_LUMIFILM_CONTRACT_ADDRESS?: string;
  readonly VITE_LUMIFILM_ORG_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  ethereum?: import("@/lib/web3/ethereum").EthereumProvider;
}
