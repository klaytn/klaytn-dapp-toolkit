import React from "react";
import Data from "../data.json";
import Mesh from "../assets/mesh.png";
import "./Courses.css";

export default function AdvanceCourses() {
  return (
    <div className="row row-cols-1 row-cols-md-3 g-4">
      {Data.map((course) => {
        return course["category"] === "Advanced" ? (
          <div className="col" id={course["id"]} key={course["id"]}>
            <div className="card h-100">
              <img src={Mesh} className="card-img-top" alt="..."></img>
              <div className="card-body">
                <h5 className="card-title">{course["courseTitle"]}</h5>
                <p className="card-text">{course["description"]}</p>
                <div className="cta">
                  <a href="/#" className="btn btn-primary">
                    Check it out
                  </a>
                  <span className="advancedCategoryTag">
                    {course["category"]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null;
      })}
    </div>
  );
}
