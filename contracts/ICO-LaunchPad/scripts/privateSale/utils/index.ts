import { ethers } from "hardhat";
import { PrivateSale__factory } from "../../../typechain-types";

export const decodeLogPrivateSale = (log: Log) => {
  const iface = new ethers.utils.Interface(PrivateSale__factory.abi);
  return iface.parseLog(log).args;
};
