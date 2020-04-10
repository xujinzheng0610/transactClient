import React, { Component, lazy, Suspense } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Alert,
  Progress,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { Bar, Doughnut, Line, Pie, Polar, Radar } from "react-chartjs-2";
import Moment from "react-moment";
import {
  PaymentInputsContainer,
  PaymentInputsWrapper,
} from "react-payment-inputs";
import images from "react-payment-inputs/images";
import { withRouter } from "react-router-dom";

import {
  retrieveProjectDetails,
  retrieveDonorsByProject,
  confirm,
  retrieveConfirmation,
} from "../../services/axios_api";

const pieColors = ["#FF5733", "#33FFE9", "#FF6384", "#36A2EB", "#FFCE56"];

class ProjectCharity extends Component {
  constructor(props) {
    super(props);
    var tempDate = new Date();
    var date =
      tempDate.getFullYear() +
      "-" +
      (tempDate.getMonth() + 1) +
      "-" +
      tempDate.getDate();

    this.state = {
      primary: false,
      project_id: this.props.match.params.projectId,
      project: {},
      donors: [],
      confirmations: [],
      total_confirmation: "",
      today: date,
      amount: "",
      image: "",
      pie: "",
      description: "",
      confirmationFinished: false,
      alertVisible: false,
      alertColor: "info",
      alertMessage: "I am an alert message",
    };
    this.togglePrimary = this.togglePrimary.bind(this);
  }

  componentDidMount() {
    retrieveProjectDetails(this.state.project_id)
      .then((response) => {
        let breakdownList = JSON.parse(response.data.result.breakdownList);
        let labelList = [];
        let dataList = [];
        let colorList = [];
        breakdownList.map((item, index) => {
          labelList.push(item.category);
          dataList.push(item.value);
          colorList.push(pieColors[index]);
          return null;
        });
        let pie = {
          labels: labelList,
          datasets: [
            {
              data: dataList,
              backgroundColor: colorList,
            },
          ],
        };

        this.setState({
          project: response.data.result,
          pie: pie,
        });
      })
      .catch((e) => {
        console.log(e);
      });

    retrieveDonorsByProject(this.state.project_id)
      .then((response) => {
        this.setState({
          donors: response.data.latestDonors,
        });
      })
      .catch((e) => {
        console.log(e);
      });

    retrieveConfirmation(this.state.project_id)
      .then((response) => {
        this.setState({
          confirmations: response.data.result.confirmations,
          total_confirmation: response.data.result.total_confirmation,
        });
        console.log(this.state.confirmations);
        console.log(this.state.total_confirmation);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  confirm = () => {
    var data = new FormData();
    data.set("amount", this.state.amount);
    data.set("project_id", this.state.project_id);
    data.set("description", this.state.description);
    data.set("charity_id", this.getCookie("charity_id"));

    confirm(data).then((response) => {
      this.triggerAlert("success", "Confirmation will be processed!");
      this.setState({
        amount: "",
        description: "",
        confirmationFinished: true,
      });
      this.componentDidMount();
    });
  };

  triggerAlert = (color, message) => {
    this.setState({
      alertColor: color,
      alertMessage: message,
    });
    this.onDismiss();
    setTimeout(this.onDismiss, 3000);
  };
  onDismiss = () => {
    this.setState({ alertVisible: !this.state.alertVisible });
  };

  getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return false;
  }

  updateValue = (type) => (e) => {
    this.setState({
      [type]: e.target.value,
    });
  };
  togglePrimary() {
    //     if(!this.state.primary&&!this.getCookie("donor_id")){
    //       this.props.history.push('/login/donor');
    //       return;
    //   }
    this.setState({
      primary: !this.state.primary,
      amount: "0",
      description: "",
      confirmationFinished: false,
    });
  }

  render() {
    return (
      <div style={{ height: "100%" }}>
        <style>
          {`.custom-tag {
                        max-width: 100%;
                        height: 30rem;
                        background: black;
                        }`}
        </style>
        <style type="text/css">{".hidden { display:none; }"}</style>

        <Container fluid className="pt-3 mb-3 ml-5">
          <Row style={{ width: "95%", alignContent: "center" }}>
            <Col xs="40" sm="12" md="8">
              <div className="custome-tag">
                <img
                  src={
                    "data:image/jpeg;charset=utf-8;base64," +
                    this.state.project.image
                  }
                  alt="project cover"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <h2>About This Project</h2>
              <div
                style={{
                  marginLeft: "2rem",
                  borderLeft: "6px solid",
                  borderLeftColor: "SkyBlue",
                }}
              >
                <p
                  className="mt-3 mb-3"
                  style={{
                    marginLeft: ".5rem",
                    fontStyle: "italic",
                    fontSize: "15px",
                  }}
                >
                  {this.state.project.description}
                </p>
              </div>
              <hr
                style={{
                  color: "primary",
                  backgroundColor: "primary",
                  height: 5,
                }}
              />
              <h2>About This Charity</h2>
              <p style={{ marginLeft: "2rem", fontSize: "16px" }}>
                {this.state.project.charity_description}
              </p>
              <hr
                style={{
                  color: "primary",
                  backgroundColor: "primary",
                  height: 5,
                }}
              />
              <h2>Money Allocation</h2>
              <div className="chart-wrapper">
                {this.state.pie && <Pie data={this.state.pie} />}
              </div>
              <hr
                style={{
                  color: "primary",
                  backgroundColor: "primary",
                  height: 5,
                }}
              />
              <h2>Recent Donations</h2>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Donations{" "}
                  <small className="text-muted">All donations</small>
                </CardHeader>
                <CardBody>
                  <Table responsive hover className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">User Name</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.donors.map((item) => {
                        return (
                          <tr>
                            <td>{item.donor}</td>
                            <td>${item.amount}</td>
                            <td>{item.donation_time}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
              <hr
                style={{
                  color: "primary",
                  backgroundColor: "primary",
                  height: 5,
                }}
              />
              <h2>Recent Confirmations</h2>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Confirmations{" "}
                  <small className="text-muted">All Confirmations</small>
                </CardHeader>
                <CardBody>
                  <Table responsive hover className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">Description</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.confirmations.map((item) => {
                        return (
                          <tr>
                            <td>{item.description}</td>
                            <td>${item.amount}</td>
                            <td>{item.confirmation_time}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
            <Col xs="12" sm="12" md="4">
              <p
                style={{
                  fontSize: "40px",
                  fontFamily: "Arial",
                  width: "fit-content",
                  marginBottom: "20px",
                }}
              >
                <strong>{this.state.project.projectName}</strong>
              </p>
              <h3
                style={{
                  width: "fit-content",
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    color: "grey",
                  }}
                >
                  By{" "}
                </span>
                <span
                  style={{
                    color: "black",
                  }}
                >
                  {this.state.project.charity_name}
                  {"\n"}
                </span>
              </h3>
              <h3
                style={{
                  width: "fit-content",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    color: "grey",
                  }}
                >
                  Expiry Date:{" "}
                </span>{" "}
                {this.state.project.expirationDate}
              </h3>
              <p
                className="mt-3 mb-0"
                style={{
                  width: "fit-content",
                  fontFamily: "monospace",
                  fontSize: "35px",
                }}
              >
                <strong>
                  ${this.state.project.actual_amount}/$
                  {this.state.project.fundTarget}
                </strong>
              </p>
              <h6 className="mt-0">
                <strong>
                  raised from {Object.keys(this.state.donors).length} donations
                </strong>
              </h6>
              <Progress
                animated
                color="info"
                value={
                  (this.state.project.actual_amount /
                    this.state.project.fundTarget) *
                  100
                }
                className="mb-3"
              >
                {(this.state.project.actual_amount /
                  this.state.project.fundTarget) *
                  100}
                %
              </Progress>
              <h6 className="mt-0" style={{ textAlign: "right" }}>
                <strong>
                  <Moment diff={this.state.today} unit="days">
                    {this.state.project.expirationDate}
                  </Moment>{" "}
                  more days
                </strong>
              </h6>
              <hr
                style={{
                  color: "primary",
                  backgroundColor: "primary",
                  height: 5,
                }}
              />

              <div>
                <Button block color="primary" onClick={this.togglePrimary}>
                  Make Confirmation
                </Button>
              </div>

              <hr
                style={{
                  color: "primary",
                  backgroundColor: "primary",
                  height: 5,
                }}
              />

              <ListGroup className="mt-3">
                <h2>Contact Information</h2>
                <ListGroupItem style={{ backgroundColor: "#F8F8FF" }}>
                  <strong>Organization: </strong>{" "}
                  {this.state.project.charity_name}
                </ListGroupItem>
                <ListGroupItem style={{ backgroundColor: "#F8F8FF" }}>
                  <strong>Phone: </strong> {this.state.project.charity_number}
                </ListGroupItem>
                <ListGroupItem style={{ backgroundColor: "#F8F8FF" }}>
                  <strong>Email: </strong> {this.state.project.charity_email}
                </ListGroupItem>
                <ListGroupItem style={{ backgroundColor: "#F8F8FF" }}>
                  <strong>Address: </strong>{" "}
                  {this.state.project.charity_address}
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </Container>
        <Modal
          isOpen={this.state.primary}
          toggle={this.togglePrimary}
          className={"modal-primary " + "modal-lg " + this.props.className}
          style={{ height: "80vh" }}
        >
          <ModalHeader toggle={this.togglePrimary}>Confirmation</ModalHeader>
          <ModalBody>
            <div className={this.state.confirmationFinished ? "hidden" : ""}>
              <h4>Confirmation</h4>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="disabled-input">Amount($)</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input
                    type="number"
                    id="disabled-input"
                    name="disabled-input"
                    onChange={this.updateValue("amount")}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="textarea-input">Description</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input
                    type="textarea"
                    name="textarea-input"
                    id="textarea-input"
                    rows="9"
                    placeholder="Content..."
                    onChange={this.updateValue("description")}
                  />
                </Col>
              </FormGroup>
            </div>

            <div className={this.state.confirmationFinished ? "" : "hidden"}>
              <Col
                md="12"
                style={{
                  textAlign: "center",
                  fontSize: "100px",
                  color: "green",
                }}
              >
                <i className="cui-check icons d-block mt-4"></i>
                <br></br>
                <h2>Confiramtion Finished!</h2>
              </Col>
            </div>

            <Alert
              color={this.state.alertColor}
              isOpen={this.state.alertVisible}
              toggle={this.onDismiss}
              style={{ position: "fixed", top: "2rem", right: "1rem" }}
            >
              {this.state.alertMessage}
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button
              className={this.state.confirmationFinished ? "hidden" : ""}
              color="primary"
              onClick={this.confirm}
            >
              Confirm!
            </Button>
            <Button color="secondary" onClick={this.togglePrimary}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default ProjectCharity;
