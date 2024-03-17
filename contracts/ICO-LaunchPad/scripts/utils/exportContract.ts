import { Wallet } from "ethers";
import fs from "fs";
import { Token } from "../../typechain-types";

export const exportContract = (
  token: { address: string; args: any[] },
  path: string = "scripts/cache/contract.json"
) => {
  fs.writeFile(path, JSON.stringify(token, null, 2), "utf8", (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
};
