import React, { Component } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Row,
  Collapse,
  Fade,
  Alert
} from "reactstrap";
import { AppSwitch } from "@coreui/react";

import client, {
  pendingDonorRetrieval,
  donorApproval,
  donorReject
} from "../../../../services/axios_api";
class ManageDonors extends Component {
  constructor(props) {
    super(props);
    this.onEntering = this.onEntering.bind(this);
    this.onEntered = this.onEntered.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.toggleCustom = this.toggleCustom.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);

    this.state = {
      collapse: false,
      accordion: [true, false, false],
      custom: [true, false],
      status: "Closed",
      fadeIn: true,
      timeout: 300,

      pendingDonors: null,
      error: null,
      isLoaded: false,
      approveDonor: false,
      rejectDonor: false,
      inspectorAddress: this.getCookie("admin"),
      donorAddress: null,

      alertVisible: false,
      alertColor: "info",
      alertMessage: "I am an alert message"
    };
  }

  getCookie = (name) => {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  triggerAlert = (color, message) => {
    this.setState({
      alertColor: color,
      alertMessage: message
    });
    this.onDismiss();
    setTimeout(this.onDismiss, 3000);
  };

  onDismiss = () => {
    this.setState({ alertVisible: !this.state.alertVisible });
  };

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      dropdownOpen: newArray,
      collapse: !this.state.collapse
    });
  }

  onEntering() {
    this.setState({ status: "Opening..." });
  }

  onEntered() {
    this.setState({ status: "Opened" });
  }

  onExiting() {
    this.setState({ status: "Closing..." });
  }

  onExited() {
    this.setState({ status: "Closed" });
  }

  toggleAccordion(tab) {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => (tab === index ? !x : false));

    this.setState({
      accordion: state
    });
  }

  toggleCustom(tab) {
    const prevState = this.state.custom;
    const state = prevState.map((x, index) => (tab === index ? !x : false));

    this.setState({
      custom: state
    });
  }

  toggleFade() {
    this.setState({ fadeIn: !this.state.fadeIn });
  }

  componentDidMount() {
    pendingDonorRetrieval().then(
      result => {
        console.log("checkinginging");
        let data = result.data;
        console.log(data);
        if (data["code"] === 200) {
          console.log("checking");
          console.log(data["items"]);
          this.setState({
            isLoaded: true,
            pendingDonors: data["items"]
          });
        } else {
          this.setState({
            isLoaded: true
          });
        }
      },
      error => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  }
  retrievePendingDonors = () => {
    pendingDonorRetrieval().then(
      result => {
        console.log("checkinginging");
        let data = result.data;
        console.log(data);
        if (data["code"] === 200) {
          console.log("checking");
          console.log(data["items"]);
          this.setState({
            isLoaded: true,
            pendingDonors: data["items"]
          });
        } else {
          this.setState({
            isLoaded: true
          });
        }
      },
      error => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  };

  approveDonor = approvingDonor => {
    var data = new FormData();
    data.set("donorAddress", approvingDonor.eth_address);
    data.set("inspectorAddress", this.state.inspectorAddress);
    console.log("Donor Address");
    console.log(approvingDonor.eth_address);
    this.setState({ isLoaded: true });

    donorApproval(data)
      .then(response => {
        if (response.data["code"] === 200) {
          console.log("approving donor should be fine");
          console.log(response.data["code"]);
          this.setState({ approveDonor: true });
          this.retrievePendingDonors();
          this.triggerAlert("success", "Donor has been approved");
        } else {
          console.log("approving donor What's wrong with you");
          console.log(response.data["code"]);
          this.triggerAlert("danger", response.data["message"]);
        }
      })
      .catch(e => {
        console.log(e);
      })
      .then(() => {
        this.setState({ approveDonor: false });
      });
  };

  rejectDonor = rejectingDonor => {
    var data = new FormData();
    data.set("donorAddress", rejectingDonor.eth_address);
    data.set("inspectorAddress", this.state.inspectorAddress);
    console.log("Donor Address");
    console.log(rejectingDonor.eth_address);
    this.setState({ isLoaded: true });

    donorReject(data)
      .then(response => {
        if (response.data["code"] === 200) {
          console.log("rejecting donor should be fine");
          console.log(response.data["code"]);
          this.setState({ rejectDonor: true });
          this.retrievePendingDonors();
          this.triggerAlert("success", "Donor has been rejected");
        } else {
          console.log("approving donor What's wrong with you");
          console.log(response.data["code"]);
          this.triggerAlert("danger", response.data["message"]);
        }
      })
      .catch(e => {
        console.log(e);
      })
      .then(() => {
        this.setState({ rejectDonor: false });
      });
  };

  render() {
    const { pendingDonors } = this.state;

    if (!pendingDonors) {
      return [];
    }
    return (
      <div className="animated fadeIn">
        <Alert
          color={this.state.alertColor}
          isOpen={this.state.alertVisible}
          toggle={this.onDismiss}
          style={{ position: "fixed", top: "10rem", right: "5rem" }}
        >
          {this.state.alertMessage}
        </Alert>
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Pending Donors
          </CardHeader>
          <CardBody>
            {pendingDonors.map(donor => {
              return (
                <Card className="mb-0" key={donor.username}>
                  <CardBody>
                    <h3>Username: {donor.username}</h3>
                    <ul>
                      <li key={donor.eth_address}>
                        Eth Account: {donor.eth_address}
                      </li>
                      <li key={donor.email}>Email Address: {donor.email}</li>
                      <li key={donor.bank_account}>
                        Bank Account: {donor.bank_account}
                      </li>
                      <li key={donor.physical_address}>
                        Physical Address: {donor.physical_address}
                      </li>
                      <li key={donor.full_name}>Full Name: {donor.full_name}</li>
                      <li key={donor.contact_number}>
                        Contact Number: {donor.contact_number}
                      </li>
                      <li key={donor.financial_info}>
                        Financial Information: {donor.financial_info}
                      </li>
                      <li key={donor.registration_hash}>
                        Registration Hash: {donor.registration_hash}
                      </li>
                    </ul>
                    <Row>
                      <Col sm="6" style={{ textAlign: "center" }}>
                        <Button
                          outline
                          color="success"
                          onClick={() => this.approveDonor(donor)}
                        >
                          Approve
                        </Button>
                      </Col>
                      <Col sm="6" style={{ textAlign: "center" }}>
                        <Button
                          outline
                          color="danger"
                          onClick={() => this.rejectDonor(donor)}
                        >
                          Reject
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              );
            })}
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default ManageDonors;
