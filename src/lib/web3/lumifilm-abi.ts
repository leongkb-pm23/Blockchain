export const LUMIFILM_CROWDFUNDING_ABI = [
  "function campaignCount() view returns (uint256)",
  "function campaigns(uint256) view returns (uint256 id, address creator, string title, string description, uint256 goal, uint256 pledged, uint256 deadline, uint256 createdAt, bool claimed, bool canceled)",
  "function contributions(uint256, address) view returns (uint256)",
  "function createCampaign(string title, string description, uint256 goal, uint256 deadline) returns (uint256)",
  "function contribute(uint256 campaignId) payable",
  "function claimFunds(uint256 campaignId)",
  "function refund(uint256 campaignId)",
  "event CampaignCreated(uint256 indexed campaignId, address indexed creator, string title, uint256 goal, uint256 deadline)",
  "event ContributionReceived(uint256 indexed campaignId, address indexed contributor, uint256 amount)",
  "event FundsClaimed(uint256 indexed campaignId, address indexed creator, uint256 amount)",
  "event RefundClaimed(uint256 indexed campaignId, address indexed contributor, uint256 amount)",
] as const;
