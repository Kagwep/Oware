# Contract Structure

## Data Structures

### Player

address: The player's Ethereum address
username: The player's username
gamesPlayed: The number of games the player has played
rewardsCount: The number of rewards the player has earned
playerRank: The player's rank
winIds: An array of win IDs associated with the player
### Game

gameId: The unique ID of the game
player1: The address of player 1
player2: The address of player 2
winner: The address of the winning player
### Reward

tokenId: The unique ID of the reward token
recipient: The address of the reward recipient
### Win

winId: The unique ID of the win
winTrace: A record of crucial points that can be verified as leading to the win. 
winner: The address of the winning player
## Mappings and Arrays

mapping(address => Player) public players: Maps player addresses to their corresponding Player structs.
mapping(uint256 => Game) public games: Maps game IDs to their corresponding Game structs.
mapping(uint256 => Reward) public rewards: Maps token IDs to their corresponding Reward structs.
mapping(uint256 => Win) public wins: Maps win IDs to their corresponding Win structs.
Arrays like total_players, total_games, total_rewards, and total_wins store the total counts of players, games, rewards, and wins respectively.
## Constructor

Initializes an instance of the ARC721 contract.
## Functions

### recordWin

Records a win by storing win-related information.
Mints an NFT using the win ID as the token ID.
Records the reward associated with the win.
Updates player information.
Adds the game information.
### Helper Functions

getPlayer(address playerAddress): Retrieves player information.
getAllPlayers, getAllGames, getAllRewards, getAllWins: Return arrays of all players, games, rewards, and wins.
getGameById(uint256 gameId), getRewardById(uint256 tokenId), getWinById(uint256 winId): Return individual game, reward, and win by ID.
getTokenMetadata(uint256 tokenId): Retrieves metadata associated with a token ID.
getARC721Name, getARC721Symbol: Retrieve the name and symbol of the ARC721 contract.
getBalanceOf(address owner), getTotalSupply(): Get balance of tokens owned by an address and total token supply.
## Contract Interaction

Interacts with the ARC721 contract to mint tokens and retrieve token metadata.
## Purpose

Serves as the backend logic for managing player data, game records, rewards, and NFT minting in a gaming platform.
Developers can interact with its functions to retrieve information about players, games, rewards, and NFTs.
