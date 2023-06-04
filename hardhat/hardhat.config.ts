import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    hardhat: {},
    polygon_mumbai: {
      url: process.env.POLYGON_MUMBAI_LUNIVERSE_RPC,
      accounts: [process.env.PRIVATE_KEY as string],
    },
    zkEVM_testnet: {
      url: process.env.POLYGON_ZKEVM_TESTNET_RPC,
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
};

export default config;
