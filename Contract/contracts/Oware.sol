// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


import "./ARC721.sol";

contract Oware  {

   ARC721 public arc721Contract;
    
   constructor() {
        arc721Contract = new ARC721();
    }

    struct Player {
        address playerAddress;
        string username;
        uint256 gamesPlayed;
        uint256 rewardsCount;
        uint256 playerRank;
        uint256[] wins; // Array storing game IDs of wins
    }

    struct Game {
        uint256 gameId;
        address player1;
        address player2;
        address winner;
    }

    struct Reward {
        uint256 tokenId; // Same as the token ID of minted NFT
        address reward_to;// Additional reward-related fields
    }

    struct Win {
        uint256 winId;
        string winTrace;
        address winningPlayer;
    }

    mapping(address => Player) public players;
    address[] total_players;
    mapping(uint256 => Game) public games;
    uint256[] total_games;
    mapping(uint256 => Reward) public rewards;
    uint256[] total_rewards;
    mapping(uint256 => Win) public wins;
    uint256[] total_wins;



    function recordWin(uint256 winId, string memory winTrace,address opponent,string memory player_username) external {
        // Record the win
        wins[winId] = Win({
            winId: winId,
            winTrace: winTrace,
            winningPlayer: msg.sender
        });

        total_wins.push(winId);

        // Mint an NFT using the winId as the tokenId
        arc721Contract.mintToken(msg.sender);

        // Record the reward
        rewards[winId] = Reward({
            tokenId: winId,
            reward_to:msg.sender
        });

        total_rewards.push(winId);

        // Check if the player exists
        Player storage player = getPlayer(msg.sender);

        // If the player doesn't exist, create a new player
        if (player.playerAddress == address(0)) {
            players[msg.sender] = Player({
                playerAddress: msg.sender,
                username: player_username, // You can set a default username here
                gamesPlayed: 0,
                rewardsCount: 0,
                playerRank: 0,
                wins: new uint256[](0)
            });
            total_players.push(msg.sender);
        }

        // Increment games played, player rank, and add the win to the player's record
        player.gamesPlayed++;
        player.playerRank++;
        player.wins.push(winId);

        // Add the game
        games[winId] = Game({
            gameId: winId,
            player1: msg.sender,
            player2: opponent, // You can set a default value here
            winner: msg.sender
        });

        total_games.push(winId);
    }


    function getPlayer(address playerAddress) internal view returns (Player storage) {
        return players[playerAddress];
    }

    function getAllPlayers() external view returns (Player[] memory) {
            Player[] memory allPlayers = new Player[](total_players.length);

            for (uint256 i = 0; i < total_players.length; i++) {
                allPlayers[i] = players[total_players[i]];
            }

            return allPlayers;
        }

    // Get all games
    function getAllGames() external view returns (Game[] memory) {
        Game[] memory allGames = new Game[](total_games.length);

        for (uint256 i = 0; i < total_games.length; i++) {
            allGames[i] = games[total_games[i]];
        }

        return allGames;
    }

    // Get an individual game by gameId
    function getGameById(uint256 gameId) external view returns (Game memory) {
        return games[gameId];
    }

    // Get all rewards
    function getAllRewards() external view returns (Reward[] memory) {
        Reward[] memory allRewards = new Reward[](total_rewards.length);

        for (uint256 i = 0; i < total_rewards.length; i++) {
            allRewards[i] = rewards[total_rewards[i]];
        }

        return allRewards;
    }

    // Get an individual reward by tokenId
    function getRewardById(uint256 tokenId) external view returns (Reward memory) {
        return rewards[tokenId];
    }

    // Get all wins
    function getAllWins() external view returns (Win[] memory) {
        Win[] memory allWins = new Win[](total_wins.length);

        for (uint256 i = 0; i < total_wins.length; i++) {
            allWins[i] = wins[total_wins[i]];
        }

        return allWins;
    }

    // Get an individual win by winId
    function getWinById(uint256 winId) external view returns (Win memory) {
        return wins[winId];
    }

    function getTokenMetadata(uint256 tokenId) external view returns (string memory) {
        return arc721Contract.tokenMetadata(tokenId);
    }

    
    function getARC721Name() external view returns (string memory) {
        return arc721Contract.name();
    }

    function getARC721Symbol() external view returns (string memory) {
        return arc721Contract.symbol();
    }

    function getBalanceOf(address owner) external view returns (uint256) {
        return arc721Contract.balanceOf(owner);
    }

    function getTotalSupply() external view returns (uint256) {
        return arc721Contract.totalSupply();
    }



}
