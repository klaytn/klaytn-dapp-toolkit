import React, { useEffect } from "react";
import FreeCourses from "./FreeCourses";
import PaidCourses from "./PaidCourses";
import AdvanceCourses from "./AdvancedCourses";
import "./Courses.css";

export default function Courses(props) {
  const { handleCourseId, klayBalance } = props;

  useEffect(() => {
    const categories = document.querySelectorAll(".categories");
    const toggles = document.querySelectorAll(".category");

    categories.forEach((category) => {
      category.style.display = "none";
    });

    categories[0].style.display = "block";
    toggles[0].style.color = "rgb(155, 9, 29)";

    const handleToggle = (index) => {
      // Changes the toggle color on clicking it
      toggles.forEach((t) => {
        t.style.color = "rgb(34, 32, 32";
      });
      toggles[index].style.color = "rgb(155, 9, 29)";
      // Switches the category on clicking a toggle
      categories.forEach((category) => {
        category.style.display = "none";
      });
      categories[index].style.display = "block";
    };

    toggles.forEach((toggle, index) => {
      toggle.addEventListener("click", () => handleToggle(index));
    });
  });

  // The function controls the course toggle action
  // const toggleCourse = () => {
  //   const toggles = document.querySelectorAll(".category");
  //   const categories = document.querySelectorAll(".categories");

  //   toggles.forEach((toggle, index) => {
  //     // Changes the toggle color on clicking it
  //     toggle.addEventListener("click", () => {
  //       toggles.forEach((toggle) => {
  //         toggle.style.color = "rgb(34, 32, 32)";
  //       });
  //       toggle.style.color = "";
  //       // Switches the category on clicking a toggle
  //       categories.forEach((category) => {
  //         category.style.display = "none";
  //       });
  //       categories[index].style.display = "block";
  //     });
  //   });
  // };
  return (
    <React.Fragment>
      <div className="courses">
        <div className="coursesContainer">
          <div className="courseCategory">
            <ul>
              <li className="category">Free</li>
              <li className="category">Paid</li>
              <li className="category">Advanced</li>
            </ul>
          </div>
          <section className="freeCourses categories">
            <FreeCourses handleCourseId={handleCourseId} />
          </section>
          <section className="paidCourses categories">
            <PaidCourses
              handleCourseId={handleCourseId}
              klayBalance={klayBalance}
            />
          </section>
          <section className="AdvancedCourses categories">
            <AdvanceCourses handleCourseId={handleCourseId} />
          </section>
        </div>
      </div>
    </React.Fragment>
  );
}
