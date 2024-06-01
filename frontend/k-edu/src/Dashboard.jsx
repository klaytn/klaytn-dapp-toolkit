import React, { Component } from "react";
import "./dashboard.css";
import Transactions from "./transaction";
import profile from "./profile.json";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      klayBalance: props.klayBalance,
      fetchKlayBalance: props.getBalance,
      isDisabled: props.isDisabled,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.klayBalance !== this.props.klayBalance ||
      prevProps.isDisabled !== this.props.isDisabled
    ) {
      this.setState({
        klayBalance: this.props.klayBalance,
        isDisabled: this.props.isDisabled,
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
            <button
              onClick={this.state.fetchKlayBalance}
              disabled={this.state.isDisabled}
            >
              Connect
            </button>
            <button onClick={Transactions.handleGetKlay}>Buy Klay</button>
          </div>
        </div>
      </div>
    );
  }
}
