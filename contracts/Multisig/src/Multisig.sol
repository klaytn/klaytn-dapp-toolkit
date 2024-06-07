// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.22;
import "./Liberies/Error.sol";
import "./Liberies/Event.sol";


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