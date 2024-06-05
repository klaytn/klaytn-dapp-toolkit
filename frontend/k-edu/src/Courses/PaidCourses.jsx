import React, { Component } from "react";
import Data from "../data.json";
import "./Courses.css";

export default class PaidCourses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handleCourseId: props.handleCourseId,
      klayBalance: props.klayBalance,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.klayBalance !== this.props.klayBalance) {
      this.setState({ klayBalance: this.props.klayBalance });
    }
  }

  veryify = (courseFee, klayBalance, page) => {
    if (courseFee < klayBalance) {
      if (window.confirm(`The price of the course is ${courseFee}`)) {
        const newBalance = this.state.klayBalance - courseFee;
        this.setState({ klayBalance: newBalance });
        window.alert("Course Purchased Successfully");
        window.location.href = page;
      } else {
        window.alert("Purchase Cancelled");
      }
    } else {
      window.alert("Insufficient Balance");
    }
  };

  render() {
    return (
      <div className="row row-cols-1 row-cols-md-3 g-4 ">
        {Data.map((course) => {
          return course["category"] === "Premium" ? (
            <div className="col" id={course["id"]} key={course["id"]}>
              <div className="card h-100">
                <img
                  src="../assets/mesh.png"
                  className="card-img-top"
                  alt="..."
                ></img>
                <div className="card-body">
                  <h5 className="card-title">{course["courseTitle"]}</h5>
                  <p className="card-text">{course["description"]}</p>
                  <div className="cta">
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        this.veryify(
                          course["price"],
                          this.state.klayBalance,
                          `/course/${course["id"]}`
                        )
                      }
                    >
                      Check it out
                    </button>
                    <span className="premiumCategoryTag">
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
}
