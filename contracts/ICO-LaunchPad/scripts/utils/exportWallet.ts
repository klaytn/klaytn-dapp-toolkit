import {Wallet} from "ethers";
import fs from "fs";

export const exportWallets = (args: {[name:string]: Wallet}) => {
     fs.writeFile('scripts/cache/wallets.json', JSON.stringify(Object.keys(args).map(arg => {
        return {
            name: arg,
            address: args[arg].address,
            privateKey: args[arg].privateKey
        }
    }),null, 2), 'utf8', (err) => {
    if (err) {
        console.error(err);
        return;
    }
    })
}