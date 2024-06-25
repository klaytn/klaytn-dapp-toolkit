import React, { useEffect, useState } from "react";
// import { Component } from "react";
import courses from "../data.json";
import "./Navbar.css";

export default function Navbar() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isRootPath, setIsRootPath] = useState(true)

  let screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  useEffect(() => {
    let navBarContainer = document.querySelector(".navContainer");
    let lastScrollTop = window.scrollY || document.documentElement.scrollTop;
    let screenHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;

    setIsRootPath(window.location.pathname === "/")

    window.addEventListener("scroll", () => {
      let scrollTopPosition =
        window.scrollY || document.documentElement.scrollTop;
      if (window.scrollY > screenHeight / 3) {
        console.log("Screen Width: ", screenHeight);
        if (scrollTopPosition >= lastScrollTop) {
          setTimeout(() => {
            navBarContainer.style.transform = "translateY(-400px)";
          }, 1);
        } else {
          setTimeout(() => {
            navBarContainer.style.transform = "translateY(0)";
          }, 1);
        }
      }

      lastScrollTop = scrollTopPosition <= 0 ? 0 : scrollTopPosition;
    });
  }, []);

  const filteredCourses = courses.filter((course) =>
    (course.courseTitle ?? "")
      .toLowerCase()
      .includes(searchKeyword.toLowerCase())
  );

  const search = async (e) => {
    const filterDisplay = document.querySelector(".searchResult");
    e.preventDefault();
    filterDisplay.style.display = "block";
  };

  const closeSearch = () => {
    const filterDisplay = document.querySelector(".searchResult");
    filterDisplay.style.display = "none";
  };

  return (
    <React.Fragment>
      <div className="navContainer">
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              K-Edu
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="https://klaytn.foundation/" target="_blank" rel="noreferrer">
                    Klaytn
                  </a>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="/#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Courses
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="/courses/free">
                        Free
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="/courses/paid">
                        Paid
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider"></hr>
                    </li>
                    <li>
                      <a className="dropdown-item" href="/courses/advanced">
                        Advanced
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider"></hr>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  {!isRootPath ? (
                    <div>
                      <a
                        className="nav-link dropdown-toggle"
                        href="/bootcamp"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        BootCamp
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <a
                            className="dropdown-item"
                            href="/bootcamp"
                          >
                            Bootcamp
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider"></hr>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="/bootcamp/solidity"
                          >
                            Solidity
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider"></hr>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="/bootcamp/frontend"
                          >
                            Frontend
                          </a>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <a
                      className="nav-link"
                      href="/bootcamp"
                      role="button"
                      aria-expanded="false"
                    >
                      Bootcamp
                    </a>
                  )}
                </li>
              </ul>
              <form className="d-flex" role="search">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  onChange={(e) => setSearchKeyword(e.target.value)}
                ></input>
                <button
                  className="btn btn-outline-success"
                  type="submit"
                  onClick={search}
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </nav>
        <div className="searchResult">
          <div className="searchResultContainer">
            <span onClick={() => closeSearch()}>Close</span>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => {
                return (
                  <ul key={index}>
                    <li>
                      <div className="courseDetails">
                        <a href={`/course/${course["id"]}`}>
                          {course.courseTitle}
                        </a>
                        <p className="tag">{course["category"]}</p>
                        {screenWidth > 720 ? (
                          <p className="description">{course.description}</p>
                        ) : null}
                      </div>
                      <div className="authorDetails">
                        <p>{course.author}</p>
                        <img src={course.profileImage} alt="Author" />
                      </div>
                    </li>
                  </ul>
                );
              })
            ) : (
              <p>No courses found</p>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
