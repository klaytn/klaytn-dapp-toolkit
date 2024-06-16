import React, { useEffect, useState } from "react";
import Intro from "./frontend/intro";
import SetUp from "./frontend/setUp";
import Basic from "./frontend/basic";
import Advanced from "./frontend/advanced";
import FundMe from "./frontend/fundMe";
import Practice from "./frontend/practice";
import FinalTest from "./frontend/finalTest";
import "./bootcamp.css";

export default function Frontend() {
  const [visibleModule, setVisibleModule] = useState(0);

  useEffect(() => {
    const modules = document.querySelectorAll(".modules");
    const toggles = document.querySelectorAll(".toggle");

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
        <h1>Frontend</h1>
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
                        <a href="#intro-1-1">1.1. Overview</a>
                      </li>
                      <li>
                        <a href="#intro-1-2">
                          1.2. Structure of a frontend project
                        </a>
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
                        <a href="#basic-3-1">3.1. Basic Frontend</a>
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
                        <a href="#advanced-4-1">4.1. Transaction Life Cycle</a>
                      </li>
                    </ul>
                  </div>
                ) : null}
              </li>
              <li>
                <p className="toggle">5-FundMe</p>
                {visibleModule === 4 ? (
                  <div className="subContent">
                    <ul>
                      <li>
                        <a href="#fundMe-5-1">5.1. Basic Frontend</a>
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
                        <a href="#practice-6-1">ERC20Frontend</a>
                      </li>
                      <li>
                        <a href="#practice-6-2">ERC72Frontend</a>
                      </li>
                      <li>
                        <a href="#practice-6-3">Lottery Frontend</a>
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
                        <a href="#test-7-1">6.1. Final Test</a>
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
          <section className="fundMe-5 modules">
            <FundMe />
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
