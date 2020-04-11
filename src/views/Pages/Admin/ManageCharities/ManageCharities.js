import React, { Component } from "react";
import LoadingOverlay from "react-loading-overlay";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Alert,
} from "reactstrap";

import {
  pendingCharityRetrieval,
  charityApproval,
  charityReject,
  downloadCertificate
} from "../../../../services/axios_api";

class ManageCharities extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: false,
      accordion: [true, false, false],
      custom: [true, false],
      status: "Closed",
      fadeIn: true,
      timeout: 300,

      pendingOrganizations: null,
      approveCharity: false,
      rejectCharity: false,
      inspectorAddress: this.getCookie("admin"),
      charityOrganizationAddress: null,

      visible: false,
      alertColor: "info",
      alertMessage: "I am an alert message",

      loading: false,
    };
  }

  triggerAlert = (color, message) => {
    this.setState({
      alertColor: color,
      alertMessage: message,
    });
    this.onDismiss();
    setTimeout(this.onDismiss, 3000);
  };

  onDismiss = () => {
    this.setState({ visible: !this.state.visible });
  };

  getCookie = (name) => {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  onExited() {
    this.setState({ status: "Closed" });
  }

  componentDidMount() {
    pendingCharityRetrieval().then((result) => {
      this.setState({ loading: true });
      let data = result.data;
      if (data["code"] === 200) {
        this.setState({
          loading: false,
          pendingOrganizations: data["items"],
        });
      } else {
        this.setState({
          loading: false,
        });
      }
    });
  }

  retrievePendingCharity = () => {
    pendingCharityRetrieval().then((result) => {
      let data = result.data;
      this.setState({ loading: true });
      if (data["code"] === 200) {
        this.setState({
          loading: false,
          pendingOrganizations: data["items"],
        });
      } else {
        this.setState({
          loading: false,
        });
      }
    });
  };

  approveCharity = (approvingCharity) => {
    var data = new FormData();
    data.set("charityAddress", approvingCharity.eth_address);
    data.set("inspectorAddress", this.state.inspectorAddress);
    this.setState({ loading: true });
    charityApproval(data)
      .then((response) => {
        if (response.data["code"] === 200) {
          this.setState({
            loading: false,
          });
          this.retrievePendingCharity();
          this.triggerAlert("success", "Charity has been approved");
        } else {
          this.triggerAlert("danger", response.data["message"]);
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .then(() => {
        this.setState({
          loading: false,
        });
      });
  };

  downloadCertificate = charityAddress => {
    downloadCertificate(charityAddress)
  }

  rejectCharity = (rejectingCharity) => {
    var data = new FormData();
    data.set("charityAddress", rejectingCharity.eth_address);
    data.set("inspectorAddress", this.state.inspectorAddress);
    this.setState({ loading: true });
    charityReject(data)
      .then((response) => {
        if (response.data["code"] === 200) {
          this.setState({ loading: false });
          this.retrievePendingCharity();
          this.triggerAlert("success", "Charity has been rejected");
        } else {
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

  render() {
    const { pendingOrganizations } = this.state;

    if (!pendingOrganizations) {
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
              <i className="fa fa-align-justify"></i> Pending Charity
              Organizations
            </CardHeader>
            <CardBody>
              <Alert
                color={this.state.alertColor}
                isOpen={this.state.visible}
                toggle={this.onDismiss}
              >
                {this.state.alertMessage}
              </Alert>
              {pendingOrganizations.map((organization) => {
                return (
                  <Card className="mx-auto my-2" key={organization.username}>
                    <CardBody>
                      <h3>Username: {organization.username}</h3>
                      <ul>
                        <li key={organization.email}>
                          Email Address: {organization.email}
                        </li>
                        <li key={organization.eth_address}>
                          Eth Address: {organization.eth_address}
                        </li>
                        <li key={organization.card_number}>
                          Bank Account: {organization.card_number} - {organization.card_expiry_date}
                        </li>
                        <li key={organization.physical_address}>
                          Physical Address: {organization.physical_address}
                        </li>
                        <li key={organization.full_name}>
                          Full Name: {organization.full_name}
                        </li>
                        <li key={organization.contact_number}>
                          Contact Number: {organization.contact_number}
                        </li>
                        <li key={organization.financial_info}>
                          Financial Information: {organization.financial_info}
                        </li>
                        <li key={organization.registration_hash}>
                          Registration Hash: {organization.registration_hash}
                        </li>
                        <li key="certificate">
                          Certificate File:
                          <span
                              style={{
                                color: "royalblue",
                                textDecoration: "underline",
                                cursor: "pointer",
                                marginLeft: "1rem",
                              }}
                              onClick={() => this.downloadCertificate(organization.eth_address)}
                            >
                              Download file
                          </span>
                        </li>
                        <li key={organization.description}>
                          Description: {organization.description}
                        </li>
                      </ul>
                      <Row>
                        <Col sm="6" style={{ textAlign: "center" }}>
                          <Button
                            outline
                            color="success"
                            onClick={() => this.approveCharity(organization)}
                          >
                            Approve
                          </Button>
                        </Col>
                        <Col sm="6" style={{ textAlign: "center" }}>
                          <Button
                            outline
                            color="danger"
                            onClick={() => this.rejectCharity(organization)}
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
export default ManageCharities;
