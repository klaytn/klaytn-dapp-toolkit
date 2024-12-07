import React from "react";

export default function Advanced() {
  return (
    <div>
      <header>
        <h2>4-Advanced</h2>
      </header>
      <div id="advanced-4-1" className="subSection">
        <h4>4.1. Units</h4>
        <hr />
        <div className="subSection_content">
          <h5>Common units</h5>
          <hr />
          <ul>
            <li>
              <span className="highlight">wei</span> is the smallest
              subdenomination of Ether (1 <span className="highlight">wei</span>{" "}
              == 1)
            </li>
            <li>
              <span className="highlight">gwei</span> is the commonly used
              subdenomination to describe gas price (1{" "}
              <span className="highlight">gwei</span> == 1e9)
            </li>
            <li>
              <span className="highlight">ether</span> unit (1{" "}
              <span className="highlight">ether</span> == 1e18)
            </li>
          </ul>
          <h6>Note</h6>
          <p>
            In Solidity, we will use integers for calculations and the language
            does not support the <span className="highlight">float</span> type.
            The float representation issue causes rounding errors (
            <span className="highlight">rounding</span>) that create logical
            holes for attack.
          </p>
        </div>
        <div className="subSection_content">
          <h5>Time units</h5>
          <hr />
          <ul>
            <li>
              1 == 1 <span className="highlight">seconds</span>
            </li>
            <li>
              1 <span className="highlight">minutes</span> == 60{" "}
              <span className="highlight">seconds</span>
            </li>
            <li>
              1 <span className="highlight">hour</span> == 60{" "}
              <span className="highlight">minutes</span>
            </li>
            <li>
              1 <span className="highlight">days</span> == 60{" "}
              <span className="highlight">hours</span>
            </li>
            <li>
              1 <span className="highlight">weeks</span> == 60{" "}
              <span className="highlight">days</span>
            </li>
          </ul>
          <strong>Example</strong>
          <pre>
            <code>
              {`function f(uint start, uint daysAfter) public {
    if (block.timestamp >= start + daysAfter * 1 days) {
        // ...
    }
}`}
            </code>
          </pre>
        </div>
      </div>
      <div id="advanced-4-2" className="subSection">
        <h4>4.2. Global Variables</h4>
        <hr />
        <div className="subSection_content">
          <h5>Block and Transaction Properties</h5>
          <hr />
          <ul>
            <li>
              <span className="highlight">
                blockhash(uint blockNumber) returns (bytes32)
              </span>{" "}
              : hash of the given block when{" "}
              <span className="highlight">blocknumber</span> is one of the 256
              most recent blocks; otherwise returns zero
            </li>
            <li>
              <span className="highlight">block.basefee (uint)</span>: current
              block’s base fee
            </li>
            <li>
              <span className="highlight">block.chainid (uint)</span>: current
              chain id
            </li>
            <li>
              <span className="highlight">
                block.coinbase (address payable)
              </span>{" "}
              : current block miner’s address
            </li>
            <li>
              <span className="highlight">block.gaslimit (uint)</span>: current
              block gaslimit
            </li>
            <li>
              <span className="highlight">block.number (uint)</span>: current
              block number
            </li>
            <li>
              <span className="highlight">block.timestamp (uint)</span>: current
              block timestamp as seconds since unix epoch
            </li>
            <li>
              <span className="highlight">gasleft() returns (uint256)</span> :
              remaining gas
            </li>
            <li>
              <span className="highlight">msg.data (bytes calldata)</span> :
              complete calldata
            </li>
            <li>
              <span className="highlight">msg.sender (address)</span>: sender of
              the message (current call)
            </li>
            <li>
              <span className="highlight">msg.sig (bytes4)</span>: first four
              bytes of the calldata (i.e. function identifier)
            </li>
            <li>
              <span className="highlight">msg.value (uint)</span>: number of wei
              sent with the message
            </li>
            <li>
              <span className="highlight">tx.gasprice (uint)</span>: gas price
              of the transaction
            </li>
            <li>
              <span className="highlight">tx.origin (address)</span>: sender of
              the transaction (full call chain)
            </li>
          </ul>
        </div>
        <div className="subSection_content">
          <h5>Error handling</h5>
          <hr />
          <ul>
            <li>
              <span className="highlight">assert(bool condition)</span>: causes
              a Panic error and thus state change reversion if the condition is
              not met - to be used for internal errors.
            </li>
            <li>
              <span className="highlight">require(bool condition)</span>:
              reverts if the condition is not met - to be used for errors in
              inputs or external components.
            </li>
            <li>
              <span className="highlight">
                require(bool condition, string memory message)
              </span>{" "}
              : reverts if the condition is not met - to be used for errors in
              inputs or external components. Also provides an error message.
            </li>
            <li>
              <span className="highlight">revert()</span>: abort execution and
              revert state changes
            </li>
            <li>
              <span className="highlight">revert(string memory reason)</span> :
              abort execution and revert state changes, providing an explanatory
              string
            </li>
          </ul>
        </div>
        <div className="subSection_content">
          <h5>Members of Address Types</h5>
          <hr />
          <ul>
            <li>
              <span className="highlight">{`<address>.balance (uint256)`}</span>
              : balance of the Address in Wei
            </li>
            <li>
              <span className="highlight">{`<address>.code (bytes memory)`}</span>
              : code at the Address (can be empty)
            </li>
            <li>
              <span className="highlight">{`<address>.codehash (bytes32)`}</span>
              : the codehash of the Address
            </li>
            <li>
              <span className="highlight">{`<address payable>.transfer(uint256 amount)`}</span>
              : send given amount of Wei to Address, reverts on failure,
              forwards 2300 gas stipend, not adjustable
            </li>
            <li>
              <span className="highlight">{`<address payable>.send(uint256 amount) returns (bool)`}</span>
              : send given amount of Wei to Address, returns false on failure,
              forwards 2300 gas stipend, not adjustable
            </li>
            <li>
              <span className="highlight">{`<address>.call(bytes memory) returns (bool, bytes memory)`}</span>
              : issue low-level CALL with the given payload, returns success
              condition and return data, forwards all available gas, adjustable
            </li>
            <li>
              <span className="highlight">{`<address>.delegatecall(bytes memory) returns (bool, bytes memory)`}</span>
              : issue low-level DELEGATECALL with the given payload, returns
              success condition and return data, forwards all available gas,
              adjustable
            </li>
            <li>
              <span className="highlight">{`<address>.staticcall(bytes memory) returns (bool, bytes memory)`}</span>
              : issue low-level STATICCALL with the given payload, returns
              success condition and return data, forwards all available gas,
              adjustable
            </li>
          </ul>
        </div>
        <div className="subSection_content">
          <h5>Contract-related keywords</h5>
          <hr />
          <ul>
            <li>
              <span className="highlight">this</span>: The current contract,
              explicitly convertible to Address
            </li>
            <li>
              <span className="highlight">super</span>: A contract one level
              higher in the inheritance hierarchy
            </li>
            <li>
              <span className="highlight">
                selfdestruct(address payable recipient)
              </span>
              : Destroy the current contract, sending its funds to the given
              Address and end execution. Note that selfdestruct has some
              peculiarities inherited from the EVM:
              <ul>
                <li>
                  the receiving contract’s receive function is not executed.
                </li>
                <li>
                  the contract is only really destroyed at the end of the
                  transaction and revert s might “undo” the destruction.
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div id="advanced-4-3" className="subSection">
        <h4>4.3.Expression and Control Structures</h4>
        <hr />
        <div className="subSection_content">
          <h5>Supported keywords</h5>
          <hr />
          <p>
            There is: <span className="highlight"></span>,{" "}
            <span className="highlight">if</span>,{" "}
            <span className="highlight">else</span>,{" "}
            <span className="highlight">while</span>,{" "}
            <span className="highlight">do</span>,{" "}
            <span className="highlight">for</span>,{" "}
            <span className="highlight">break</span>,{" "}
            <span className="highlight">continue</span>,{" "}
            <span className="highlight">return</span>,{" "}
            <span className="highlight">try</span>/
            <span className="highlight"></span> with the usual semantics known
            from C or JavaScript.
          </p>
        </div>
        <div className="subSection_content">
          <h5>Function Calls</h5>
          <hr />
          <p>
            We can call <span className="highlight">function</span> of 1{" "}
            <span className="highlight">contract</span> from another{" "}
            <span className="highlight">contract</span>. We have an example
            below with 2 contracts <span className="highlight">Caller</span> and{" "}
            <span className="highlight">Callee</span>;
          </p>
          <pre>
            <code>
              {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Callee {
    uint public x;
    uint public value;

    function setX(uint _x) public returns (uint) {
        x = _x;
        return x;
    }

    function setXandSendEther(uint _x) public payable returns (uint, uint) {
        x = _x;
        value = msg.value;

        return (x, value);
    }
}

contract Caller {
    function setX(Callee _callee, uint _x) public {
        uint x = _callee.setX(_x);
    }

    function setXFromAddress(address _addr, uint _x) public {
        Callee callee = Callee(_addr);
        callee.setX(_x);
    }

    function setXandSendEther(Callee _callee, uint _x) public payable {
        (uint x, uint value) = _callee.setXandSendEther{value: msg.value}(_x);
    }
}`}
            </code>
          </pre>
        </div>
        <div className="subSection_content">
          <h5>
            Create new contract with keyword{" "}
            <span className="highlight">new</span>
          </h5>
          <hr />
          <p>
            We can use keyword <span className="highlight">new</span> to create
            a new contract.{" "}
            <span className="highlight">AdvancedStorage.sol</span> example will
            explain this in more details.
          </p>
        </div>
      </div>
      <div id="advanced-4-4" className="subSection">
        <h4>4.5. AdvancedStorage.sol</h4>
        <hr />
        <pre>
          <code>{`// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

contract AdvancedStorage {
    // Declare the address of a vault manager
    address public vaultManager;

    // Declare an error type for unauthorized access
    error OwnableUnauthorizedAccount(address account);

    // Constructor is a function that runs when the contract is initialized
    constructor() {
        // Assign the address of the deployer to the vault manager variable
        vaultManager = msg.sender;
    }

    // Declare the InvestmentVault Struct data type
    struct InvestmentVault {
        uint256 investmentDuration; // Thời gian đầu tư
        int256 returnOnInvestment; // % lãi suất trả về
        bool initialized; // Đã khởi tạo
        address identityCard; // Địa chỉ thẻ thông tin
    }
    // Declare a variable with the InvestmentVault type
    InvestmentVault private investmentVault;

    // This function initializes the investment vault
    function setInitialInvestmentVault(uint256 daysAfter, int256 _returnOnInvestment, address _vaultOwner) public {
        // We check if the initiator is the vaultManager
        if (msg.sender != vaultManager) {
            // This reverts all actions and reverts the transaction
            revert OwnableUnauthorizedAccount(msg.sender);
        }
        // Declare the investment duration
        uint256 _investmentDuration = block.timestamp + daysAfter * 1 days;

        // Create a new identity card for the customer
        CustomerIdentityCard customerIdentityCard = new CustomerIdentityCard(_vaultOwner);
        // Assign the address of the vault owner/customer to the mapping with the vault information
        investmentVault = InvestmentVault({investmentDuration: _investmentDuration, returnOnInvestment: _returnOnInvestment, initialized: true, identityCard: address(customerIdentityCard)});
    }

    // Function to change the return on investment
    function editReturnOnInvestment(int256 _newReturnOnInvestment) public {
        // require keyword works similarly to if and revert above
        require (msg.sender == vaultManager, "Unauthorized Manager");
        // Change the value of the interest rate
        investmentVault.returnOnInvestment = _newReturnOnInvestment;
    }

    // Function to return investmentVault information
    function retrieveInvestmentVault() public view returns (InvestmentVault memory _investmentVault) {
        return investmentVault;
    }

    // Function to return the address of the IdentityCard
    function retrieveCustomerInformation() public view returns (address) {
        return CustomerIdentityCard(investmentVault.identityCard).customer();
    }
}

// Contract that stores the address of the vault owner
contract CustomerIdentityCard {
    //  declares a variable to store the address of the customer
    address public customer;

    // initialize the contract and assign the address of the customer
    constructor(address _customer) {
        customer = _customer;
    }
}`}</code>
        </pre>
      </div>
    </div>
  );
}
