// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.22;


library Event {
    
  event Deposit(
   address indexed sender,
   uint256 amount, 
   uint256 balance
   );


    event SubmitTransaction(
        address indexed owner,
        uint256 indexed txIndex,
        address indexed to,
        uint256 value,
        bytes data
    );


    event ConfirmTransaction(
    address indexed owner, 
    uint256 indexed txIndex
    );


    event RevokeConfirmation(
        address indexed owner, 
        uint256 indexed txIndex
        );


    event ExecuteTransaction(
    address indexed owner, 
    uint256 indexed txIndex
    );
    
}