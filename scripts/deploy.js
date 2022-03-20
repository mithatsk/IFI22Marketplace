const hre = require("hardhat");
const filesystem = require("fs");
const uploadMetaData = require("./uploadMetaData");
const { utils } = require("ethers");

async function main() {
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy();
  await nftMarketplace.deployed();

  const rooms = await readJson("./data/uzh-rooms.json");
  for (room of rooms) {
    const url = await uploadMetaData.uploadToIPFS(room);
    await nftMarketplace.mint(nftMarketplace.address, url, utils.parseUnits("0.8", 'ether'));
    console.log(room);
  }

  console.log("deployed marketplace to:", nftMarketplace.address);

  filesystem.writeFileSync('./config.js', `
  export const marketplaceAddress = "${nftMarketplace.address}"
  `)
}

function readJson(filePath) {
  return JSON.parse(filesystem.readFileSync(filePath));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });