import { ethers } from "hardhat";

async function main() {
  const KitaiPay = await ethers.getContractFactory("KitaiPay");
  const kitaiPay = await KitaiPay.deploy();
  await kitaiPay.deployed();

  console.log(
    `KitaiPay deployed to: ${kitaiPay.address} on network: ${ethers.provider.network.name}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
