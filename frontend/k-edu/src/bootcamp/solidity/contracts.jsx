import React from "react";

export default function Contracts() {
  return (
    <div>
      <header>
        <h2>5-Contracts</h2>
      </header>
      <div id="contracts-5-1a" className="subSection">
        <h4>5.1a. Tests</h4>
        <hr />
        <div className="subSection_content">
          <h6>Test</h6>
          <hr />
          <p>
            Thorough testing of Solidity files plays an important role in
            ensuring the quality, reliability, and security of your blockchain
            project.
          </p>
          <p>Here are some main reasons:</p>
          <ul>
            <li>
              Error detection: Testing helps you identify and fix errors in your
              Solidity code. Code errors can lead to unwanted behavior and even
              loss of assets. Testing helps you detect these errors early and
              fix them before they cause serious problems.
            </li>
            <li>
              Ensure security: Testing helps you identify security
              vulnerabilities in your Solidity code. Security vulnerabilities
              can leave your project vulnerable to hackers. Testing helps you
              identify these vulnerabilities and take measures to patch them.
            </li>
            <li>
              Increase reliability: Testing helps you increase the reliability
              of your blockchain project. When users know that your project has
              been thoroughly tested, they will have more trust in the project
              and be more likely to use it.
            </li>
            <li>
              Save time and money: Testing helps you save time and money in the
              long term. Fixing errors sooner will help you avoid more serious
              and costly problems later.
            </li>
          </ul>
          <p>
            There are many different testing methods that can be used to test
            Solidity files. Some popular methods include:
          </p>
          <ol>
            <li>
              Unit test: is a method of testing each individual unit of code.
            </li>
            <li>
              Integration test: is a method of testing how different units of
              code work together.
            </li>
            <li>
              Forked test: is a method of testing code in an environment that
              simulates the real environment.
            </li>
            <li>
              Staging test: is a method of testing code in a real environment
              but not in prod. Choosing the right testing method will depend on
              the specific needs of your project.
            </li>
          </ol>
          <p>Here are some tips for effectively testing Solidity files:</p>
          <ul>
            <li>Write test code that is easy to understand and maintain.</li>
            <li>Use many different testing methods.</li>
            <li>Automate testing.</li>
            <li>Consider using specialized testing tools.</li>
          </ul>
        </div>
        <div className="subSection_content">
          <h6>How to test?</h6>
          <hr />
          <p>
            Remix, or Hardhat, or Foundry have their own options for testing
            smart contracts. You can refer to the in-depth docs below:
          </p>
          <ul>
            <li>
              <a href="https://remix-ide.readthedocs.io/en/latest/unittesting.html">
                Remix test
              </a>
            </li>
            <li>
              <a href="https://hardhat.org/tutorial/testing-contracts">
                Hardhat test
              </a>
            </li>
            <li>
              <a href="https://book.getfoundry.sh/forge/writing-tests">
                Foundry forge test
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div id="contracts-5-1b" className="subSection">
        <h4>5.1b. Remix Idea Tests</h4>
        <hr />
        <div id="contracts-5-1b-1" className="subSection_content">
          <h6>AdvancedStorage.test.js</h6>
          <hr />
          <pre>
            <code>
              {`const { expect } = require("chai");
const { ethers } = require("ethers");

describe("AdvancedStorage", function () {
  
    it("Check vault manager", async function () {
        // Make sure contract is compiled and artifacts are generated
        const advancedStorageMetadata = JSON.parse(await remix.call('fileManager', 'getFile', 'artifacts/AdvancedStorage.json'))
        const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()
        const signerAddress = await signer.getAddress();
        let AdvancedStorage = new ethers.ContractFactory(advancedStorageMetadata.abi, advancedStorageMetadata.data.bytecode.object, signer);
        let advancedStorage = await AdvancedStorage.deploy();
        console.log('storage contract Address: ' + advancedStorage.address);
        await advancedStorage.deployed();
        expect((await advancedStorage.vaultManager()).toString()).to.equal(signerAddress);
    });

    it("Check set initial investment", async function () {
        const advancedStorageMetadata = JSON.parse(await remix.call('fileManager', 'getFile', 'artifacts/AdvancedStorage.json'));
        const customerIdentityCardMetadata = JSON.parse(await remix.call('fileManager', 'getFile', 'artifacts/CustomerIdentityCard.json'));
        const provider = new ethers.providers.Web3Provider(web3Provider)
        const signer = provider.getSigner();
        const acc2 = await provider.getSigner(1).getAddress();
        let AdvancedStorage = new ethers.ContractFactory(advancedStorageMetadata.abi, advancedStorageMetadata.data.bytecode.object, signer);
        let advancedStorage = await AdvancedStorage.deploy();
        console.log('storage contract Address: ' + advancedStorage.address);
        await advancedStorage.deployed();
        await advancedStorage.setInitialInvestmentVault(10, 5, acc2.toString());
        const customerIdentityCardAddress = (await advancedStorage.retrieveInvestmentVault())[3];
        const customerIdentityCard = new ethers.Contract(customerIdentityCardAddress, customerIdentityCardMetadata.abi, signer);
        expect((await advancedStorage.retrieveInvestmentVault())[1].toNumber()).to.equal(5);
        expect((await advancedStorage.retrieveInvestmentVault())[2]).to.equal(true);
        expect(customerIdentityCardAddress).to.equal(customerIdentityCard.address);
    });

    it("Check customer information", async function() {
        const advancedStorageMetadata = JSON.parse(await remix.call('fileManager', 'getFile', 'artifacts/AdvancedStorage.json'));
        const customerIdentityCardMetadata = JSON.parse(await remix.call('fileManager', 'getFile', 'artifacts/CustomerIdentityCard.json'));
        const provider = new ethers.providers.Web3Provider(web3Provider)
        const signer = provider.getSigner();
        const acc2 = await provider.getSigner(1).getAddress();
        let AdvancedStorage = new ethers.ContractFactory(advancedStorageMetadata.abi, advancedStorageMetadata.data.bytecode.object, signer);
        let advancedStorage = await AdvancedStorage.deploy();
        console.log('storage contract Address: ' + advancedStorage.address);
        await advancedStorage.deployed();
        await advancedStorage.setInitialInvestmentVault(10, 5, acc2.toString());
        const customerIdentityCardAddress = (await advancedStorage.retrieveInvestmentVault())[3];
        const customerIdentityCard = new ethers.Contract(customerIdentityCardAddress, customerIdentityCardMetadata.abi, signer);
        expect(await customerIdentityCard.customer()).to.equal(acc2);
    });
});`}
            </code>
          </pre>
        </div>
        <div id="contracts-5-1b-2" className="subSection_content">
          <h6>AdvancedStorage_test.sol</h6>
          <hr />
          <pre>
            <code>{`// SPDX-License-Identifier: GPL-3.0
        
pragma solidity >=0.4.22 <0.9.0;

// This import is automatically injected by Remix
import "remix_tests.sol"; 

// This import is required to use custom transaction context
// Although it may fail compilation in 'Solidity Compiler' plugin
// But it will work fine in 'Solidity Unit Testing' plugin
import "remix_accounts.sol";
import {AdvancedStorage, CustomerIdentityCard} from "../AdvancedStorage.sol";

// File name has to end with '_test.sol', this file can contain more than one testSuite contracts
contract testSuite is AdvancedStorage {

    AdvancedStorage advancedStorage;
    address acc0;
    address acc1;
    /// 'beforeAll' runs before all other tests
    /// More special functions are: 'beforeEach', 'beforeAll', 'afterEach' & 'afterAll'
    function beforeAll() public {
        // <instantiate contract>
        advancedStorage = new AdvancedStorage();
        acc0 = TestsAccounts.getAccount(0);
        acc1 = TestsAccounts.getAccount(1);
    }

    function checkVaultManager() public returns (bool) {
        return Assert.equal(this.vaultManager(), msg.sender, "Vault Manager is not correct");
    }

    function checkSettingInitialInvestment() public returns (bool, bool, bool) {
        setInitialInvestmentVault(
            10,
            5,
            acc1
        );
        return (
            Assert.equal(retrieveInvestmentVault().investmentDuration, block.timestamp + 10 days, "Duration is not correct"),
            Assert.equal(retrieveInvestmentVault().returnOnInvestment, 5, "Return on Investment is not correct"),
            Assert.equal(retrieveInvestmentVault().initialized, true, "Initialization status is not correct")
        );
    }

    /// #sender: account-1
    function checkFailedSettingInitialInvestmentButWithUnautorizedAccount() public returns (bool) {
        setInitialInvestmentVault(
            10,
            5,
            acc1
        );
        return (Assert.ok(true, "True"));
    }

    function checkRetrieveCustomerInformation() public returns (bool) {
        return Assert.equal(retrieveCustomerInformation(), acc1, "Customer information is wrong");
    }
}

    `}</code>
          </pre>
        </div>
        <div id="contracts-5-1b-3" className="subSection_content">
          <h6>SimpleStorage.sol</h6>
          <hr />
          <pre>
            <code>{`// SPDX-License-Identifier: GPL-3.0
        
pragma solidity >=0.4.22 <0.9.0;

// This import is automatically injected by Remix
import "remix_tests.sol"; 

// This import is required to use custom transaction context
// Although it may fail compilation in 'Solidity Compiler' plugin
// But it will work fine in 'Solidity Unit Testing' plugin
import "remix_accounts.sol";
import "../SimpleStorage.sol";

// File name has to end with '_test.sol', this file can contain more than one testSuite contracts
contract testSuite is SimpleStorage {
    
    SimpleStorage simpleStorage;
    address acc0;
    /// 'beforeAll' runs before all other tests
    /// More special functions are: 'beforeEach', 'beforeAll', 'afterEach' & 'afterAll'
    function beforeAll() public {
        // <instantiate contract>
        simpleStorage = new SimpleStorage();
        acc0 = TestsAccounts.getAccount(0);
    }

    function checkMaintainerName() public returns (bool) {
        return Assert.equal(simpleStorage.maintainerName(), "zxstim", "Maintainer name is not correct");
    }

    function checkVersion() public returns (bool) {
        return Assert.equal(simpleStorage.version(), 1, "Version is not 1");
    }

    function checkDonationAddress() public returns (bool) {
        return Assert.equal(simpleStorage.donationAddress(), 0xe3d25540BA6CED36a0ED5ce899b99B5963f43d3F, "Donation address is not correct");
    }

    /// #sender: account-0
    function checkStoredPerson() public returns (bool, bool, bool, bool, bool, bool) {
        Person memory person = storePerson("victor",30,true,10,2);
        return (
            Assert.equal(person.name, "victor", "Name is not correct"), 
            Assert.equal(person.age, 30, "Age is not correct"),
            Assert.equal(person.overEighteen, true, "overEighteen status is not correct"),
            Assert.equal(person.uuid, msg.sender, "Address is not correct"),
            Assert.equal(person.assetValue, 10e18, "Asset value is not correct"),
            Assert.equal(person.debtValue, 2e18, "Debt value is not correct")
            );
    }

    /// #sender: account-0
    function checkRetrivePersonWithAddress() public returns (bool, bool, bool, bool, bool, bool) {
        Assert.ok(msg.sender == acc0, "caller should be default account i.e. acc0");
        storePerson("victor",30,true,10,2);
        return (
            Assert.equal(retrievePerson(msg.sender).name, "victor", "Name is not correct"),
            Assert.equal(retrievePerson(msg.sender).age, 30, "Age is not correct"),
            Assert.equal(retrievePerson(msg.sender).overEighteen, true, "overEighteen status is not correct"),
            Assert.equal(retrievePerson(msg.sender).uuid, msg.sender, "Address is not correct"),
            Assert.equal(retrievePerson(msg.sender).assetValue, 10e18, "Asset value is not correct"),
            Assert.equal(retrievePerson(msg.sender).debtValue, 2e18, "Debt value is not correct")
            );
    }
}
    `}</code>
          </pre>
        </div>
      </div>
      <div id="contracts-5-2" className="subSection">
        <h4>5.2. More information about Contract in Solidity</h4>
        <hr />
        <div className="subSection_content">
          <h6>constructor</h6>
          <hr />
          <p>
            Constructor is a function that runs immediately when the smart
            contract is initialized
          </p>
          <pre>
            <code>{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Base contract X
contract X {
    string public name;

    constructor(string memory _name) {
        name = _name;
    }
}`}</code>
          </pre>
        </div>
        <div className="subSection_content">
          <h6>State variable visibility</h6>
          <hr />
          <ul>
            <li>
              <span className="highlight">public</span> - Public variables are
              similar to internal variables (allowing the current contract and
              inherited contracts to access) but will automatically create a{" "}
              <span className="highlight">getter function</span> so that
              external contracts can also access it.
            </li>
            <li>
              <span className="highlight">internal</span> - The variable can
              only be accessed by the current contract and inherited contracts.
              This is also the default visibility for state variable.
            </li>
            <li>
              <span className="highlight">private</span> - The variable can only
              be accessed by the current contract.
            </li>
          </ul>
          <p>
            <strong>Note:</strong> The{" "}
            <span className="highlight">internal</span> and{" "}
            <span className="highlight">private</span>
            variables only restrict access to other{" "}
            <span className="highlight">contracts</span>. The value of the
            variable remains visible to everyone.
          </p>
        </div>
        <div className="subSection_content">
          <h6>Function visibility</h6>
          <hr />
          <ul>
            <li>
              <span className="highlight">external</span> -{" "}
              <span className="highlight">function</span> that can only be
              called from outside.
            </li>
            <li>
              <span className="highlight">public</span> -{" "}
              <span className="highlight">function</span> can both be called by
              another <span className="highlight">function</span> in{" "}
              <span className="highlight">contract</span>, and can also be
              called from outside.
            </li>
            <li>
              <span className="highlight">internal</span> -{" "}
              <span className="highlight">function</span> can only be called by
              an existing <span className="highlight">contract</span> or an
              inherited <span className="highlight">contract</span>.
            </li>
            <li>
              <span className="highlight">private</span> -{" "}
              <span className="highlight">function</span> can only be called by
              the current <span className="highlight">contract</span>.
            </li>
          </ul>
        </div>
        <div className="subSection_content">
          <h6>Getter function</h6>
          <hr />
          <p>
            <span className="highlight">function</span> is used to call the{" "}
            <span className="highlight">public</span> variable that the compiler
            automatically creates. Also used to refer to the concept of{" "}
            <span className="highlight">function</span> used to query variables
            to view.
          </p>
          <pre>
            <code>
              {`// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

contract C {
    uint public data = 42;
}

contract Caller {
    C c = new C();
    function f() public view returns (uint) {
        return c.data();
    }
}`}
            </code>
          </pre>
        </div>
        <div className="subSection_content">
          <ul>
            <li>
              <span className="highlight">constant</span> - variables whose
              values ​​are fixed immediately upon compilation (put into contract
              bytecode).
            </li>
            <li>
              <span className="highlight">immutable</span> - variables whose
              values ​​can be assigned during{" "}
              <span className="highlight">construct</span>.
            </li>
          </ul>
          <pre>
            <code>
              {`// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.21;

uint constant X = 32**22 + 8;

contract C {
    string constant TEXT = "abc";
    bytes32 constant MY_HASH = keccak256("abc");
    uint immutable decimals = 18;
    uint immutable maxBalance;
    address immutable owner = msg.sender;

    constructor(uint decimals_, address ref) {
        if (decimals_ != 0)
            // Immutables are only immutable when deployed.
            // At construction time they can be assigned to any number of times.
            decimals = decimals_;

        // Assignments to immutables can even access the environment.
        maxBalance = ref.balance;
    }

    function isBalanceTooHigh(address other) public view returns (bool) {
        return other.balance > maxBalance;
    }
}`}
            </code>
          </pre>
        </div>
        <div className="subSection_content">
          <h6>Pure fucntion</h6>
          <hr />
          <p>
            <span className="highlight">function</span> does not read or change
            the state of the blockchain. Or used as a calculation{" "}
            <span className="highlight">function</span>.
          </p>
          <pre>
            <code>
              {`// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.9.0;

contract C {
    function f(uint a, uint b) public pure returns (uint) {
        return a * (b + 42);
    }
}`}
            </code>
          </pre>
        </div>
        <div className="subSection_content">
          <h6>Payable functions and addresses</h6>
          <hr />
          <pre>
            <code>
              {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Payable {
    // Payable address can send Ether via transfer or send
    address payable public owner;

    // Payable constructor can receive Ether
    constructor() payable {
        owner = payable(msg.sender);
    }

    // Function to deposit Ether into this contract.
    // Call this function along with some Ether.
    // The balance of this contract will be automatically updated.
    function deposit() public payable {}

    // Call this function along with some Ether.
    // The function will throw an error since this function is not payable.
    function notPayable() public {}

    // Function to withdraw all Ether from this contract.
    function withdraw() public {
        // get the amount of Ether stored in this contract
        uint256 amount = address(this).balance;

        // send all Ether to owner
        (bool success,) = owner.call{value: amount}("");
        require(success, "Failed to send Ether");
    }

    // Function to transfer Ether from this contract to address from input
    function transfer(address payable _to, uint256 _amount) public {
        // Note that "to" is declared as payable
        (bool success,) = _to.call{value: _amount}("");
        require(success, "Failed to send Ether");
    }
}`}
            </code>
          </pre>
        </div>
        <div className="subSection_content">
          <h6>Receive Ether and Fallback function</h6>
          <hr />
          <p>
            A <span className="highlight">contract</span> can have at most one{" "}
            <span className="highlight">receive</span> function, declared using{" "}
            <span className="highlight">
              receive() external payable {` ... `}
            </span>{" "}
            {`(without the`} <span className="highlight">function</span>{" "}
            {`keyword}`}. This <span className="highlight">function</span> must
            have no <span className="highlight">arguments</span> , cannot{" "}
            <span className="highlight">return</span> anything and must have{" "}
            <span className="highlight">external</span> visibility as well as{" "}
            <span className="highlight">payable</span>{" "}
            <span className="highlight">state mutability</span>. It can be{" "}
            <span className="highlight">virtual</span>, it can be{" "}
            <span className="highlight">override</span> and it can have{" "}
            <span className="highlight">modifiers</span>.
          </p>
          <pre>
            <code>
              {`    Which function is called, fallback() or receive()?

           send Ether
               |
         msg.data is empty?
              / \
            yes  no
            /     \
receive() exists?  fallback()
         /   \
        yes   no
        /      \
    receive()   fallback()`}
            </code>
          </pre>
          <pre>
            <code>
              {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Fallback {
    event Log(string func, uint256 gas);

    // Fallback function must be declared as external.
    fallback() external payable {
        // send / transfer (forwards 2300 gas to this fallback function)
        // call (forwards all of the gas)
        emit Log("fallback", gasleft());
    }

    // Receive is a variant of fallback that is triggered when msg.data is empty
    receive() external payable {
        emit Log("receive", gasleft());
    }

    // Helper function to check the balance of this contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

contract SendToFallback {
    function transferToFallback(address payable _to) public payable {
        _to.transfer(msg.value);
    }

    function callFallback(address payable _to) public payable {
        (bool sent,) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }
}`}
            </code>
          </pre>
        </div>
        <div className="subSection_content">
          <h6>Oracle</h6>
          <hr />
          <p>
            Oracle for smart contracts is a bridge between blockchain and the
            outside world. It provides data to smart contracts from sources
            outside the blockchain, such as APIs, market data, weather data,
            etc.
          </p>
          <p>
            Here are some examples of how to use oracle for smart contracts:
          </p>
          <ul>
            <li>
              Providing price data for decentralized markets (DeFi): Oracle can
              provide price data for crypto assets, allowing traders to make
              trades on decentralized exchanges.
            </li>
            <li>
              Activate insurance contracts: Oracle can provide data about
              insurance events, such as accidents or natural disasters, to
              trigger insurance payments.
            </li>
            <li>
              Automate processes: Oracle can be used to automate processes, such
              as bill payment or supply chain management.
            </li>
          </ul>
          <p>
            List of Oracles on Klaytn:{" "}
            <a href="https://klaytn.foundation/ecosystem/?search=&cate=oracles-bridges&sort=abc">
              https://klaytn.foundation/ecosystem/?search=&cate=oracles-bridges&sort=abc
            </a>
          </p>
        </div>
      </div>
      <div id="contracts-5-3" className="subSection">
        <h4>5.3. Foundry FundMe</h4>
        <hr />
        <div className="subSection_content">
          <h5>Framework Foundry</h5>
          <hr />
          <p>
            In fact, Remix IDE has many limitations in terms of features, so we
            will use Foundry, a framework to develop, test and deploy smart
            contracts.
          </p>
        </div>
        <div className="subSection_content">
          <h6>Installation</h6>
          <hr />
          <p>
            Visit the website <a href="https://getfoundry.sh/">GetFoundry.sh</a>{" "}
            and follow the instructions
          </p>
        </div>
        <div className="subSection_content">
          <h6>Getting started</h6>
          <hr />
          <p>
            Access and follow the instructions in{" "}
            <a href="https://book.getfoundry.sh/getting-started/first-steps">
              Foundry Book
            </a>{" "}
            to initialize the project
          </p>
        </div>
        <div className="subSection_content">
          <h6>Fund Me project</h6>
          <hr />
          <p>
            This exercise is based on Patrick Collins's{" "}
            <a href="https://github.com/Cyfrin/foundry-fund-me-f23">
              Foundry FundMe
            </a>{" "}
            epo but has been updated to fit Klaytn's environment.
          </p>
          <ol>
            <li>
              First run{" "}
              <span className="highlight">forge init klaytn-fund-me</span>
            </li>
            <li>
              We will then create the{" "}
              <span className="highlight">FundMe.sol</span> file
            </li>
            <pre>
              <code>
                {`// FundMe.sol
// SPDX-License-Identifier: MIT
// 1. Pragma
pragma solidity ^0.8.19;
// 2. Imports
// We import the orakl library so we can interact with oracle
import { IAggregator } from "@bisonai/orakl-contracts/src/v0.1/interfaces/IAggregator.sol";

// We import the PriceConverter library so we can calculate the KLAY value
import { PriceConverter } from "./PriceConverter.sol";

// 3. Interfaces, Libraries, Contracts
// Declaring error is not the Owner of the contract
error FundMe__NotOwner();

/**
 * @title A sample Funding Contract
 * @author Patrick Collins
 * @notice This contract is for creating a sample funding contract
 * @dev This implements price feeds as our library
 */
contract FundMe {
    // Type Declarations
    // The next line means
    // use the PriceConverter library for variables with type uint256
    using PriceConverter for uint256;

    // State variables
    // Declare a public constant MINIMUM_USD with value $5 but equal to peb so must multiply by 10^18
    uint256 public constant MINIMUM_USD = 5 * 10 ** 18;
    // Declare a private and immutable address with the name i_owner, i means immutable.
    address private immutable i_owner;
    // Declare a private array containing a list of people who fund ether with the name s_funders, s means storage.
    address[] private s_funders;
    // Declare a mapping between address and private uint256 linking the address with the fund amount.
    mapping(address => uint256) private s_addressToAmountFunded;
    // Declare contract AggregatorV3Interface private and assign it to the variable s_pricefeed, s means storage
    IAggregator private s_priceFeed;

    // Events (we have none!)

    // Modifiers
    // Declare an onlyOwner modifier to assign to a function that only the owner can call
    modifier onlyOwner() {
        // require(msg.sender == i_owner);
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    // Functions Order:
    //// constructor
    //// receive
    //// fallback
    //// external
    //// public
    //// internal
    //// private
    //// view / pure

    // Declaring a constructor with an address for priceFeed implies that this is the address of the Oracle contract with IAggregator
    constructor(address priceFeed) {
        // Input the address into the interface and assign it to the variable s_priceFeed
        s_priceFeed = IAggregator(priceFeed);
        // Assign the variable i_owner to msg.sender (the person who deploys this contract)
        i_owner = msg.sender;
    }

    /// @notice Funds our contract based on the KLAY/USDT price from Orakl
       // Deposit to our contract based on ETH/USD price
    function fund() public payable {
        require(msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD, "You need to spend more ETH!");
        // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
        // Then map the sender's address with msg.value in mapping s_addressToAmountFunded
        s_addressToAmountFunded[msg.sender] += msg.value;
        // Then add the sender address to the list of funders
        s_funders.push(msg.sender);
    }

    function withdraw() public onlyOwner {
        // Use for loop, starting from index 0 to index less than the length of the list, and index plus 1 for each loop
        for (uint256 funderIndex = 0; funderIndex < s_funders.length; funderIndex++) {
            // assign the address value at funderIndex in the s_funders list to the funder address
            address funder = s_funders[funderIndex];
            // Change the value of mapping s_addressToAmountFunded whose address is funder to 0, meaning this funder has withdrawn
            s_addressToAmountFunded[funder] = 0;
        }
        // Create a new s_funders list with a new dynamic array (literally a list) of size 0
        s_funders = new address[](0);
        // Transfer vs call vs Send
        // Transfer vs call vs Send
        // - transfer (2300 gas, throws error if any)
        // - send (2300 gas, returns bool for success or failure)
        // - call (forward all gas or set gas, returns bool for success or failure)
        // payable(msg.sender).transfer(address(this).balance);

        // Send the entire balance of this contract to i_owner with no data in the transaction and return boolean success or not
        (bool success,) = i_owner.call{value: address(this).balance}("");
        // Require bool success true otherwise revert completely       
        require(success);
    }

    function cheaperWithdraw() public onlyOwner {
        // Copy the list of s_funders from storage to memory, that is, load from global state to local state. Changing global state consumes more gas than local state
        address[] memory funders = s_funders;
        // mappings can't be in memory, sorry!
        for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        // payable(msg.sender).transfer(address(this).balance);
        (bool success,) = i_owner.call{value: address(this).balance}("");
        require(success);
    }

    /** Getter Functions */
    // Functions are only used to GET information
    /**
     * @notice Gets the amount that an address has funded
     *  @param fundingAddress the address of the funder
     *  @return the amount funded
     */
    function getAddressToAmountFunded(address fundingAddress) public view returns (uint256) {
        return s_addressToAmountFunded[fundingAddress];
    }

    /**
     * @notice Gets the funder at a specific index
     * @param index the index of the funder
     * @return the address of the funder
     */
    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    /// @notice Gets the owner of the contract
    function getOwner() public view returns (address) {
        return i_owner;
    }

    /// @notice Gets the price feed
    function getPriceFeed() public view returns (IAggregator) {
        return s_priceFeed;
    }

    /// @notice Gets the decimals of the price feed
    function getDecimals() public view returns (uint8) {
        return s_priceFeed.decimals();
    }

    /// @notice Gets the description of the price feed
    function getDescription() public view returns (string memory) {
        return s_priceFeed.description();
    }
}`}
              </code>
            </pre>
            <li>
              We continue to create the{" "}
              <span className="highlight">PriceConverter.sol</span> file
            </li>
            <pre>
              <code>{`// PriceConverter.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// import IAggregator từ orakl repository
import { IAggregator } from "@bisonai/orakl-contracts/src/v0.1/interfaces/IAggregator.sol";

// Declare a library named PriceConverter
library PriceConverter {
    
    // Declare function getPrice with input as contract interface and return uint256
    function getPrice(IAggregator priceFeed) internal view returns (uint256) {
        // gọi function latestRoundData() trong priceFeed
        (, int256 answer,,,) = priceFeed.latestRoundData();
        // Returns the ETH/USD rate with 18 digits (Oracle has 8 zeros so add 10 zeros)
        // ETH/USD rate in 18 digit
        return uint256(answer * 10000000000);
    }

    // 1000000000
    // call it get fiatConversionRate, since it assumes something about decimals
    // It wouldn't work for every aggregator
    // Convert KLAY amount to USD amount
    // function getConversionRate takes input ethAmount with type uint256 and interface contract, returns uint256
    function getConversionRate(uint256 ethAmount, IAggregator priceFeed) internal view returns (uint256) {
        // First get the eth price using getPrice and assign it to the variable ethPrice
        uint256 ethPrice = getPrice(priceFeed);
        // Then multiply ethPrice by the amount of ether and divide by 18 zeros
        // In solidity, we should multiply before dividing because there is no float
        // This calculation is ethPrice (18 digits) * ethAmount (18 digits) / 18 digits to get back 18 digits.      
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1000000000000000000;
        // Returns the USD value of the ether amount    
        // the actual ETH/USD conversation rate, after adjusting the extra 0s.
        return ethAmountInUsd;
    }
}`}</code>
            </pre>
            <li>To handle import dependencies for Foundry</li>
            <pre>
              <code>{`forge install Bisonai/orakl`}</code>
            </pre>
            <pre>
              <code>{`forge install Cyfrin/foundry-devops`}</code>
            </pre>
            <p>
              Thêm <span className="highlight">remappings</span>, ffi và{" "}
              <span className="highlight">[rpc_endpoints]</span> vào file{" "}
              <span className="highlight">foundry.toml</span>
            </p>
            <pre>
              <code>
                {`[profile.default]
src = "src"
out = "out"
libs = ["lib"]
remappings = [
  "@bisonai/orakl-contracts/src/=lib/orakl/contracts/src/",
]
ffi = true
fs_permissions = [{ access = "read", path = "./broadcast" }]

[rpc_endpoints]
baobab = "\${BAOBAB_RPC_URL}"

# See more config options https://github.com/foundry-rs/foundry/blob/master/crates/config/README.md#all-options`}
              </code>
            </pre>
            <li>
              Add <span className="highlight">.env</span> file and add{" "}
              <span className="highlight">BAOBAB_RPC_URL</span>{" "}
              <span className="highlight">BAOBAB_RPC_URL</span> can be obtained
              on Ankr, Allthatnodes, etc.
            </li>
            <pre>
              <code>BAOBAB_RPC_URL=https://xxxxxx/xxxxx</code>
            </pre>
            <li>
              In the <span className="highlight">tests</span> folder we create 3
              subfolders <span className="highlight">unit</span>,{" "}
              <span className="highlight">integration</span>,{" "}
              <span className="highlight">mocks</span> and files{" "}
              <span className="highlight">FundMeTest.t.sol</span>,{" "}
              <span className="highlight">interactionsTest.t.sol</span>,{" "}
              <span className="highlight">MockDataFeedAggregator.sol</span>
            </li>
            <pre>
              <code>
                {`.
└── tests
    ├── integration
    │   └── interactionsTest.t.sol
    ├── mocks
    │   └── MockDataFeedAggregator.sol
    └── unit
        └── FundMeTest.t.sol`}
              </code>
            </pre>
            <p>Copy the contents of the 3 files</p>
            <span className="highlight">FundMeTest.t.sol</span>
            <pre>
              <code>{`// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import { DeployFundMe } from "../../script/DeployFundMe.s.sol";
import { FundMe } from "../../src/FundMe.sol";
import { HelperConfig } from "../../script/HelperConfig.s.sol";
import { Test, console } from "forge-std/Test.sol";
import { StdCheats } from "forge-std/StdCheats.sol";

contract FundMeTest is StdCheats, Test {
    FundMe public fundMe;
    HelperConfig public helperConfig;

    uint256 public constant SEND_VALUE = 0.1 ether; // just a value to make sure we are sending enough!
    uint256 public constant STARTING_USER_BALANCE = 10 ether;
    uint256 public constant GAS_PRICE = 1;

    address public constant USER = address(1);

    // uint256 public constant SEND_VALUE = 1e18;
    // uint256 public constant SEND_VALUE = 1_000_000_000_000_000_000;
    // uint256 public constant SEND_VALUE = 1000000000000000000;

    function setUp() external {
        DeployFundMe deployer = new DeployFundMe();
        (fundMe, helperConfig) = deployer.run();
        vm.deal(USER, STARTING_USER_BALANCE);
    }

    function testPriceFeedSetCorrectly() public view {
        address retreivedPriceFeed = address(fundMe.getPriceFeed());
        (address expectedPriceFeed) = helperConfig.activeNetworkConfig();
        assertEq(retreivedPriceFeed, expectedPriceFeed);
    }

    function testFundFailsWithoutEnoughETH() public {
        vm.expectRevert();
        fundMe.fund();
    }

    function testFundUpdatesFundedDataStructure() public {
        vm.startPrank(USER);
        fundMe.fund{value: SEND_VALUE}();
        vm.stopPrank();

        uint256 amountFunded = fundMe.getAddressToAmountFunded(USER);
        assertEq(amountFunded, SEND_VALUE);
    }

    function testAddsFunderToArrayOfFunders() public {
        vm.startPrank(USER);
        fundMe.fund{value: SEND_VALUE}();
        vm.stopPrank();

        address funder = fundMe.getFunder(0);
        assertEq(funder, USER);
    }

    // https://twitter.com/PaulRBerg/status/1624763320539525121

    modifier funded() {
        vm.prank(USER);
        fundMe.fund{value: SEND_VALUE}();
        assert(address(fundMe).balance > 0);
        _;
    }

    function testOnlyOwnerCanWithdraw() public funded {
        vm.expectRevert();
        fundMe.withdraw();
    }

    function testWithdrawFromASingleFunder() public funded {
        // Arrange
        uint256 startingFundMeBalance = address(fundMe).balance;
        uint256 startingOwnerBalance = fundMe.getOwner().balance;

        // vm.txGasPrice(GAS_PRICE);
        // uint256 gasStart = gasleft();
        // // Act
        vm.startPrank(fundMe.getOwner());
        fundMe.withdraw();
        vm.stopPrank();

        // uint256 gasEnd = gasleft();
        // uint256 gasUsed = (gasStart - gasEnd) * tx.gasprice;

        // Assert
        uint256 endingFundMeBalance = address(fundMe).balance;
        uint256 endingOwnerBalance = fundMe.getOwner().balance;
        assertEq(endingFundMeBalance, 0);
        assertEq(
            startingFundMeBalance + startingOwnerBalance,
            endingOwnerBalance // + gasUsed
        );
    }

    // Can we do our withdraw function a cheaper way?
    function testWithdrawFromMultipleFunders() public funded {
        uint160 numberOfFunders = 10;
        uint160 startingFunderIndex = 2;
        for (uint160 i = startingFunderIndex; i < numberOfFunders + startingFunderIndex; i++) {
            // we get hoax from stdcheats
            // prank + deal
            hoax(address(i), STARTING_USER_BALANCE);
            fundMe.fund{value: SEND_VALUE}();
        }

        uint256 startingFundMeBalance = address(fundMe).balance;
        uint256 startingOwnerBalance = fundMe.getOwner().balance;

        vm.startPrank(fundMe.getOwner());
        fundMe.withdraw();
        vm.stopPrank();

        assert(address(fundMe).balance == 0);
        assert(startingFundMeBalance + startingOwnerBalance == fundMe.getOwner().balance);
        assert((numberOfFunders + 1) * SEND_VALUE == fundMe.getOwner().balance - startingOwnerBalance);
    }
}`}</code>
            </pre>
            <p>
              <span className="highlight">MockDataFeedAggregator.sol</span>
            </p>
            <pre>
              <code>{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MockV3Aggregator
 * @notice Based on the FluxAggregator contract
 * @notice Use this contract when you need to test
 * other contract's ability to read data from an
 * aggregator contract, but how the aggregator got
 * its answer is unimportant
 */
contract MockDataFeedAggregator {
    uint256 public constant version = 4;

    uint8 public decimals;
    int256 public latestAnswer;
    uint256 public latestTimestamp;
    uint256 public latestRound;

    mapping(uint256 => int256) public getAnswer;
    mapping(uint256 => uint256) public getTimestamp;
    mapping(uint256 => uint256) private getStartedAt;

    constructor(uint8 _decimals, int256 _initialAnswer) {
        decimals = _decimals;
        updateAnswer(_initialAnswer);
    }

    function updateAnswer(int256 _answer) public {
        latestAnswer = _answer;
        latestTimestamp = block.timestamp;
        latestRound++;
        getAnswer[latestRound] = _answer;
        getTimestamp[latestRound] = block.timestamp;
        getStartedAt[latestRound] = block.timestamp;
    }

    function updateRoundData(uint80 _roundId, int256 _answer, uint256 _timestamp, uint256 _startedAt) public {
        latestRound = _roundId;
        latestAnswer = _answer;
        latestTimestamp = _timestamp;
        getAnswer[latestRound] = _answer;
        getTimestamp[latestRound] = _timestamp;
        getStartedAt[latestRound] = _startedAt;
    }

    function getRoundData(uint80 _roundId)
        external
        view
        returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
    {
        return (_roundId, getAnswer[_roundId], getStartedAt[_roundId], getTimestamp[_roundId], _roundId);
    }

    function latestRoundData()
        external
        view
        returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
    {
        return (
            uint80(latestRound),
            getAnswer[latestRound],
            getStartedAt[latestRound],
            getTimestamp[latestRound],
            uint80(latestRound)
        );
    }

    function description() external pure returns (string memory) {
        return "v0.6/test/mock/MockV3Aggregator.sol";
    }
}`}</code>
            </pre>
            <p>
              <span className="highlight">interactionsTest.t.sol</span>
            </p>
            <pre>
              <code>
                {`// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import { DeployFundMe } from "../../script/DeployFundMe.s.sol";
import { FundFundMe, WithdrawFundMe } from "../../script/Interactions.s.sol";
import { FundMe } from "../../src/FundMe.sol";
import { HelperConfig } from "../../script/HelperConfig.s.sol";
import { Test, console } from "forge-std/Test.sol";
import { StdCheats } from "forge-std/StdCheats.sol";

contract InteractionsTest is StdCheats, Test {
    FundMe public fundMe;
    HelperConfig public helperConfig;

    uint256 public constant SEND_VALUE = 0.1 ether; // just a value to make sure we are sending enough!
    uint256 public constant STARTING_USER_BALANCE = 10 ether;
    uint256 public constant GAS_PRICE = 1;

    address public constant USER = address(1);

    // uint256 public constant SEND_VALUE = 1e18;
    // uint256 public constant SEND_VALUE = 1_000_000_000_000_000_000;
    // uint256 public constant SEND_VALUE = 1000000000000000000;

    function setUp() external {
        DeployFundMe deployer = new DeployFundMe();
        (fundMe, helperConfig) = deployer.run();
        vm.deal(USER, STARTING_USER_BALANCE);
    }

    function testUserCanFundAndOwnerWithdraw() public {
        FundFundMe fundFundMe = new FundFundMe();
        fundFundMe.fundFundMe(address(fundMe));

        WithdrawFundMe withdrawFundMe = new WithdrawFundMe();
        withdrawFundMe.withdrawFundMe(address(fundMe));

        assert(address(fundMe).balance == 0);
    }
}`}
              </code>
            </pre>
            <li>
              Then we go to the <span className="highlight">scripts</span>{" "}
              folder and create the files{" "}
              <span className="highlight">DeployFundMe.s.sol</span>,{" "}
              <span className="highlight">HelperConfig.s.sol</span> and{" "}
              <span className="highlight">Interactions.s.sol</span>
            </li>
            <pre>
              <code>
                {`.
└── script
    ├── DeployFundMe.s.sol
    ├── HelperConfig.s.sol
    └── Interactions.s.sol`}
              </code>
            </pre>
            <p>
              <span className="highlight">DeployFundMe.s.sol</span>
            </p>
            <pre>
              <code>{`// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import { Script } from "forge-std/Script.sol";
import { HelperConfig } from "./HelperConfig.s.sol";
import { FundMe } from "../src/FundMe.sol";

contract DeployFundMe is Script {
    function run() external returns (FundMe, HelperConfig) {
        HelperConfig helperConfig = new HelperConfig(); // This comes with our mocks!
        address priceFeed = helperConfig.activeNetworkConfig();

        vm.startBroadcast();
        FundMe fundMe = new FundMe(priceFeed);
        vm.stopBroadcast();
        return (fundMe, helperConfig);
    }
}`}</code>
            </pre>
            <p>
              <span className="highlight">HelperConfig.s.sol</span>
            </p>
            <pre>
              <code>{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { MockDataFeedAggregator } from "../test/mocks/MockDataFeedAggregator.sol";
import { Script } from "forge-std/Script.sol";

contract HelperConfig is Script {
    NetworkConfig public activeNetworkConfig;

    uint8 public constant DECIMALS = 8;
    int256 public constant INITIAL_PRICE = 2000e8;

    struct NetworkConfig {
        address priceFeed;
    }

    event HelperConfig__CreatedMockPriceFeed(address priceFeed);

    constructor() {
        if (block.chainid == 1001) {
            activeNetworkConfig = getBaobabKlayConfig();
        } else {
            activeNetworkConfig = getOrCreateAnvilBaobabConfig();
        }
    }

    function getBaobabKlayConfig() public pure returns (NetworkConfig memory baobabNetworkConfig) {
        baobabNetworkConfig = NetworkConfig({
            priceFeed: 0x33D6ee12D4ADE244100F09b280e159659fe0ACE0 // KLAY / USDT
        });
    }

    function getOrCreateAnvilBaobabConfig() public returns (NetworkConfig memory anvilNetworkConfig) {
        // Check to see if we set an active network config
        if (activeNetworkConfig.priceFeed != address(0)) {
            return activeNetworkConfig;
        }
        vm.startBroadcast();
        MockDataFeedAggregator mockPriceFeed = new MockDataFeedAggregator(
            DECIMALS,
            INITIAL_PRICE
        );
        vm.stopBroadcast();
        emit HelperConfig__CreatedMockPriceFeed(address(mockPriceFeed));

        anvilNetworkConfig = NetworkConfig({priceFeed: address(mockPriceFeed)});
    }
}`}</code>
            </pre>
            <p>
              <span className="highlight">Interactions.s.sol</span>
            </p>
            <pre>
              <code>{`// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import { Script, console } from "forge-std/Script.sol";
import { FundMe } from "../src/FundMe.sol";
import { DevOpsTools } from "foundry-devops/src/DevOpsTools.sol";

contract FundFundMe is Script {
    uint256 SEND_VALUE = 0.1 ether;

    function fundFundMe(address mostRecentlyDeployed) public {
        vm.startBroadcast();
        FundMe(payable(mostRecentlyDeployed)).fund{value: SEND_VALUE}();
        vm.stopBroadcast();
        console.log("Funded FundMe with %s", SEND_VALUE);
    }

    function run() external {
        address mostRecentlyDeployed = DevOpsTools.get_most_recent_deployment("FundMe", block.chainid);
        fundFundMe(mostRecentlyDeployed);
    }
}

contract WithdrawFundMe is Script {
    function withdrawFundMe(address mostRecentlyDeployed) public {
        vm.startBroadcast();
        FundMe(payable(mostRecentlyDeployed)).withdraw();
        vm.stopBroadcast();
        console.log("Withdraw FundMe balance!");
    }

    function run() external {
        address mostRecentlyDeployed = DevOpsTools.get_most_recent_deployment("FundMe", block.chainid);
        withdrawFundMe(mostRecentlyDeployed);
    }
}`}</code>
            </pre>
            <li>Deploy Use this command to deploy to Baobab testnet</li>
            <pre>
              <code>
                {`forge script script/DeployFundMe.s.sol --rpc-url $BAOBAB_RPC_URL --account $WALLET_NAME --sender $SENDER_ADDRESS --broadcast --gas-estimate-multiplier 200`}
              </code>
            </pre>
            <ul>
              <li>
                <span className="highlight">--gas-estimate-multiplier 200</span>{" "}
                - is to multiply the gas estimate by 2 because there may be
                transaction errors due to not enough gas
              </li>
              <li>
                <span className="highlight">--sender $SENDER_ADDRESS</span> -
                Replace <span className="highlight">$SENDER_ADDRESS</span> with
                your address
              </li>
              <li>
                <span className="highlight">--account $WALLET_NAME</span> - You
                can set it up with the commands{" "}
                <span className="highlight">cast wallet new</span>
                and <span className="highlight">cast wallet import</span>.
                Replace <span className="highlight">$WALLET_NAME</span> with the
                name of the keystore you saved
              </li>
            </ul>
          </ol>
        </div>
      </div>
    </div>
  );
}
