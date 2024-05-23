// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import "../src/Multisig.sol";


contract MultiSigScript is Script {

    MultiSig public multisig;
    function run() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);

        // Correctly formatted constructor arguments
        address[] memory owners = new address[](2);
        owners[0] = 0x5b7b30F182d56e0D93F0A385BdC8B4cA165Bf662;
        owners[1] = 0x3a2439dcaAD194Ae3F7f6ef3F1f15Ea526c1dD3a;
        uint256 numConfirmationsRequired = 2;

        multisig = new MultiSig(owners, numConfirmationsRequired);

        vm.stopBroadcast();
}
}