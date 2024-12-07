import React from "react";

export default function Intro() {
    return (
      <div>
        <header>
          <h2>1-Intro</h2>
        </header>
        <div id="intro-1-1" className="subSection">
          <h4>1.1. Overview</h4>
          <hr />
          <div className="subSection_content">
            <h6>General Information</h6>
            <p>
              After you write and deploy a smart contract, the next step is to
              build an interface so users can interact intuitively and simply
              instead of having to fumble to interact with the smart contract
              function.
            </p>
            <p>
              Currently, React (and frameworks built on React) are the most
              popular in the Web3 industry. Thanks to React's number of
              libraries and open ecosystem, other frameworks like Vue or Angular
              are rarely used.
            </p>
          </div>
          <div className="subSection_content">
            <h6>How does the interface interact with smart contracts?</h6>
            <p>
              Frontend UI can interact with smart contracts by connecting to an
              RPC blockchain node. RPC stands for Remote Procedure Call,
              basically a protocol that helps clients (here meaning interfaces)
              connect to the blockchain network to request data or perform
              actions such as sending transactions, interacting with smart
              contracts.
            </p>
            <p>
              You can use a blockchain node that you install and operate on your
              server yourself or use Node-as-a-service provider (Node service
              providers). If your connection needs are small, Node-as-a-service
              provider will help you save a lot of money.
            </p>
          </div>
        </div>
        <div id="intro-1-2" className="subSection">
          <h4>1.2. Structure of a frontend project</h4>
          <hr />
          <div className="subSection_content">
            <p>
              We will use the technical Stack to build the following frontend:
            </p>
            <ul>
              <li>
                <a href="https://nextjs.org/">Next.JS</a> - React production
                framework
              </li>
              <li>
                <a href="https://tailwindcss.com/">TailwindCSS</a> - Utility
                class library for CSS
              </li>
              <li>
                <a href="https://ui.shadcn.com/">Shadcn UI</a> - Tailwind-based
                React component library
              </li>
              <li>
                <a href="https://wagmi.sh/">Wagmi v2</a> - React hook library
                for interacting with blockchain
              </li>
              <li>
                <a href="https://walletconnect.com/">WalletConnect</a> -
                Communication protocol to connect DApp and Wallet
              </li>
              <li>
                <a href="https://www.rainbowkit.com/">Rainbowkit</a> - Component
                library to connect wallet with DApp
              </li>
              <li>
                <a href="https://tanstack.com/query/latest/docs/framework/react/overview">
                  React Query từ Tanstack
                </a>{" "}
                - Library to execute queries for React
              </li>
            </ul>
            <p>
              Below is the layout of a sample project to build UI for FundMe
              smart contract in the Solidity section.
            </p>
            <pre>
              <code>
                {`
├── README.md
├── abi
│   └── FundMe.json
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components
│   ├── abi.ts
│   ├── fund-me-balance.tsx
│   ├── fund.tsx
│   ├── my-fund.tsx
│   └── ui
├── components.json
├── lib
│   └── utils.ts
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.js
├── public
│   ├── next.svg
│   └── vercel.svg
├── tailwind.config.ts
└── tsconfig.json
                      `}
              </code>
            </pre>
          </div>
        </div>
      </div>
    );
}