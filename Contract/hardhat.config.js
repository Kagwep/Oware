
require("@nomicfoundation/hardhat-toolbox");
//require("@nomiclabs/hardhat-etherscan");

require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */


const AREON_URL = process.env.AREON_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: { version: "0.8.19" },
  networks: {
    testnet: {
      url: AREON_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    ganache: {
      url: `http://127.0.0.1:7545`,
    },
  },
};
