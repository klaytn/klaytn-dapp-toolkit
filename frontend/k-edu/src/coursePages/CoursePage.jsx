import React from "react";
import { useParams } from "react-router-dom";
import courses from "../data.json";
import "./coursePage.css";

export default function CoursePage() {
  const { id } = useParams();

  return (
    <div>
      {courses.map((course, index) => {
        // const authorImage = course["profileImage"];
        return course["id"] === Number(id) ? (
          <div className="container">
            <header>
              <div className="courseDetails">
                <h2 className="courseHeader">{course["courseTitle"]}</h2>
                <i className="courseDescription">{course["description"]}</i>
              </div>
              <div className="courseAuthor">
                <p>{course["author"]}</p>
                <img src={course["profileImage"]} alt="Author"></img>
              </div>
            </header>
            <main>
              <p>{course["content"]}</p>
              <p className="learnMore">
                To learn more, check out the video lesson below
              </p>
              {/* <video
                src="https://youtu.be/8OQ0vLPRcqs?si=wOjltj387NSLuCpx"
                // poster="https://intranet-projects-files.s3.amazonaws.com/webstack/thumbnail.jpg"
                loop
                controls
              >
                Sorry, your browser doesn't support HTML5 video
              </video> */}
              {/* <iframe
                src="https://www.youtube.com/"
                title={`${course["courseTitle"]} video`}
                name={`${course["courseTitle"]} video`}
              ></iframe> */}
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/7TuXKSEdWzo?si=cSAwRl3w0khpbZ8P"
                title={`${course["courseTitle"]} video`}
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </main>
          </div>
        ) : null;
      })}
    </div>
  );
}
