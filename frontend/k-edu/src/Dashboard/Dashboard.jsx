import React, { Component } from "react";
import "./dashboard.css";
import Transactions from "../transaction";
import profile from "../profile.json";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      klayBalance: props.klayBalance,
      fetchKlayBalance: props.getBalance,
      isDisable: props.isDisable,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.klayBalance !== this.props.klayBalance ||
      prevProps.isDisable !== this.props.isDisable // Corrected typo here
    ) {
      this.setState({
        klayBalance: this.props.klayBalance,
        isDisable: this.props.isDisable,
      });
    }
  }
  render() {
    return (
      <div className="dashboardContainer">
        <div className="dashboard">
          <img src="/assets/mesh.png" alt="Mesh Pic" className="mesh" />
          <div className="dashboardInfo">
            <div className="profileDetails">
              <h1>{profile[0]["name"]}</h1>
              <p>{profile[0]["description"]}</p>
            </div>
            <div className="balance">
              {/* <p>{profile[0]["price"]} KLAY</p> */}
              <p>
                {this.state.klayBalance !== null
                  ? `${this.state.klayBalance} Klay`
                  : "Balance N/A"}
              </p>
            </div>
          </div>
          <div className="actions">
            {!this.state.isDisable && (
              <button
                className="actionButton"
                onClick={this.state.fetchKlayBalance}
                disabled={this.state.isDisable}
              >
                Connect
              </button>
            )}
            <button onClick={Transactions.handleGetKlay}>Buy Klay</button>
          </div>
        </div>
      </div>
    );
  }
}
