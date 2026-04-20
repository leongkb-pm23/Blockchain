import { useQuery } from "@tanstack/react-query";
import { fetchLumiFilmData, isLumiFilmContractConfigured } from "@/lib/web3/lumifilm-contract";

export function useLumiFilmData(address?: string | null) {
  return useQuery({
    queryKey: ["lumifilm-data", address ?? "anonymous"],
    queryFn: () => fetchLumiFilmData(address),
    staleTime: 10_000,
    refetchInterval: isLumiFilmContractConfigured() ? 15_000 : false,
  });
}
