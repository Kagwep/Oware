# Oware Game

![Oware](https://res.cloudinary.com/duybctvku/image/upload/v1705537017/iuqrtipgfbayh9kxcwmt.jpg)

## About Oware
LIVE LINK: https://oware.vercel.app/

Description: Oware is a traditional African strategy game known for its simplicity and deep strategic gameplay. 
The game involves sowing seeds across 12 houses, capturing opponents' seeds, and strategic thinking to outwit your opponent.

## Features

- **Smart Contracts with Solidity**: The game logic is implemented as Ethereum smart contracts using Solidity, ensuring transparency and security.

- **Decentralized Development with Hardhat**: We use Hardhat, a development environment for Ethereum, to compile, deploy, and test our smart contracts. It simplifies the development process and supports TypeScript.

- **Areon Network on MetaMask**: The game leverages the Areon blockchain network, providing a decentralized infrastructure for secure and transparent transactions. Players can interact with the game using MetaMask.

- **3D Visualization with Babylon.js and Blender**: Immerse yourself in the Oware world with 3D visualization powered by Babylon.js. The models are created using Blender, ensuring a visually appealing and engaging gaming experience.

- **VP3 Token**: Oware introduces the VP3 token, a digital asset within the game. Players can earn and trade VP3 tokens as rewards for their achievements.

## Development Setup

1. **Install Dependencies**: Run `npm install` to install the necessary dependencies.

2. **Compile Contracts**: Use Hardhat to compile the Solidity smart contracts with `npx hardhat compile`.

3. **Deploy Contracts**: Deploy the contracts to the Aerum network using `npx hardhat deploy`.

4. **Run Locally**: Test the game locally with Hardhat Network or deploy it to a testnet `np`.

## How to Set-Up
1. Oware is played on a board with 12 large play spaces (houses) around the outside of the board and one large score house for each player in the center.
2. Oware requires 48 beads of any color. 4 beads are placed into each of the houses to start the game.
3. Players decide who begins the game by rolling a die.

## How to Play
1. In turns, players pick up all the beads from any 1 of the houses on their side of the board and redistribute them 1 bead per house counter-clockwise, including houses on their opponent’s side of the board.
2. If a player has 12 or more beads to redistribute, they must skip the original house, leaving it empty at the end of the turn.
3. If a player’s final bead is deposited in a house on their side of the board, they take another turn.
4. At the end of the turn, if the last bead is deposited into a house on the opponent’s side of the board with exactly 2 or 3 beads, the player captures all these beads.
5. A player may also capture all the beads in houses prior to the final bead played if they also have 2 or 3 beads in them. If a house has 1, or 4 or more seeds in it, the string of captures is broken.
6. If a move would capture all beads on the opponent’s side of the board, the capture is forfeited as this would prevent their opponent from continuing the game.
7. All captured beads are placed into the player’s score house.

## How to Win
1. To win the game, a player must capture >=25 beads than their opponent.
2. The game ends in a draw if both players have 24 seeds.

## Technologies Used
- Solidity
- Metamask (Areon Network)
- Hardhart
- Babylon.js
- Blender
- Vp3

## Contributing
Contributions to Oware smart contract are welcome! Here are some ways you can help:

    Report bugs and issues on GitHub. Please include steps to reproduce, expected vs actual behavior, and any relevant code.
    Suggest new features and enhancements using the GitHub issues.
    Improve documentation by submitting pull requests with additions, clarifications or fixes.
    Find and submit security vulnerabilities through responsible disclosure.
    Optimize gas usage and improve code efficiency.
    Add test cases to increase code coverage.
    Help translate project content for internationalization.
    Promote the project by publishing articles, tutorials, videos etc.

Pull Requests

Pull requests should target the develop branch. Follow these steps:

    Fork the repo and create your branch from develop.
    Make your code changes following existing styles.
    Ensure CI builds pass and has no conflicts.
    Update documentation as needed.
    Describe PR intent clearly with details.

## License
- MIT Licenses

## Contact Information
- Peter: kagwepeter07@gmail.com [github](https://github.com/Kagwep)
- Ted: ogolated00@gmail.com [github](https://github.com/Ted1166)



