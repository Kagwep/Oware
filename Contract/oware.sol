// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.2;

contract Oware {
    struct Player {
        address id;
        string username;
        uint games_played;
        uint rewards_count;
    }

    struct Game {
        address id;
        address player1;
        address player2;
        address owner;
        bool has_started;
        bool has_ended;
        uint reward;
        uint[12] houses; // Represents the 12 houses on the board
        uint currentPlayer; // Indicates the current player (1 or 2)
    }

    struct Reward {
        address winner;
        uint amount;
        uint game;
    }

    mapping(address => Player) public players;
    mapping(address => Game) public games;
    mapping(uint => Reward) public rewards;

    // Event emitted when a game starts
    event GameStarted(address indexed gameId, address indexed player1, address indexed player2);

    // Event emitted when a seed is planted in a house
    event SeedPlanted(address indexed gameId, address indexed player, uint houseIndex, uint seeds);

    // Modifier to check if the caller is one of the players in the specified game
    modifier onlyGamePlayers(address gameId) {
        require(msg.sender == games[gameId].player1 || msg.sender == games[gameId].player2, "Not a player in this game");
        _;
    }

    // Modifier to check if the caller is the owner of the specified game
    modifier onlyGameOwner(address gameId) {
        require(msg.sender == games[gameId].owner, "Not the owner of this game");
        _;
    }

    // Constructor - Initializes default values for the deploying player
    constructor() {
        players[msg.sender] = Player(msg.sender, "DefaultPlayer", 0, 0);
    }

    // Function to create a new player with the specified username
    function createPlayer(string memory username) external {
        players[msg.sender] = Player(msg.sender, username, 0, 0);
    }

    // Function to create a new game with the specified player as player2
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

    // Function to start a game and initialize the board
    function startGame(address gameId) external onlyGameOwner(gameId) {
        Game storage game = games[gameId];
        require(!game.has_started, "Game has already started");

        // Initialize the board with 4 seeds in each house
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

        game.houses[houseIndex] = 0; // Remove seeds from the house

        // Plant seeds in the next houses in an anticlockwise manner
        uint currentIndex = houseIndex;
        while (seedsToPlant > 0) {
            currentIndex = (currentIndex + 11) % 12; // Move anticlockwise
            game.houses[currentIndex]++;
            seedsToPlant--;
        }

        emit SeedPlanted(gameId, msg.sender, houseIndex, seedsToPlant);

        // Check for winning conditions and update game state
        checkForWinningConditions(gameId, currentIndex);

        // Switch to the other player's turn
        game.currentPlayer = 3 - game.currentPlayer;
    }

    function checkForWinningConditions(address gameId, uint lastHouseIndex) internal {
    Game storage game = games[gameId];

        // Check if the last house was empty before planting seeds
        if (game.houses[lastHouseIndex] == 1) {
            // Capture seeds and update the player's score
            uint seedsCaptured = game.houses[(lastHouseIndex + 5) % 12] + game.houses[
            (lastHouseIndex + 6) % 12] + game.houses[(lastHouseIndex + 7) % 12] + game.houses[lastHouseIndex];
            game.houses[(lastHouseIndex + 5) % 12] = 0;
            game.houses[(lastHouseIndex + 6) % 12] = 0;
            game.houses[(lastHouseIndex + 7) % 12] = 0;
            game.houses[lastHouseIndex] = 0;

            if (game.currentPlayer == 1) {
                players[game.player1].rewards_count += seedsCaptured;
            } else {
                players[game.player2].rewards_count += seedsCaptured;
            }
        }
    }
}