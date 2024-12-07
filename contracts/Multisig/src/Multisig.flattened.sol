// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity =0.8.22;

// src/Liberies/Error.sol

library Error {
// Indicates an invalid number of confirmations was provided.
error invalid_number_of_confirmations();
// Indicates that the provided owner is invalid.
error invalid_Owner();
// Indicates that an operation requires an owner to proceed.
error Owner_required();
// Indicates that the owner must be unique but is not.
error Owner_not_Unique();
// Indicates that a transaction has not been confirmed.
error tx_Not_Confirmed();
// Indicates that a transaction has failed.
error Tx_Failed();
}

// src/Liberies/Event.sol

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

// src/Multisig.sol

contract MultiSig {

    uint256 public numComfirmationRequired;
    // Array of owners address 
    address[] public  Owners;

    mapping(address => bool) public isOwner;

   // mapping from the tx index to address to bool 

   mapping (uint256 => mapping(address => bool)) public isConfirmed;

   struct Transaction{
    address to;
    uint256 value;
    bytes   data;
    bool isExecuted;
    uint256 numComfirmations;  
   }
   
   Transaction[] public transaction;

   modifier OnlyOwner {
    if(!isOwner[msg.sender])
    revert Error.invalid_Owner();
    _;
   }

   modifier txExist (uint256 tx_index) {
    require(tx_index < transaction.length, "tx does not exist");
        _;
   }

   modifier notExecuted(uint256 tx_index) {
    require(!transaction[tx_index].isExecuted, "tx already executed");
        _;
    
   }

    modifier notCOmfirmed(uint256 tx_index) {
     require(!isConfirmed[tx_index][msg.sender], "tx already confirmed");
        _;
    
   }

   constructor (address [] memory _Owners , uint256 _numComfirmationRequired) {
    if (_Owners.length == 0) 
    revert Error.Owner_required();

    if(_numComfirmationRequired == 0 || _numComfirmationRequired > _Owners.length)
    revert Error.invalid_number_of_confirmations();

    for(uint256 i = 0 ; i < _Owners.length ; i++){
        address owners = _Owners[i];

        if (owners == address(0))
        revert Error.invalid_Owner();

        isOwner[owners] = true;

        Owners.push(owners);
    }
 
    numComfirmationRequired = _numComfirmationRequired;

   }

   function submitTransaction(
    address _to,
    bytes calldata _data,
    uint256 _value
    ) 
    external 
    OnlyOwner {
        uint256 tx_index = transaction.length;

        transaction.push(
            Transaction({
                to: _to,
                value: _value,
                data: _data,
                isExecuted: false,
                numComfirmations: 0
            })
        );
    emit Event.SubmitTransaction(msg.sender, tx_index, _to,_value,_data);
   } 

    function comfirmTransactions(
        uint256 tx_index
        ) 
        external 
        OnlyOwner
        txExist(tx_index)
        notExecuted(tx_index)
        notCOmfirmed(tx_index)
        {
        Transaction storage transactions  = transaction[tx_index];
        transactions.numComfirmations+=1;
        isConfirmed[tx_index][msg.sender] = true;

       emit Event.ConfirmTransaction(msg.sender,tx_index);

        }

     function executeTransaction
     (uint256 tx_index)
     external
     OnlyOwner
     txExist(tx_index)
     notExecuted(tx_index)
     {
        Transaction storage transactions = transaction[tx_index];

        require(
            transactions.numComfirmations >= numComfirmationRequired,
            "cannot execute tx"
        );

       transactions.isExecuted = true;
        (bool success,) =
        transactions.to.call{value: transactions.value}(transactions.data);

        if(!success)
        revert Error.Tx_Failed();

        emit Event.ExecuteTransaction(msg.sender, tx_index);
     }

     function revokeTransaction
     (uint256 tx_index)
     external
     OnlyOwner
     txExist(tx_index)
     notExecuted(tx_index)
     {
        Transaction storage transactions = transaction[tx_index];
       if (!isConfirmed[tx_index][msg.sender]) 
            revert  Error.tx_Not_Confirmed();
        transactions.numComfirmations -= 1;
        isConfirmed[tx_index][msg.sender] = false;

        emit Event.RevokeConfirmation(msg.sender, tx_index);
     }

    function getOwner
    () external view 
    returns (address [] memory)
    {
        return Owners;
    }

   
   function transactionCount()
   external view 
   returns (uint256)
   {
    return transaction.length;
   }

   function getTransaction
   (
    uint256 tx_index
   )
   external
   view 
   returns
   (
    address to,
    uint256 value,
    bytes memory data,
    bool isExecuted,
    uint256 numComfirmations
   )
  {
    Transaction storage transactions = transaction[tx_index];

    return (
        transactions.to,
        transactions.value,
        transactions.data,
        transactions.isExecuted,
        transactions.numComfirmations

    );
  }

    receive() external payable 
    {
      emit Event.Deposit(msg.sender, msg.value,address(this).balance);
    }

   
}
