import React from "react";

export default function SetUp() {
  return (
    <div>
      <header>
        <h2>2-SetUp</h2>
      </header>
      <div id="setup-2-1" className="subSection">
        <div className="subSection_content">
          <h4>MacOS or Linux</h4>
          <hr />
          <ul>
            <li>
              <a href="https://remix.ethereum.org/#lang=en&optimize=false&runs=200&evmVersion=null">
                Remix IDE
              </a>
            </li>
            <li>
              <a href="https://remix.ethereum.org/#lang=en&optimize=false&runs=200&evmVersion=null">
                Node Version Manager (nvm)
              </a>
            </li>
            <li>Node v20 LTS</li>
          </ul>
        </div>
        <div className="subSection_content">
          <h4>Windows</h4>
          <hr />
          <ul>
            <li>
              <a href="https://remix.ethereum.org/#lang=en&optimize=false&runs=200&evmVersion=null">
                Remix IDE
              </a>
            </li>
            <li>
              <a href="https://remix.ethereum.org/#lang=en&optimize=false&runs=200&evmVersion=null">
                Node Version Manager (nvm)
              </a>
            </li>
            <li>Node v20 LTS</li>
          </ul>
        </div>
        <div className="subSection_content">
          <h4>Kaikas</h4>
          <hr />
          <ul>
            <li>
              Download Kaikas Wallet at{" "}
              <a href="https://kaikas.io/">https://kaikas.io/</a>
            </li>
            <li>Create wallet</li>
          </ul>
        </div>
        <div className="subSection_content">
          <h4>Testnet KLAY</h4>
          <hr />
          <ul>
            <li>
              Go to{" "}
              <a href="https://baobab.wallet.klaytn.foundation/faucet">
                https://baobab.wallet.klaytn.foundation/faucet
              </a>{" "}
            </li>
            <li>
              Enter your wallet address to receive Baobab{" "}
              <span className="highlight">KLAY</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
