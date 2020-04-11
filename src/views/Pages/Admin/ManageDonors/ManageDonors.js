import React, { Component } from "react";
import LoadingOverlay from "react-loading-overlay";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Collapse,
  Fade,
  Alert,
} from "reactstrap";
import { AppSwitch } from "@coreui/react";

import client, {
  pendingDonorRetrieval,
  donorApproval,
  donorReject,
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

      visible: false,
      alertColor: "info",
      alertMessage: "I am an alert message",

      loading: false,
    };
    this.onDismiss = this.onDismiss.bind(this);
  }

  triggerAlert = (color, message) => {
    this.setState({
      alertColor: color,
      alertMessage: message,
    });
    this.onDismiss();
    setTimeout(this.onDismiss, 3000);
  };

  onDismiss() {
    this.setState({ visible: !this.state.visible });
  }

  getCookie = (name) => {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      dropdownOpen: newArray,
      collapse: !this.state.collapse,
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
      accordion: state,
    });
  }

  toggleCustom(tab) {
    const prevState = this.state.custom;
    const state = prevState.map((x, index) => (tab === index ? !x : false));

    this.setState({
      custom: state,
    });
  }

  toggleFade() {
    this.setState({ fadeIn: !this.state.fadeIn });
  }

  componentDidMount() {
    pendingDonorRetrieval().then((result) => {
      this.setState({ loading: true });
      let data = result.data;
      if (data["code"] === 200) {
        this.setState({
          pendingDonors: data["items"],
          loading: false,
        });
      } else {
        this.setState({
          loading: false,
        });
      }
    });
  }
  retrievePendingDonors = () => {
    pendingDonorRetrieval().then((result) => {
      this.setState({ loading: true });
      let data = result.data;
      if (data["code"] === 200) {
        this.setState({
          loading: false,
          pendingDonors: data["items"],
        });
      } else {
        this.setState({
          loading: false,
        });
      }
    });
  };

  approveDonor = (approvingDonor) => {
    var data = new FormData();
    data.set("donorAddress", approvingDonor.eth_address);
    data.set("inspectorAddress", this.state.inspectorAddress);
    this.setState({ loading: true });

    donorApproval(data)
      .then((response) => {
        if (response.data["code"] === 200) {
          this.setState({ loading: false });
          this.retrievePendingDonors();
          this.triggerAlert("success", "Donor has been approved");
        } else {
          this.setState({ loading: false });
          this.triggerAlert("danger", response.data["message"]);
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .then(() => {
        this.setState({ loading: false });
      });
  };

  rejectDonor = (rejectingDonor) => {
    var data = new FormData();
    data.set("donorAddress", rejectingDonor.eth_address);
    data.set("inspectorAddress", this.state.inspectorAddress);

    donorReject(data)
      .then((response) => {
        this.setState({ loading: true });
        if (response.data["code"] === 200) {
          this.setState({
            rejectDonor: true,
            loading: false,
          });
          this.retrievePendingDonors();
          this.triggerAlert("success", "Donor has been rejected");
        } else {
          this.triggerAlert("danger", response.data["message"]);
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .then(() => {
        this.setState({
          rejectDonor: false,
          loading: false,
        });
      });
  };

  render() {
    const { pendingDonors } = this.state;

    if (!pendingDonors) {
      return [];
    }
    return (
      <LoadingOverlay
        active={this.state.loading}
        spinner
        text="Loading..."
        backgroundColor={"gray"}
        opacity="0.4"
        style={{ width: "100%" }}
      >
        <div className="animated fadeIn">
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Pending Donors
            </CardHeader>
            <CardBody>
              <Alert
                color={this.state.alertColor}
                isOpen={this.state.visible}
                toggle={this.onDismiss}
              >
                {this.state.alertMessage}
              </Alert>
              {pendingDonors.map((donor) => {
                return (
                  <Card className="mx-auto my-2" key={donor.username}>
                    <CardBody>
                      <h3>Username: {donor.username}</h3>
                      <ul>
                        <li key={donor.eth_address}>
                          Eth Account: {donor.eth_address}
                        </li>
                        <li key={donor.email}>Email Address: {donor.email}</li>
                        <li key={donor.card_number}>
                          Bank Account: {donor.card_number} - {donor.card_expiry_date}
                        </li>
                        <li key={donor.physical_address}>
                          Physical Address: {donor.physical_address}
                        </li>
                        <li key={donor.full_name}>
                          Full Name: {donor.full_name}
                        </li>
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
      </LoadingOverlay>
    );
  }
}
export default ManageDonors;
