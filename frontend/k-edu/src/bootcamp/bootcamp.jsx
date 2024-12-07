import React from "react";
import "./bootcamp.css";

export default function Bootcamp() {
  return (
    <div className="container">
      <header>
        <h1>Kaia DApp Bootcamp</h1>
      </header>
      <section className="introduction">
        <h3>Introduction</h3>
        <hr />
        <p>
          Kaia DApp Bootcamp is a training program for developers who are
          interested in exploring web3. This program includes both smart
          contract section (using Solidity) and frontend section (using Next.js
          based stack)
        </p>
      </section>
      <section className="curriculum">
        <h3>Curriculum</h3>
        <hr />
        <div className="solidity">
          <p>
            1. <a href="/bootcamp/solidity">Solidity</a>
          </p>

          <ul>
            <li>Intro: Introduction to Klaytn and blockchain basics.</li>
            <li>
              SetUp: Set up the environment and tools you will use for DApp
              development.
            </li>
            <li>Basic: Basic knowledge in Solidity.</li>
            <li>Advanced: Advanced knowledge in Solidity.</li>
            <li>
              Contracts: Learn deeply about testing and Foundry framework.
            </li>
            <li>Practice: Exercises for you to hone your skills.</li>
            <li>FinalTest: CTF challenge as final exam.</li>
          </ul>
        </div>
        <div className="frontend">
          <p>
            2. <a href="/bootcamp/frontend">Frontend</a>
          </p>

          <ul>
            <li>Intro: Introduction to UI for DApps.</li>
            <li>
              SetUp: Set up the environment and tools you will use for DApp
              interface development.
            </li>
            <li>
              Basic: Basic knowledge of frameworks, wagmi and rainbowkit
              libraries.
            </li>
            <li>
              Advanced: Learn deeply about Transaction lifecycle and UX
              improvement options.
            </li>
            <li>FundMe: Build interface for FundMe contract.</li>
            <li>Practice: Exercises for you to hone your skills.</li>
            <li>FinalTest: Final exam.</li>
          </ul>
        </div>
      </section>
      <section className="instructions">
        <h3>Learning Instructions</h3>
        <hr />
        <ul>
          <li>
            You will start from Solidity then go to Frontend and start
            sequentially according to the marked order.
          </li>
          <li>
            You read the documents in the folders and do the exercises according
            to the instructions.
          </li>
        </ul>
      </section>
      <section className="attribution">
        <h3>Attribution</h3>
        <hr />
        <p>
          DApp Bootcamp content is inspired by{" "}
          <a
            href="https://www.youtube.com/@PatrickAlphaC"
            target="_blank"
            rel="noreferrer"
          >
            Patrick Collins free course on Youtube
          </a>
          , along with examples from{" "}
          <a
            href="https://solidity-by-example.org/"
            target="_blank"
            rel="noreferrer"
          >
            Solidity by Example
          </a>
          and{" "}
          <a href="https://soliditylang.org/" target="_blank" rel="noreferrer">
            SolidityLang
          </a>
          .
        </p>
      </section>
    </div>
  );
}
