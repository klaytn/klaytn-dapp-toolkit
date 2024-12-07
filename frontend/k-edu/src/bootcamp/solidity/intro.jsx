import React from "react";

export default function Intro() {
    return (
      <div>
        <header>
          <h2>1-Intro</h2>
        </header>
        <div id="intro-1-1" className="subSection">
          <h4>1.1. BlockChain</h4>
          <hr />
          <h5>Blockchain and Klaytn Overview</h5>
          <hr />
          <div className="subSection_content">
            <h6>What is Blockchain</h6>
            <hr />
            <p>
              Blockchain is a distributed and immutable digital ledger that
              records all transactions that occur on a network. Each block in
              the chain contains an encrypted number of transactions, and when a
              new block is created, it is intimately linked to the previous
              block, forming a continuous chain that cannot be altered without
              detection. . This ensures high transparency and security, as
              information cannot be easily altered or deleted without network
              consensus, making blockchain a foundational technology for
              applications such as money. electronics and smart contracts.
            </p>
          </div>
          <div className="subSection_content">
            <h6>Klaytn Consensus</h6>
            <hr />
            <p>
              Consensus mechanism: Klaytn uses the Istanbul BFT algorithm, an
              improved version of PBFT (Practical Byzantine Fault Tolerance)
              optimized for blockchain networks.
            </p>
            <h6>Target:</h6>
            <ul>
              <li>Ability to process 4,000 transactions per second.</li>
              <li>Ability to complete transactions instantly.</li>
              <li>Block creation time 1 second.</li>
              <li>
                Supports more than 50 consensus nodes participating in the
                process.
              </li>
            </ul>
            <h6>Node type:</h6>
            <ul>
              <li>
                CN (Consensus Node): Managed by CCO (Core Cell Operator) and
                responsible for creating blocks.
              </li>
              <li>PN (Proxy Node): Provides interface to the network.</li>
              <li>EN (Endpoint Node): Provides services to end users.</li>
            </ul>
            <h6>Consensus process:</h6>
            <p>
              When a transaction is sent to the CN (Council) from the PNs, the
              VRF (Verifiable Random Function) function is used to randomly
              select 1 Committee consisting of 4 CNs. 1 CN will continue to be
              randomly selected to create a block along with the observations of
              3 other CNs. When a block is created, 2/3 of the CNs in the
              Council will have to sign the block to reach consensus.
            </p>
          </div>
          <div className="subSection_content">
            <h6>KLVM</h6>
            <hr />
            <p>
              <span className="highlight">KLVM</span>, short for{" "}
              <span className="highlight">Klaytn Virtual Machine</span>, is a
              decentralized virtual machine environment running on the Klaytn
              blockchain network. <span className="highlight">KLVM</span>{" "}
              enables the execution of smart contracts, which are programs that
              automatically execute transactions or specific actions based on
              pre-coded conditions. Smart contracts are written in programming
              languages ​​such as Solidity, then compiled into
              {` `}
              <span className="highlight">bytecode</span> that{" "}
              <span className="highlight">KLVM</span> can understand and
              execute. <span className="highlight">KLVM</span> is compatible
              with Ethereum's <span className="highlight">EVM</span>, so it
              fully supports current development tools,{" "}
              <span className="highlight">opcode</span>, and source code.
            </p>
          </div>
          <div className="subSection_content">
            <h6>What is smart contract?</h6>
            <hr />
            <p>
              A <span className="highlight">smart contract</span> is a type of
              computer program designed to automatically execute, control, or
              confirm events and actions according to pre-programmed terms. They
              exist and operate on <span className="highlight">Klaytn</span>,
              ensuring high transparency and security as they cannot be modified
              once deployed. <span className="highlight">Smart contract</span>{" "}
              help automate processes, reduce the need for intermediaries and
              minimize the risk of fraud or errors. They are versatile and can
              be used in a variety of fields, from finance and insurance to
              supply chain management and real estate. The development of{` `}
              <span className="highlight">smart contract</span> is ushering in a
              new era in the way we interact and conduct digital transactions,
              bringing greater efficiency, transparency and autonomy to users.
            </p>
          </div>
          <div className="subSection_content">
            <h6>Transaction and how to sign a Transaction</h6>
            <hr />
            <p>
              In the Klaytn network, a "transaction" or transaction is an action
              performed by a user to transfer KLAY (Klaytn native token) or
              Klaytn-based tokens from one address to another, or to interact
              with contracts. smart contract. Each transaction includes
              information such as source address, destination address, amount of
              money transferred, gas (transaction fee), and optional data if the
              transaction interacts with a smart contract.
            </p>
            <p>
              When making transactions on Klaytn, signing the transaction using
              a crypto wallet like MetaMask is an important step to ensure
              safety and security. Specifically, this process takes place as
              follows:
            </p>
            <ol>
              <li>
                Create Transaction: User enters necessary information for the
                transaction such as receiving address, amount of KLAY or tokens
                to transfer, and gas. In MetaMask, for example, users can adjust
                gas levels so transactions are processed faster.
              </li>
              <li>
                Transaction Signing: Once the transaction information is
                entered, the wallet generates a digital transaction signed with
                the user's private key. Signing this transaction proves that the
                user has the right to use the address from which the transaction
                was sent without revealing their private key.
              </li>
              <li>
                Sending Transaction: The signed transaction is then sent to the
                Klaytn network via a wallet such as Kaikas or MetaMask. The
                network will confirm the transaction and execute it, transfer
                funds or interact with the smart contract as requested.
              </li>
              <li>
                Transaction Confirmation: Finally, the transaction will be
                confirmed by the network, and information about it will be
                recorded on the blockchain. Users can track the status of
                transactions through online tools such as Etherscan.
              </li>
            </ol>
            <p>
              This process not only helps ensure transactions are carried out
              securely, but also helps prevent tampering or unauthorized
              alteration of transactions, thanks to the transparency and
              immutability of the blockchain.
            </p>
          </div>
        </div>
        <div id="intro-1-2" className="subSection">
          <h4>1.2. Structure of a Solidity file</h4>
          <hr />
          <div className="subSection_content">
            <h5>SPDX License Identifier</h5>
            <hr />
            <p>
              All solidity contracts should have License declaration in the
              first line.
            </p>
            <pre>
              <code>
                {`All solidity contracts should have License declaration in the first line.`}
              </code>
            </pre>
            <p>
              List of licenses from SPDX repository:{" "}
              <a href="https://spdx.org/licenses/">
                https://spdx.org/licenses/
              </a>
            </p>
          </div>
          <div className="subSection_content">
            <h5>Pragmas</h5>
            <hr />
            <p>
              <span className="highlight">pragma</span> is the keyword used to
              declare the compiler version of Solidity.{" "}
              <span className="highlight">pragma</span> only applies to the
              current local file so you must add{" "}
              <span className="highlight">pragma</span> to all files in the
              project directory.
            </p>
            <pre>
              <code>
                {`// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;`}
              </code>
            </pre>
            <p>
              You can use the <span className="highlight">{`^`}</span> sign or
              the comparison operators <span className="highlight">{`<`}</span>,{" "}
              <span className="highlight">{`<=`}</span>,{" "}
              <span className="highlight">{`>`}</span>,{" "}
              <span className="highlight">{`>=`}</span> in conjunction with the
              compiler declaration.
            </p>
            <pre>
              <code>{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20; // use compiler version 0.8.20 and above`}</code>
            </pre>
            <pre>
              <code>{`// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0; // use compiler version bigger or equal to 0.4.22 and less than 0.9.0`}</code>
            </pre>
          </div>
          <div className="subSection_content">
            <h5>Import file from other sources</h5>
            <hr />
            <h6>Import the whole file</h6>
            <pre>
              <code>{`import "FileName"`}</code>
            </pre>
            <h6>Import all and assign alias</h6>
            <pre>
              <code>{`import * as symbolName from "FileName";`}</code>
            </pre>
            <h6>Name import</h6>
            <p>
              <span className="highlight">Name import</span> means you will
              specify the name of the import object from another file. The
              reason you should use this option is that it makes your code
              clearer.
            </p>
            <pre>
              <code>
                {`import {ContractOne as alias, ContractTwo} from "FileName";`}
              </code>
            </pre>
          </div>
          <div className="subSection_content">
            <h5>Comment</h5>
            <hr />
            <p>
              To comment, you can use <span className="highlight">{`//`}</span>{" "}
              and <span className="highlight">{`/* */`}</span>
            </p>
            <pre>
              <code>
                {`// comment for 1 line.

/*
Comment for
multiple lines
*/`}
              </code>
            </pre>
            <p>
              There is also{" "}
              <a href="https://docs.soliditylang.org/en/v0.8.24/natspec-format.html#natspec">
                NatSpec
              </a>{" "}
              comment with <span className="highlight">{`///`}</span> or{" "}
              <span className="highlight">{`/** **/`}</span>
            </p>
            <pre>
              <code>{`// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

/// @author The Project Team
/// @title A simple storage example
contract SimpleStorage {
    uint storedData;

    /// Store \`x\`.
    /// @param x the new value to store
    /// @dev stores the number in the state variable \`storedData\`
    function set(uint x) public {
        storedData = x;
    }

    /// Return the stored value.
    /// @dev retrieves the value of the state variable \`storedData\`
    /// @return the stored value
    function get() public view returns (uint) {
        return storedData;
    }
}`}</code>
            </pre>
          </div>
        </div>
        <div id="intro-1-3" className="subSection">
          <h4>1.3. Contract Structure</h4>
          <hr />
          <div className="subSection_content">
            <h6>State variables</h6>
            <hr />
            <p>
              <span className="highlight">State variables</span> are variables
              declared at the beginning of the contract, outside the scope of{" "}
              <span className="highlight">local variables</span> declared in{" "}
              <span className="highlight">function</span>.
            </p>
            <pre>
              <code>
                {`// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.0 <0.9.0;

contract SimpleStorage {
    uint storedData; // State variable
    // ...
}`}
              </code>
            </pre>
          </div>
          <div className="subSection_content">
            <h6>Functions</h6>
            <hr />
            <p>
              <span className="highlight">Function</span> are functions declared
              to perform calculations, change the value of variables, etc. A
              sample <span className="highlight">function</span> is given below.
            </p>
            <pre>
              <code>
                {`// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.1 <0.9.0;

contract SimpleAuction {
    function bid() public payable { // Function
        // ...
    }
}

// Helper function defined outside of a contract
function helper(uint x) pure returns (uint) {
    return x * 2;
}`}
              </code>
            </pre>
          </div>
          <div className="subSection_content">
            <h6>Function modifiers</h6>
            <hr />
            <p>
              <span className="highlight">Function modifier</span> are
              declarations for <span className="highlight">function</span> to
              create conditions for running actions of that{" "}
              <span className="highlight">function</span>.
            </p>
            <pre>
              <code>{`// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

contract Purchase {
    address public seller;

    modifier onlySeller() { // Modifier
        require(
            msg.sender == seller,
            "Only seller can call this."
        );
        _;
    }

    function abort() public view onlySeller { // Modifier usage
        // ...
    }
}`}</code>
            </pre>
          </div>
          <div className="subSection_content">
            <h6>Events</h6>
            <hr />
            <p>
              <span className="highlight">event</span> is a feature for
              recording smart contract activities.
              <span className="highlight">event</span> is often used in building
              interactive UI with smart contracts.
            </p>
            <pre>
              <code>
                {`// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.22;

event HighestBidIncreased(address bidder, uint amount); // Event

contract SimpleAuction {
    function bid() public payable {
        // ...
        emit HighestBidIncreased(msg.sender, msg.value); // Triggering event
    }
}`}
              </code>
            </pre>
          </div>
          <div className="subSection_content">
            <h6>Errors</h6>
            <hr />
            <p>
              <span className="highlight">error</span> is used to inform the
              user why the action failed, and{" "}
              <span className="highlight">error</span> has a lower{" "}
              <span className="highlight">gas</span>
              cost than returning <span className="highlight">string</span>.
            </p>
            <pre>
              <code>
                {`// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

/// Not enough funds for transfer. Requested \`requested\`,
/// but only \`available\` available.
error NotEnoughFunds(uint requested, uint available);

contract Token {
    mapping(address => uint) balances;
    function transfer(address to, uint amount) public {
        uint balance = balances[msg.sender];
        if (balance < amount)
            revert NotEnoughFunds(amount, balance);
        balances[msg.sender] -= amount;
        balances[to] += amount;
        // ...
    }
}`}
              </code>
            </pre>
          </div>
          <div className="subSection_content">
            <h6>Struct types</h6>
            <hr />
            <p>
              <span className="highlight">struct</span> is used to declare a{" "}
              <span className="highlight">type</span> of{" "}
              <span className="highligh">object</span>.
            </p>
            <pre>
              <code>
                {`// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.0 <0.9.0;

contract Ballot {
    struct Voter { // Struct
        uint weight;
        bool voted;
        address delegate;
        uint vote;
    }
}`}
              </code>
            </pre>
          </div>
          <div className="subSection_content">
            <h6>Enum types</h6>
            <hr />
            <p>
              <span className="highlight">enum</span> is used to declare a{" "}
              <span className="highlight">type</span> whose values ​​are{" "}
              <span className="highlight">constant</span>.
            </p>
            <pre>
              <code>
                {`// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.0 <0.9.0;

contract Purchase {
    enum State { Created, Locked, Inactive } // Enum
}`}
              </code>
            </pre>
          </div>
        </div>
      </div>
    );
}