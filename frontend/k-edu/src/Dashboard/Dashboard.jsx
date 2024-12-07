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

  handleWalletconnect = () => {
    let form = document.querySelector(".walletDetailsContainer");
    const walletKey = document.getElementById("privKey").value;
    const walletAddress = document.getElementById("address").value;
    this.state.fetchKlayBalance(walletKey, walletAddress);
    form.style.display = "none";
  };

  displayForm = () => {
    let form = document.querySelector(".walletDetailsContainer");
    form.style.display = "flex";
  };

  closeForm = () => {
    let form = document.querySelector(".walletDetailsContainer");
    form.style.display = "none";
  };

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
                onClick={this.displayForm}
                disabled={this.state.isDisable}
              >
                Connect
              </button>
            )}
            <button onClick={Transactions.handleGetKlay}>Buy Klay</button>
          </div>
        </div>
        <div className="walletDetailsContainer">
          <div className="walletDetails">
            <span className="closeForm" onClick={this.closeForm}>
              Close
            </span>
            <label htmlFor="privKey">Klaytn Wallet Private Key:</label>
            <input type="text" id="privKey" name="privKey" />
            <label htmlFor="address">Klaytn Wallet Address:</label>
            <input type="text" id="address" name="address" />
            <button type="submit" onClick={this.handleWalletconnect}>
              Connect
            </button>
          </div>
        </div>
      </div>
    );
  }
}
