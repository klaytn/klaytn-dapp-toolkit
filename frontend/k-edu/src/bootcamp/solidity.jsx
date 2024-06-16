import React, { useEffect } from "react";
import Intro from "./solidity/intro";
import SetUp from "./solidity/setUp";
import Basic from "./solidity/basic";
import Advanced from "./solidity/advanced";
import Contracts from "./solidity/contracts";
import Practice from "./solidity/practice";
import FinalTest from "./solidity/finalTest";
import Footer from "../Footer/Footer";
import "./bootcamp.css";
import { useState } from "react";

export default function Solidity() {
  const [visibleModule, setVisibleModule] = useState(0);

  useEffect(() => {
    let modules = document.querySelectorAll(".modules");
    let toggles = document.querySelectorAll(".toggle");

    modules.forEach((module) => {
      module.style.display = "none";
    });

    // Show the first module
    if (modules.length > 0) {
      modules[0].style.display = "block";
    }

    const handleToggleClick = (index) => {
      modules.forEach((module) => {
        module.style.display = "none";
      });
      modules[index].style.display = "block";
      setVisibleModule(index);
    };

    toggles.forEach((toggle, index) => {
      toggle.addEventListener("click", () => handleToggleClick(index));
    });

    return () => {
      toggles.forEach((toggle, index) => {
        toggle.removeEventListener("click", () => handleToggleClick(index));
      });
    };
  }, []);

  return (
    <div className="container">
      <header>
        <h1>Solidity</h1>
        <hr />
      </header>
      <div className="content">
        <div className="aside">
          <aside>
            <h5>Table of Content:</h5>
            <ul>
              <li>
                <p className="toggle">1-intro</p>
                {visibleModule === 0 ? (
                  <div className="subContent">
                    <ul>
                      <li>
                        <a href="#intro-1-1">1.1. Blockchain</a>
                      </li>
                      <li>
                        <a href="#intro-1-2">1.2. Solidity File Structure</a>
                      </li>
                      <li>
                        <a href="#intro-1-3">1.3. Contract Structure</a>
                      </li>
                    </ul>
                  </div>
                ) : null}
              </li>
              <li>
                <p className="toggle">2-Setup</p>
                {visibleModule === 1 ? (
                  <div className="subContent">
                    <ul>
                      <li>
                        <a href="#setup-2-1">2.1. Getting Started</a>
                      </li>
                    </ul>
                  </div>
                ) : null}
              </li>
              <li>
                <p className="toggle">3-Basic</p>
                {visibleModule === 2 ? (
                  <div className="subContent">
                    <ul>
                      <li>
                        <a href="#basic-3-1">3.1. Value Types</a>
                      </li>
                      <li>
                        <a href="#basic-3-2">3.2. Reference Types</a>
                      </li>
                      <li>
                        <a href="#basic-3-3">3.3. Mapping Types</a>
                      </li>
                      <li>
                        <a href="#basic-3-4">SimpleStorage.sol</a>
                      </li>
                    </ul>
                  </div>
                ) : null}
              </li>
              <li>
                <p className="toggle">4-Advanced</p>
                {visibleModule === 3 ? (
                  <div className="subContent">
                    <ul>
                      <li>
                        <a href="#advanced-4-1">4.1. Units</a>
                      </li>
                      <li>
                        <a href="#advanced-4-2">4.2. Global Variables</a>
                      </li>
                      <li>
                        <a href="#advanced-4-3">
                          4.3. Expressions and Control Structures
                        </a>
                      </li>
                      <li>
                        <a href="#advanced-4-4">AdvancedStorage.sol</a>
                      </li>
                    </ul>
                  </div>
                ) : null}
              </li>
              <li>
                <p className="toggle">5-Contracts</p>
                {visibleModule === 4 ? (
                  <div className="subContent">
                    <ul>
                      <li>
                        <a href="#contracts-5-1a">5.1a. Test</a>
                      </li>
                      <li>
                        <a href="#contracts-5-1b">5.1b. Remix Idea-tests</a>
                        <ul>
                          <li>
                            <a href="#contracts-5-1b-1">
                              AdvancedStorage.test.js
                            </a>
                          </li>
                          <li>
                            <a href="#contracts-5-1b-2">
                              AdvancedStorage_test.sol
                            </a>
                          </li>
                          <li>
                            <a href="#contracts-5-1b-3">SimpleStorage.sol</a>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <a href="#contracts-5-2">5.2. Contracts</a>
                      </li>
                      <li>
                        <a href="#contracts-5-3">5.3. Foundry Fund Me</a>
                      </li>
                    </ul>
                  </div>
                ) : null}
              </li>
              <li>
                <p className="toggle">6-Practice</p>
                {visibleModule === 5 ? (
                  <div className="subContent">
                    <ul>
                      <li>
                        <a href="#practice-6-1">6.1. Foundry Lottery</a>
                      </li>
                    </ul>
                  </div>
                ) : null}
              </li>
              <li>
                <p className="toggle">7-FinalTest</p>
                {visibleModule === 6 ? (
                  <div className="subContent">
                    <ul>
                      <li>
                        <a href="#test-7-1">7.1. Final Test CTF</a>
                      </li>
                    </ul>
                  </div>
                ) : null}
              </li>
            </ul>
          </aside>
        </div>
        <div className="resources">
          <section className="intro-1 modules">
            <Intro />
          </section>
          <section className="setUp-2 modules">
            <SetUp />
          </section>
          <section className="basic-3 modules">
            <Basic />
          </section>
          <section className="advanced-4 modules">
            <Advanced />
          </section>
          <section className="contract-5 modules">
            <Contracts />
          </section>
          <section className="practice-6 modules">
            <Practice />
          </section>
          <section className="finalTest-7 modules">
            <FinalTest />
          </section>
        </div>
      </div>
    </div>
  );
}
