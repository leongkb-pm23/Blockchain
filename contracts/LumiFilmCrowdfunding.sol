// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LumiFilmCrowdfunding {
    struct Campaign {
        uint256 id;
        address creator;
        string title;
        string description;
        uint256 goal;
        uint256 pledged;
        uint256 deadline;
        uint256 createdAt;
        bool claimed;
        bool canceled;
    }

    uint256 public campaignCount;

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions;

    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        string title,
        uint256 goal,
        uint256 deadline
    );
    event ContributionReceived(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount
    );
    event FundsClaimed(
        uint256 indexed campaignId,
        address indexed creator,
        uint256 amount
    );
    event RefundClaimed(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount
    );

    function createCampaign(
        string calldata title,
        string calldata description,
        uint256 goal,
        uint256 deadline
    ) external returns (uint256) {
        require(bytes(title).length > 0, "Title required");
        require(bytes(description).length > 0, "Description required");
        require(goal > 0, "Goal must be greater than zero");
        require(deadline > block.timestamp, "Deadline must be in the future");

        campaignCount += 1;
        uint256 campaignId = campaignCount;

        campaigns[campaignId] = Campaign({
            id: campaignId,
            creator: msg.sender,
            title: title,
            description: description,
            goal: goal,
            pledged: 0,
            deadline: deadline,
            createdAt: block.timestamp,
            claimed: false,
            canceled: false
        });

        emit CampaignCreated(campaignId, msg.sender, title, goal, deadline);
        return campaignId;
    }

    function contribute(uint256 campaignId) external payable {
        Campaign storage campaign = campaigns[campaignId];

        require(campaign.id != 0, "Campaign not found");
        require(!campaign.canceled, "Campaign cancelled");
        require(!campaign.claimed, "Funds already claimed");
        require(block.timestamp < campaign.deadline, "Campaign ended");
        require(msg.value > 0, "Contribution must be greater than zero");

        contributions[campaignId][msg.sender] += msg.value;
        campaign.pledged += msg.value;

        emit ContributionReceived(campaignId, msg.sender, msg.value);
    }

    function claimFunds(uint256 campaignId) external {
        Campaign storage campaign = campaigns[campaignId];

        require(campaign.id != 0, "Campaign not found");
        require(msg.sender == campaign.creator, "Only creator can claim");
        require(!campaign.claimed, "Already claimed");
        require(!campaign.canceled, "Campaign cancelled");
        require(campaign.pledged >= campaign.goal, "Goal not reached");

        campaign.claimed = true;
        uint256 amount = campaign.pledged;

        (bool success, ) = payable(campaign.creator).call{value: amount}("");
        require(success, "Transfer failed");

        emit FundsClaimed(campaignId, campaign.creator, amount);
    }

    function refund(uint256 campaignId) external {
        Campaign storage campaign = campaigns[campaignId];
        uint256 amount = contributions[campaignId][msg.sender];

        require(campaign.id != 0, "Campaign not found");
        require(amount > 0, "No contribution to refund");
        require(
            campaign.canceled ||
                (block.timestamp >= campaign.deadline && campaign.pledged < campaign.goal),
            "Refund unavailable"
        );

        contributions[campaignId][msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Refund failed");

        emit RefundClaimed(campaignId, msg.sender, amount);
    }
}
