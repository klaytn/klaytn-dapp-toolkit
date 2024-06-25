import React from "react";

export default function Basic() {
  return (
    <div>
      <header>
        <h2>3-Basics</h2>
      </header>
      <div id="basic-3-1" className="subSection">
        <h4>3.1 - Value Types</h4>
        <hr />
        <div className="subSection_content">
          <h5>INT/UNIT</h5>
          <hr />
          <p>
            <span className="highlight">uint</span> is short for
            <span className="highlight">unsigned integer</span>, and you can
            choose the size from <span className="highlight">uint8</span> to{" "}
            <span className="highlight">uint256</span>
          </p>
          <ul>
            <li>
              <span className="highlight">uint8</span> starts from{" "}
              <span className="highlight">0</span> to{" "}
              <span className="highlight">2 ** 8 - 1</span>
            </li>
            <li>
              <span className="highlight">uint16</span> starts from{" "}
              <span className="highlight">0</span> to{" "}
              <span className="highlight">2 ** 16 - 1</span>
            </li>
            <p>...</p>
            <li>
              <span className="highlight">uint256</span> starts from{" "}
              <span className="highlight">0</span> to{" "}
              <span className="highlight">2 ** 256 - 1</span>
            </li>
          </ul>
          <pre>
            <code>
              {`uint8 public u8 = 1;
uint256 public u256 = 456;
uint public u = 123; // uint is short hand for uint256`}
            </code>
          </pre>
          <p>
            <span className="highlight">int</span> is short for
            <span className="highlight">integer</span>, and you can choose the
            size from <span className="highlight">int8</span> to{" "}
            <span className="highlight">int256</span>
          </p>
          <ul>
            <li>
              <span className="highlight">int8</span> starts from{" "}
              <span className="highlight">-2 ** 7</span> to{" "}
              <span className="highlight">2 ** 8 - 1</span>
            </li>
            <li>
              <span className="highlight">int16</span> starts from{" "}
              <span className="highlight">-2 ** 15</span> to{" "}
              <span className="highlight">2 ** 15 - 1</span>
            </li>
            <li>
              <span className="highlight">int128</span> starts from{" "}
              <span className="highlight">-2 ** 127</span> to{" "}
              <span className="highlight">2 ** 127 - 1</span>
            </li>
            <li>
              <span className="highlight">int8</span> starts from{" "}
              <span className="highlight">-2 ** 255</span> to{" "}
              <span className="highlight">2 ** 255 - 1</span>
            </li>
          </ul>
          <pre>
            <code>
              {`int8 public i8 = -1;
int256 public i256 = 456;
int public i = -123; // int is short hand for int256`}
            </code>
          </pre>
          <h6>int and uint operators:</h6>
          <ul>
            <li>
              Comparisons: {`<=, <, ==, !=, >=, >`} (returns{" "}
              <span className="highlight">bool</span>)
            </li>
            <li>
              Bit operations: &, |, ^ (bitwise exclusive hoặc), ~ (bitwise
              negation)
            </li>
            <li>
              Shifts: {`<<`} (left shift), {`>>`} (right shift)
            </li>
            <li>
              Addition, Subtraction and Multiplication:{" "}
              <span className="highlight">+</span>,{" "}
              <span className="highlight">-</span>,{" "}
              <span className="highlight">negative -</span> (as in
              <span className="highlight">signed integer</span>),{" "}
              <span className="highlight">*</span>,{" "}
              <span className="highlight">/</span>,{" "}
              <span className="highlight">%</span> (modulo),{" "}
              <span className="highlight">**</span>
              {` `}
              (exponentiation)
            </li>
          </ul>
          <p>
            For a type <span className="highlight">integer</span> variable X,
            you can use <span className="highlight">type(X).min</span> and{" "}
            <span className="highlight">type(X).max</span> to access smallest
            and biggest value respectively for that type.
          </p>
          <pre>
            <code>
              {`// minimum and maximum of int type: 
int public minInt = type(int).min;
int public maxInt = type(int).max;

// minimum and maximum of uint type:
uint public minUint = type(uint).min;
uint public maxUint = type(uint).max;`}
            </code>
          </pre>
        </div>
        <div className="subSection_content">
          <h5>BOOL</h5>
          <hr />
          <p>
            <span className="highlight">bool</span> means{" "}
            <span className="highlight">Boolean</span> and has 2 possible values
            which are <span className="highlight">true</span> and{" "}
            <span className="highlight">false</span>
          </p>
          <pre>
            <code>{`bool public trueVar = true;
bool public falseVar = false;`}</code>
          </pre>
          <h6>Operators:</h6>
          <ul>
            <li>
              <span className="highlight">!</span> (reverse logic, equivalent to
              "not")
            </li>
            <li>
              <span className="highlight">&&</span> (the logic of combining the
              equivalent of "and")
            </li>
            <li>
              <span className="highlight">||</span> (logical or equivalent "or")
            </li>
            <li>
              <span className="highlight">==</span> (equal)
            </li>
            <li>
              <span className="highlight">!=</span> (not equal)
            </li>
          </ul>
          <p>
            Operator <span className="highlight">||</span> and{" "}
            <span className="highlight">&&</span> apply the usual short-circuit
            rules. This means that in the expression{" "}
            <span className="highlight">f(x) || g(y)</span>, if{" "}
            <span className="highlight">f(x)</span> evaluates to{" "}
            <span className="highlight">true</span>,{" "}
            <span className="highlight">g(y)</span> will not be evaluated even
            if it may have a side effect.
          </p>
        </div>
        <div className="subSection_content">
          <h5>ADDRESS</h5>
          <hr />
          <ul>
            <li>
              <span className="highlight">address</span> is a special type of
              data in Solidity that allows storing 20 bytes (size) of the
              address of an Ethereum account
            </li>
            <li>
              <span>address payable</span> is similar to Address but with the
              addition of <span className="highlight">transfer</span> and{" "}
              <span className="highlight">send</span> features
            </li>
          </ul>
          <pre>
            <code>
              {`address public exampleAddress = 0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c;
address payable public examplePayableAddress = 0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c;`}
            </code>
          </pre>
        </div>
        <div className="subSection_content">
          <h5>BYTES</h5>
          <hr />
          <p>
            In Solidity, a byte data type represents a string of bytes. Solidity
            has two types of bytes types:
          </p>
          <ul>
            <li>Fixed-size byte arrays</li>
            <li>Byte arrays are dynamically sized.</li>
          </ul>
          <p>
            The word bytes in Solidity represents a dynamic array of bytes. It
            basically stands for byte[].
          </p>
          <pre>
            <code>
              {`bytes1 a = 0xb5; //  [10110101]
bytes1 b = 0x56; //  [01010110]
bytes c = "abc"; //  [01100001, 01100010, 01100011]`}
            </code>
          </pre>
        </div>
        <div className="subSection_content">
          <h5>DEFAULT VALUES</h5>
          <hr />
          <p>
            Variables that are declared without assigning a value will have a
            default value
          </p>
          <pre>
            <code>
              {`bool public defaultBool; // false
uint public defaultUint; // 0
int public defaultInt; // 0
address public defaultAddr; // 0x0000000000000000000000000000000000000000
bytes1 public defaultByte; // 0x00`}
            </code>
          </pre>
        </div>
        <div className="subSection_content">
          <h5>CONTRACT</h5>
          <hr />
          <p>The contract is used to declare a contract in solidity.</p>
          <pre>
            <code>{`contract HelloWorld {}`}</code>
          </pre>
          <p>
            The contract can also inherit from a different contract with the
            keyword is
          </p>
          <pre>
            <code>{`contract Mercedes is Car {}`}</code>
          </pre>
        </div>
        <div className="subSection_content">
          <h5>ENUM</h5>
          <hr />
          <p>
            <span className="highlight">Enum</span> is a way to create
            user-defined styling in Solidity. They can explicitly convert to and
            from all types of integers but implicit conversions are not allowed.
            An explicit conversion from an integer checks during runtime that
            the value is within the enum's range and causes a{" "}
            <span className="highlight">Panic Error</span> otherwise.
            <span className="highlight">Enums</span> requires at least one
            member and its default value when declared as the first member.{" "}
            <span className="highlight">Enums</span> cannot have more than 256
            members.
          </p>
          <p>
            The data representation is the same as for enums in C: Options are
            represented by unsigned integer values followed by 0.
          </p>
          <p>
            Using <span className="highlight">type(NameOfEnum).min</span> and{" "}
            <span className="highlight">type(NameOfEnum).max</span> you can get
            the smallest and largest values of the given enum respectively.
          </p>
          <pre>
            <code>
              {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Enum {
    // Enum representing shipping status
    enum Status {
        Pending,
        Shipped,
        Accepted,
        Rejected,
        Canceled
    }

    // Default value is the first element listed in
    // definition of the type, in this case "Pending"
    Status public status;

    // Returns uint
    // Pending  - 0
    // Shipped  - 1
    // Accepted - 2
    // Rejected - 3
    // Canceled - 4
    function get() public view returns (Status) {
        return status;
    }

    // Update status by passing uint into input
    function set(Status _status) public {
        status = _status;
    }

    // You can update to a specific enum like this
    function cancel() public {
        status = Status.Canceled;
    }

    // delete resets the enum to its first value, 0
    function reset() public {
        delete status;
    }
}`}
            </code>
          </pre>
        </div>
        <div className="subSection_content">
          <h5>TYPE</h5>
          <hr />
          <p>
            The user-defined value type allows the creation of a zero cost
            abstraction for the underlying value type. This is similar to
            aliases but has stricter elimination requirements.
          </p>
          <p>
            The user-defined value type is defined by{" "}
            <span className="highlight">type C is V</span>, where
            <span className="highlight">C</span> is the name of the newly
            declared type and <span className="highlight">V</span> must be the
            integrated value type.
          </p>
          <pre>
            <code>
              {`// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.8;

// Represent a 18 decimal, 256 bit wide fixed point type using a user-defined value type.
type UFixed256x18 is uint256;`}
            </code>
          </pre>
        </div>
        <div className="subSection_content">
          <h5>FUNCTION</h5>
          <hr />
          <p>
            <span className="highlight">function</span> is used to declare a
            function in solidity.
          </p>
          <p>
            I declare 1 full <span className="highlight">function</span> as
            below
          </p>
          <pre>
            <code>
              {`contract Counter {
    uint public count;

    // Hàm để xem biến count
    function get() public view returns (uint) {
        return count;
    }
}`}
            </code>
          </pre>
        </div>
      </div>
      <div id="basic-3-2" className="subSection">
        <h4>3.2 - Reference Types</h4>
        <hr />
        <div className="subSection_content">
          <h5>Data storage locations</h5>
          <hr />
          <p>
            Variable are declared with the words
            <span className="highlight">storage</span>,{" "}
            <span className="highlight">memory</span>, or{" "}
            <span className="highlight">calldata</span> to specify the location
            to save the data.
          </p>
          <ul>
            <li>
              <span className="highlight">storage</span> - variable is state
              variable (stored on blockchain)
            </li>
            <li>
              <span className="highlight">memory</span> - Variables are in
              memory and only exist while the{" "}
              <span className="highlight">function</span> is running
            </li>
            <li>
              <span className="highlight">calldata</span> - A special data store
              containing the data passed to the function
            </li>
          </ul>
          <pre>
            <code>
              {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DataLocations {
    uint storage varStorage
    uint memory varMemory
    uint calldata varCallData
}`}
            </code>
          </pre>
        </div>
        <div className="subSection_content">
          <h5>Array</h5>
          <hr />
          <p>
            <span className="highlight">Array</span> is a combination of value
            elements in the same format, similar to{" "}
            <span className="highlight">list</span> in python and
            <span className="highlight">array</span> in{" "}
            <span className="highlight">Javascript</span>
          </p>
          <pre>
            <code>{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Array {
    // Several ways to initialize an array
    uint[] public arr;
    uint[] public arr2 = [1, 2, 3];
    // Fixed sized array, all elements initialize to 0
    uint[10] public myFixedSizeArr;

    function get(uint i) public view returns (uint) {
        return arr[i];
    }

    // Solidity can return the entire array.
    // But this function should be avoided for
    // arrays that can grow indefinitely in length.
    function getArr() public view returns (uint[] memory) {
        return arr;
    }

    function push(uint i) public {
        // Append to array
        // This will increase the array length by 1.
        arr.push(i);
    }

    function pop() public {
        // Remove last element from array
        // This will decrease the array length by 1
        arr.pop();
    }

    function getLength() public view returns (uint) {
        return arr.length;
    }

    function remove(uint index) public {
        // Delete does not change the array length.
        // It resets the value at index to it's default value,
        // in this case 0
        delete arr[index];
    }

    function examples() external {
        // create array in memory, only fixed size can be created
        uint[] memory a = new uint[](5);
    }
}`}</code>
          </pre>
        </div>
        <div className="subSection_content">
          <h5>Struct</h5>
          <hr />
          <p>
            <span className="highlight">Struct</span> is a data format that
            programmers declare to gather many variables of different formats
            under one name for easy use in{" "}
            <span className="highlight">contract</span>.
          </p>
          <pre>
            <code>
              {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Todos {
    struct Todo {
        string text;
        bool completed;
    }

    // An array of 'Todo' structs
    Todo[] public todos;

    function create(string calldata _text) public {
        // 3 ways to initialize a struct
        // - calling it like a function
        todos.push(Todo(_text, false));

        // key value mapping
        todos.push(Todo({text: _text, completed: false}));

        // initialize an empty struct and then update it
        Todo memory todo;
        todo.text = _text;
        // todo.completed initialized to false

        todos.push(todo);
    }

    // Solidity automatically created a getter for 'todos' so
    // you don't actually need this function.
    function get(uint _index) public view returns (string memory text, bool completed) {
        Todo storage todo = todos[_index];
        return (todo.text, todo.completed);
    }

    // update text
    function updateText(uint _index, string calldata _text) public {
        Todo storage todo = todos[_index];
        todo.text = _text;
    }

    // update completed
    function toggleCompleted(uint _index) public {
        Todo storage todo = todos[_index];
        todo.completed = !todo.completed;
    }
}`}
            </code>
          </pre>
        </div>
      </div>
      <div id="basic-3-3" className="subSection">
        <h4>3.3 - Mapping Types</h4>
        <hr />
        <div className="subSection_content">
          <h5>DMapping</h5>
          <hr />
          <p>
            <span className="highlight">mapping</span> can be used to create a{" "}
            <span className="highlight">hashmap</span> (similar to{" "}
            <span className="highlight">dict</span> in{" "}
            <span className="highlight">python</span>) between 1
            <span className="highlight">type</span> to another{" "}
            <span className="highlight">type</span>.
          </p>
          <h6>Note</h6>
          <p>
            When you create a <span className="highlight">mapping</span>, all{" "}
            <span className="highlight">keys</span> exist at the same time. That
            means:
          </p>
          <p>
            For example, you create{" "}
            <span className="highlight">
              {`mapping(address => uint256) addressToValue;`}
            </span>
            . If you haven't set any <span className="highlight">key</span> and{" "}
            <span className="highlight">value</span> then all{" "}
            <span className="highlight">address</span> that you input will
            return the default value of{" "}
            <span className="highlight">uint256</span> which is 0.
          </p>
          <pre>
            <code>
              {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Mapping {
    // Mapping from address to uint
    mapping(address => uint) public myMap;

    function get(address _addr) public view returns (uint) {
        // Mapping always returns a value.
        // If the value was never set, it will return the default value.
        return myMap[_addr];
    }

    function set(address _addr, uint _i) public {
        // Update the value at this address
        myMap[_addr] = _i;
    }

    function remove(address _addr) public {
        // Reset the value to the default value.
        delete myMap[_addr];
    }
}

contract NestedMapping {
    // Nested mapping (mapping from address to another mapping)
    mapping(address => mapping(uint => bool)) public nested;

    function get(address _addr1, uint _i) public view returns (bool) {
        // You can get values from a nested mapping
        // even when it is not initialized
        return nested[_addr1][_i];
    }

    function set(address _addr1, uint _i, bool _boo) public {
        nested[_addr1][_i] = _boo;
    }

    function remove(address _addr1, uint _i) public {
        delete nested[_addr1][_i];
    }
}`}
            </code>
          </pre>
        </div>
      </div>
      <div id="basic-3-4" className="subSection">
        <h4>Simple Storage</h4>
        <hr />
        <div className="subSection_content">
          <pre>
            <code>
              {`// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

contract SimpleStorage {

    // Declare a variable to store the name of the maintainer
    string public maintainerName = "zxstim";
    // Declare the version of the contract
    uint8 public version = 1;
    // Declare an address to receive donation
    address public donationAddress = 0xe3d25540BA6CED36a0ED5ce899b99B5963f43d3F;

    // Declare a Person type to store information of a person
    struct Person {
        string name; // name    
        uint8 age; // age
        bool overEighteen; // Over eighteen?
        address uuid; // UUID
        uint256 assetValue; // asset value
        int256 debtValue; // debt value
    }

    Person[] private listOfPeople; // this syntax means creating an array to store Person named listOfPeople
    
    mapping(address => Person) uuidToPerson; // this syntax means creating a mapping from address to Person named uuidToPerson

    //  this function will store the information of a new person with name, age, overEighteen, assetValue, debtValue
    function storePerson(string memory _name, uint8 _age, bool _overEighteen, uint256 _assetValue, int256 _debtValue) public returns (Person memory person) {
        _assetValue *= 1e18; // Chuyển đổi giá trị tài sản sang đơn vị wei
        _debtValue *= 1e18; // Chuyển đổi giá trị nợ sang đơn vị wei
        // Thêm thông tin của person mới vào danh sách listOfPeople
        listOfPeople.push(Person({name: _name, age: _age, overEighteen: _overEighteen, uuid: msg.sender, assetValue: _assetValue, debtValue: _debtValue}));
        // Thêm thông tin của person mới vào mapping uuidToPerson
        uuidToPerson[msg.sender] = Person({name: _name, age: _age, overEighteen: _overEighteen, uuid: msg.sender, assetValue: _assetValue, debtValue: _debtValue});
        return Person({name: _name, age: _age, overEighteen: _overEighteen, uuid: msg.sender, assetValue: _assetValue, debtValue: _debtValue});
    }

    // this function will retrieve the information of a person based on the address
    function retrievePerson(address _address) public view returns (Person memory person) {
        return uuidToPerson[_address];
    }
}`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
