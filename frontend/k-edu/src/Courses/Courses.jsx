import React from "react";
import FreeCourses from "./FreeCourses";
import PaidCourses from "./PaidCourses";
import AdvanceCourses from "./AdvancedCourses";
import "./Courses.css";

export default function Courses() {
  window.addEventListener("load", () => {
    const categories = document.querySelectorAll(".categories");
    const toggle = document.querySelectorAll(".category");

    categories.forEach((category) => {
      category.style.display = "none";
    });

    categories[0].style.display = "block";
    toggle[0].style.color = "rgb(155, 9, 29)";
  });

  // The function controls the course toggle action
  const toggleCourse = () => {
    const toggles = document.querySelectorAll(".category");
    const categories = document.querySelectorAll(".categories");

    toggles.forEach((toggle, index) => {
      // Changes the toggle color on clicking it
      toggle.addEventListener("click", () => {
        toggles.forEach((toggle) => {
          toggle.style.color = "rgb(34, 32, 32)";
        });
        console.log("Toggle index: ", index);
        toggle.style.color = "rgb(155, 9, 29)";
        // Switches the category on clicking a toggle
        categories.forEach((category) => {
          category.style.display = "none";
        });
        categories[index].style.display = "block";
      });
    });
  };
  return (
    <React.Fragment>
      <div className="courses">
        <div className="coursesContainer">
          <div className="courseCategory">
            <ul>
              <li onClick={toggleCourse} className="category">
                Free
              </li>
              <li onClick={toggleCourse} className="category">
                Paid
              </li>
              <li onClick={toggleCourse} className="category">
                Advanced
              </li>
            </ul>
          </div>
          <section className="freeCourses categories">
            <FreeCourses />
          </section>
          <section className="paidCourses categories">
            <PaidCourses />
          </section>
          <section className="AdvancedCourses categories">
            <AdvanceCourses />
          </section>
        </div>
      </div>
    </React.Fragment>
  );
}
