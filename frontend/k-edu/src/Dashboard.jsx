import React from "react";
import "./dashboard.css";
import Mesh from "./assets/mesh.png";
import profile from "./profile.json";

export default function Dashboard() {
  return (
    <div className="dashboardContainer">
      <div className="dashboard">
        <img src={Mesh} alt="Mesh Pic" className="mesh" />
        <div className="dashboardInfo">
          <div className="profileDetails">
            <h1>{profile[0]["name"]}</h1>
            <p>{profile[0]["description"]}</p>
          </div>
          <div className="balance">
            <p>{profile[0]["price"]} KLAY</p>
          </div>
        </div>
        <div className="actions">
          <button>Connect</button>
          <button>Buy Klay</button>
        </div>
      </div>
    </div>
  );
}
