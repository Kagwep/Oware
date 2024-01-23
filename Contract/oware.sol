// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.2;

contract Oware {
    struct Player {
        address id;
        string username;
        uint games_played;
        uint rewards_count;
        Win[] wins;
    }

    struct Game {
        address id;
        address player1;
        address player2;
        address owner;
        bool has_started;
        bool has_ended;
        uint reward;
        uint[12] houses;
        uint currentPlayer; 
    }

    struct Reward {
        address winner;
        uint amount;
        uint game;
    }

    struct Win {
        address player;
        uint wins;
    }

    mapping(address => Player) public players;
    mapping(address => Game) public games;
    mapping(uint => Reward) public rewards;
 
    event GameStarted(address indexed gameId, address indexed player1, address indexed player2);
    event SeedPlanted(address indexed gameId, address indexed player, uint houseIndex, uint seeds);
    event PlayerWins(address indexed player, uint wins);

    modifier onlyGamePlayers(address gameId) {
        require(msg.sender == games[gameId].player1 || msg.sender == games[gameId].player2, "Not a player in this game");
        _;
    }

    modifier onlyGameOwner(address gameId) {
        require(msg.sender == games[gameId].owner, "Not the owner of this game");
        _;
    }

    // constructor() {
    //     players[msg.sender] = Player(msg.sender, "DefaultPlayer", 0, 0, new Win[](10));
    // }

    // function createPlayer(string memory username) external {
    //     players[msg.sender] = Player(msg.sender, username, 0, 0, new Win[](10));
    // }

    function createGame(address player2) external {
        require(players[player2].id != address(0), "Player 2 does not exist");

        Game storage newGame = games[msg.sender];
        newGame.id = msg.sender;
        newGame.player1 = msg.sender;
        newGame.player2 = player2;
        newGame.owner = msg.sender;
        newGame.has_started = false;
        newGame.has_ended = false;
        newGame.reward = 0;
        newGame.currentPlayer = 1;

        emit GameStarted(msg.sender, msg.sender, player2);
    }
    
    function startGame(address gameId) external onlyGameOwner(gameId) {
        Game storage game = games[gameId];
        require(!game.has_started, "Game has already started");

        for (uint i = 0; i < 12; i++) {
            game.houses[i] = 4;
        }

        game.has_started = true;
    }

    // Function to plant seeds in a house based on game rules
    function plantSeed(address gameId, uint houseIndex) external onlyGamePlayers(gameId) {
        Game storage game = games[gameId];
        require(game.has_started, "Game has not started");
        require(!game.has_ended, "Game has ended");
        require(game.currentPlayer == 1 && msg.sender == game.player1 || game.currentPlayer == 2 && msg.sender == game.player2, "It's not your turn");

        uint seedsToPlant = game.houses[houseIndex];
        require(seedsToPlant > 0, "No seeds in the selected house");

        game.houses[houseIndex] = 0;

        // Plant seeds in the next houses in an anticlockwise manner
        uint currentIndex = houseIndex;
        while (seedsToPlant > 0) {
            currentIndex = (currentIndex + 11) % 12;
            game.houses[currentIndex]++;
            seedsToPlant--;
        }

        emit SeedPlanted(gameId, msg.sender, houseIndex, seedsToPlant);

        checkForWinningConditions(gameId, currentIndex);

        game.currentPlayer = 3 - game.currentPlayer;
    }

    function checkForWinningConditions(address gameId, uint lastHouseIndex) internal {
        Game storage game = games[gameId];

        if (game.houses[lastHouseIndex] == 1) {
            // Capture seeds and update the player's score
            uint seedsCaptured = game.houses[(lastHouseIndex + 5) % 12] + game.houses[(lastHouseIndex + 6) % 12] + game.houses[(lastHouseIndex + 7) % 12] + game.houses[lastHouseIndex];
            game.houses[(lastHouseIndex + 5) % 12] = 0;
            game.houses[(lastHouseIndex + 6) % 12] = 0;
            game.houses[(lastHouseIndex + 7) % 12] = 0;
            game.houses[lastHouseIndex] = 0;

            if (game.currentPlayer == 1) {
                players[game.player1].rewards_count += seedsCaptured;
            } else {
                players[game.player2].rewards_count += seedsCaptured;
            }

            checkAbapaRule(gameId, lastHouseIndex);
        }
    }

    function checkAbapaRule(address gameId, uint lastHouseIndex) internal {
    Game storage game = games[gameId];

    uint opponentTerritoryIndex = (lastHouseIndex + 6) % 12;
    uint seedsInOpponentTerritory = game.houses[opponentTerritoryIndex] + game.houses[(opponentTerritoryIndex + 11) % 12] + game.houses[(opponentTerritoryIndex + 10) % 12];

    uint seedsCaptured; 

    if (seedsInOpponentTerritory == 2 || seedsInOpponentTerritory == 3) {
        // Capture seeds in opponent's territory
        seedsCaptured = game.houses[opponentTerritoryIndex] + game.houses[(opponentTerritoryIndex + 11) % 12] + game.houses[(opponentTerritoryIndex + 10) % 12];
        game.houses[opponentTerritoryIndex] = 0;
        game.houses[(opponentTerritoryIndex + 11) % 12] = 0;
        game.houses[(opponentTerritoryIndex + 10) % 12] = 0;

        if (game.currentPlayer == 1) {
            players[game.player1].rewards_count += seedsCaptured;
        } else {
            players[game.player2].rewards_count += seedsCaptured;
        }

        updateWins(gameId, game.currentPlayer);
    }
}



    function updateWins(address gameId, uint player) internal {
        Game storage game = games[gameId];
        Player storage playerData;
        if (player == 1) {
            playerData = players[game.player1];
        } else {
            playerData = players[game.player2];
        }

        bool playerWon = false;

        // Check if the player has reached 25 or more wins
        if (playerData.wins.length > 0) {
            for (uint i = 0; i < playerData.wins.length; i++) {
                if (playerData.wins[i].wins >= 25) {
                    playerWon = true;
                    break;
                }
            }
        }

        if (playerWon) {
            emit PlayerWins(playerData.id, playerData.wins.length);
            game.has_ended = true;

            if (game.reward > 0) {
                distributeReward(gameId);
            }
        }
    }

    function distributeReward(address gameId) internal {
        Game storage game = games[gameId];

        if (game.currentPlayer == 1) {
            players[game.player1].rewards_count += game.reward;
        } else {
            players[game.player2].rewards_count += game.reward;
        }

        game.reward = 0;
    }

    function setReward(address gameId, uint amount) external onlyGameOwner(gameId) {
        Game storage game = games[gameId];
        require(!game.has_started, "Cannot set reward once the game has started");
        game.reward = amount;
    }

    function getReward(address gameId) external view returns (uint) {
        return games[gameId].reward;
    }

    function setWin(address player, uint wins) external onlyGameOwner(player) {
        Win[] storage playerWins = players[player].wins;
        playerWins.push(Win(player, wins));
    }

    function getWins(address player) external view returns (Win[] memory) {
        return players[player].wins;
    }
}
