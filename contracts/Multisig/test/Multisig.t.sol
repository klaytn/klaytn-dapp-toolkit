// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import "../src/Multisig.sol";
import "../src/Liberies/Error.sol";
import "../src/Liberies/Event.sol";



contract MultiSigTest is Test {
    MultiSig public multiSig;
    
    address alice = address(0x1234567890123456789012345678901234567890);
    address bob = address(0x2345678901234567890123456789012345678901);
    address sam = address(0x3456789012345678901234567890123456789012);
    address james = address(0x1234);


    function setUp() public {
     
      address[] memory mocksingers = new address[](3);
        mocksingers[0] = alice;
        mocksingers[1] = bob;
        mocksingers[2] = sam;

       multiSig = new MultiSig(mocksingers , 2);

        vm.deal(address(multiSig), 10 ether);
    }

  function testSubmitTransaction() public {
        bytes memory datas = "";
        vm.prank(alice );
        multiSig.submitTransaction(james, datas, 3 ether);

        uint256 txIndex = multiSig.transactionCount() - 1;

        (
            address to,
            uint256 value,
            bytes memory data,
            bool isExecuted,
            uint256 numConfirmations
        ) = multiSig.transaction(txIndex);

        assertEq(to, james);
        assertEq(value, 3 ether);
        assertEq(data, datas);
        assertFalse(isExecuted);
        assertEq(numConfirmations, 0);
    }


    function testConfirmTransaction() public {
        bytes memory datas = "";
        vm.prank(alice);
        multiSig.submitTransaction(james, datas, 3 ether);
        uint256 txIndex = multiSig.transactionCount() - 1;
        vm.prank(alice);
        multiSig.comfirmTransactions(txIndex);

        (
            address to,
            uint256 value,
            bytes memory data,
            bool isExecuted,
            uint256 numConfirmations
        ) = multiSig.getTransaction(txIndex);

        assertEq(to, james);
        assertEq(value, 3 ether);
        assertEq(data, datas);
        assertFalse(isExecuted);

        assertEq(numConfirmations, 1);
        assertTrue(multiSig.isConfirmed(txIndex, alice));
    }

     function testExecuteTransaction() public {
        bytes memory data = "";
        vm.prank(alice);
        multiSig.submitTransaction(james, data, 3 ether);
        uint256 txIndex = multiSig.transactionCount() - 1;
        vm.prank(alice);
        multiSig.comfirmTransactions(txIndex);

        vm.prank(bob);
        multiSig.comfirmTransactions(txIndex);

        vm.prank(sam);
         multiSig.comfirmTransactions(txIndex);


          vm.prank(sam);
        multiSig.executeTransaction(txIndex);

        (
            address to,
            uint256 value,
            bytes memory Data,
            bool isExecuted,
            uint256 numConfirmations
        ) = multiSig.getTransaction(txIndex);

        assertEq(to, james);
        assertEq(value, 3 ether);
        assertEq(Data, data);
        assertTrue(isExecuted);

        assertEq(numConfirmations, 3);
    }


    function testrevorkTransaction() public 
    {
      bytes memory data = "";
    

       vm.prank(alice);
        multiSig.submitTransaction(james, data, 3 ether);
        uint256 txIndex = multiSig.transactionCount() - 1;
        vm.prank(alice);
        multiSig.comfirmTransactions(txIndex);

        vm.prank(bob);
        multiSig.comfirmTransactions(txIndex);

        vm.prank(sam);
         multiSig.comfirmTransactions(txIndex);

         vm.prank(sam);
        multiSig.revokeTransaction(txIndex);

        

        (
            address to,
            uint256 value,
            bytes memory Data,
            bool isExecuted,
            uint256 numConfirmations
        ) = multiSig.getTransaction(txIndex);

        assertEq(to, james);
        assertEq(value, 3 ether);
        assertEq(Data, data);
        assertFalse(isExecuted);

        assertEq(numConfirmations, 2);
        vm.prank(alice);
        multiSig.executeTransaction(txIndex);


    }


    function mkaddr(string memory name) public returns (address) {
        address addr = address(
            uint160(uint256(keccak256(abi.encodePacked(name))))
        );
        vm.label(addr, name);
        return addr;
    }

    function switchSigner(address _newSigner) public {
        address foundrySigner = 0x1804c8AB1F12E6bbf3894d4083f33e07309d1f38;
        if (msg.sender == foundrySigner) {
            vm.startPrank(_newSigner);
        } else {
            vm.stopPrank();
            vm.startPrank(_newSigner);
        }
    }
}


