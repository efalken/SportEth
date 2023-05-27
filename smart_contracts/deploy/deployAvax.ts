import { ethers } from "hardhat";
import fs from "fs";

function saveABIFile(
  fileName: string,
  content: string,
  dirPath = "../frontend/src/abis"
) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  const filePath = `${dirPath}/${fileName}`;

  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath);
  }

  fs.writeFileSync(filePath, content);
}

async function main() {
  const signers = await ethers.getSigners();
  const accounts: string[] = [];
  for (const signer of signers) accounts.push(await signer.getAddress());

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.deployed();
  console.log(`Token contract was deployed to ${token.address}`);

  const Betting = await ethers.getContractFactory("Betting");
  const betting = await Betting.deploy(token.address);
  await betting.deployed();
  console.log(`Betting contract was deployed to ${betting.address}`);

  const Oracle = await ethers.getContractFactory("Oracle");
  const oracle = await Oracle.deploy(betting.address, token.address);
  await oracle.deployed();
  console.log(`Oracle contract was deployed to ${oracle.address}`);
  await betting.setOracleAddress(oracle.address);

  const Reader = await ethers.getContractFactory("ReadSportEth");
  const reader = await Reader.deploy(betting.address, token.address);
  await reader.deployed();
  console.log(`Reader contract was deployed to ${reader.address}`);

  const chainId = (await ethers.provider.getNetwork()).chainId;

  const readerABI = {
    name: "ReaderMain",
    address: reader.address,
    abi: JSON.parse(
      reader.interface.format(ethers.utils.FormatTypes.json) as string
    ),
    networks: { [chainId]: { address: reader.address } },
  };

  saveABIFile("Reader.json", JSON.stringify(readerABI));

  const oracleABI = {
    name: "OracleMain",
    address: oracle.address,
    abi: JSON.parse(
      oracle.interface.format(ethers.utils.FormatTypes.json) as string
    ),
    networks: { [chainId]: { address: oracle.address } },
  };

  saveABIFile("Oracle.json", JSON.stringify(oracleABI));

  const bettingABI = {
    name: "BettingMain",
    address: betting.address,
    abi: JSON.parse(
      betting.interface.format(ethers.utils.FormatTypes.json) as string
    ),
    networks: { [chainId]: { address: betting.address } },
  };

  saveABIFile("Betting.json", JSON.stringify(bettingABI));

  const tokenABI = {
    name: "TokenMain",
    address: token.address,
    abi: JSON.parse(
      token.interface.format(ethers.utils.FormatTypes.json) as string
    ),
    networks: { [chainId]: { address: token.address } },
  };

  saveABIFile("Token.json", JSON.stringify(tokenABI));
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
