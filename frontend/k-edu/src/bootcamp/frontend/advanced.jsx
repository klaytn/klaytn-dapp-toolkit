import React from "react";

export default function Advanced() {
  return (
    <div>
      <header>
        <h2>4-Advanced</h2>
      </header>
      <div id="advanced-4-1" className="subSection">
        <h4>Handling transaction lifecycle</h4>
        <hr />
        <div className="subSection_content">
          <h5>Why does it matter?</h5>
          <hr />
          <p>
            The weakest point of interacting with smart contracts is the speed
            of sending transactions and waiting for results to be returned from
            the node. This is a characteristic that heavily affects the user
            experience (UX). Transactions can encounter problems such as errors,
            reverts, lack of gas, etc., so when designing the user interface, we
            must take care to handle the entire transaction lifecycle so that
            users can know the current status clearly.
          </p>
        </div>
        <div className="subSection_content">
          <h4>What does Wagmi do?</h4>
          <hr />
          <p>
            React Hooks in Wagmi have many features to help you manage the
            transaction lifecycle. Eg:
          </p>
          <h6>useReadContract</h6>
          <p>
            Wagmi's <span className="highlight">useReadContract</span> hook
            returns us the data when calling{" "}
            <span className="highlight">function</span>
            without changing <span className="highlight">state</span>. In
            addition, the hook also returns a status object (e.g.
            <span className="highlight">error</span>,{" "}
            <span className="highlight">isPending</span>) so we can show the
            user the corresponding transaction status.
          </p>
          <pre>
            <code>
              {`// import BaseError and hook useReadContract
import { type BaseError, useReadContract } from 'wagmi'
// import the smart contract's abi file to get the function's interface
import { abi } from './abi'

function ReadContract() {
  const { 
    data: balance, // assign the returned data to the balance variable
    error, // initialize error variable
    isPending // initialize the isPending variable
  } = useReadContract({
    abi, // abi của function
    functionName: 'balanceOf', // function name you want to call
    args: ['0x03A71968491d55603FFe1b11A9e23eF013f75bCF'], // Pass variables to the function
  })
  
  // If isPending is true, the text "Loading..." is displayed, otherwise it disappears
  if (isPending) return <div>Loading...</div> 
  
  // If there is an error, display the div with error message
  if (error) 
    return ( 
      <div>
        Error: {(error as BaseError).shortMessage || error.message} 
      </div> 
    )  

  return (
    // Displays the balance (if any) after converting to string format
    <div>Balance: {balance?.toString()}</div>
  )
}`}
            </code>
          </pre>
          <h6>useWriteContract</h6>
          <p>
            Wagmi's <span className="highlight">useWriteContract</span> hook
            returns us a <span className="highlight">data</span> object
            containing the <span className="highlight">hash</span> of the
            transaction after calling a{" "}
            <span className="highlight">function</span> that changes the{" "}
            <span className="highlight">state</span> of the smart contract.
          </p>
          <pre>
            <code>{`data
\`WriteContractReturnType | undefined\`

Defaults to \`undefined\`
The last successfully resolved data for the mutation.`}</code>
          </pre>
          <p>
            Additionally, the hook also returns us an{" "}
            <span className="highlight">isPending</span> object that we can use
            to display the pending status of the transaction.
          </p>
          <p>
            In addition, Wagmi also provides
            <span className="highlight">useWaitForTransactionReceipt</span> hook
            for us to wait for transaction results with 2 return variables:{" "}
            <span className="highlight">isLoading</span>,
            <span className="highlight">isSuccess</span>.
          </p>
          <p>Here is an example from the Wagmi v2 docs:</p>
          <pre>
            <code>
              {`import * as React from 'react' // import react into file
// import BaseError, and 2 hooks useWaitForTransactionReceipt, useWriteContract from wagmi library
import { 
  type BaseError, 
  useWaitForTransactionReceipt, 
  useWriteContract 
} from 'wagmi'
// import the smart contract's abi file to get the function's interface
import { abi } from './abi'
 
export function MintNFT() {
  const { 
    data: hash, // assign the returned data to a variable named hash
    error, // assign error object to error variable
    isPending, // assign the isPending object to the isPending variable
    writeContract // initialize the writeContract function for use
  } = useWriteContract() 

  // function dùng để submit form
  async function submit(e: React.FormEvent<HTMLFormElement>) { 
    e.preventDefault() 
    const formData = new FormData(e.target as HTMLFormElement) 
    const tokenId = formData.get('tokenId') as string 
    writeContract({
      address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2', // contract address
      abi, // abi of contract
      functionName: 'mint', // function name you want to call
      args: [BigInt(tokenId)], // pass input to function
    })
  } 

  // Call the useWaitForTransactionReceipt hook to initialize the isConfirming and isConfirmed states
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    }) 

  // Return format of React
  return (
    <form onSubmit={submit}>
      <input name="address" placeholder="0xA0Cf…251e" required />
      <input name="value" placeholder="0.05" required />
      // If isPending is true, the button will be disabled
      <button 
        disabled={isPending} 
        type="submit"
      >
        {isPending ? 'Confirming...' : 'Mint'} 
        // If isPending is true, display the word "Confirming...", otherwise display the word "Mint"
      </button>
      // If hash is true, the div containing the transaction hash is displayed, otherwise it disappears
      {hash && <div>Transaction Hash: {hash}</div>}
      // If isConfirming is true then display the div with the text "Waiting for confirmation..."
      {isConfirming && <div>Waiting for confirmation...</div>} 
      // If isConfirmed is true, display the div with the text "Transaction confirmed."
      {isConfirmed && <div>Transaction confirmed.</div>}
      // If there is an error, display the div with error message
      {error && ( 
        <div>Error: {(error as BaseError).shortMessage || error.message}</div> 
      )} 
    </form>
  )
}`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
