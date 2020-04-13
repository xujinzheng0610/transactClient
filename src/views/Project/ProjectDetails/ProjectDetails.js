import React, { Component } from "react";
import LoadingOverlay from "react-loading-overlay";
import {
  Button,
  Container,
  Input,
  Row,
  Col,
  Alert,
  Progress,
  ListGroup,
  ListGroupItem,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { Pie } from "react-chartjs-2";
import Moment from "react-moment";
import {
  PaymentInputsContainer,
  PaymentInputsWrapper,
} from "react-payment-inputs";
import images from "react-payment-inputs/images";

import {
  retrieveProjectDetails,
  retrieveDonorsByProject,
  makeDonation,
  retrieveConfirmation,
  donorProfile,
} from "../../../services/axios_api";

const pieColors = ["#FF5733", "#33FFE9", "#FF6384", "#36A2EB", "#FFCE56"];

class ProjectDetails extends Component {
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
      project_id: this.props.match.params.projectId,
      project: {},
      donors: [],
      today: date,
      modal: false,
      large: false,
      primary: false,
      amount: "0",
      image: "",
      custom: false,
      donationFinished: false,
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      anonymous: "false",
      pie: "",
      confirmations: [],
      total_confirmation: "",
      alertVisible: false,
      alertColor: "info",
      alertMessage: "I am an alert message",
      loading: true,
      modalloading: false 
    };
    this.togglePrimary = this.togglePrimary.bind(this);
    this.handleAnonymous = this.handleAnonymous.bind(this);
  }
  setAmount(amt) {
    if (!this.state.primary && !this.getCookie("donor_id")) {
      this.props.history.push("/login/donor");
      return;
    }
    console.log(amt);
    this.setState({
      cardNumber: "",
      expiryDate: "",
      primary: !this.state.primary,
      amount: amt,
      custom: false,
      donationFinished: false,
      anonymous: "false",
      cvc: "",
    });
    // donorProfile(this.getCookie("donor_address"))
    //   .then((res) => {
    //     let data = res.data;
    //     console.log(data);
    //     if (data.code === "200") {
    //       this.setState({
    //         cardNumber: data["card_number"],
    //         expiryDate: data["card_expiry_date"],
    //       });
    //     }
    //   })
    //   .catch((e) => console.log(e));
  }
  togglePrimary() {
    if (!this.state.primary && !this.getCookie("donor_id")) {
      window.location.replace("/login/donor");
      return;
    }
    this.setState({
      primary: !this.state.primary,
      amount: "0",
      custom: true,
      donationFinished: false,
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      anonymous: "false",
    });
    // donorProfile(this.getCookie("donor_address"))
    //   .then((res) => {
    //     let data = res.data;
    //     console.log(data);
    //     if (data.code === "200") {
    //       this.setState({
    //         cardNumber: data["card_number"],
    //         expiryDate: data["card_expiry_date"],
    //       });
    //     }
    //   })
    //   .catch((e) => console.log(e));
  }

  componentDidMount() {
    retrieveProjectDetails(this.props.match.params.projectId)
      .then((response) => {
        if(response.data.code === "400"){
            window.history.back();
            return;
        }

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

    retrieveDonorsByProject(this.props.match.params.projectId)
      .then((response) => {
        this.setState({
          donors: response.data.latestDonors,
          loading: false
        });
      })
      .catch((e) => {
        console.log(e);
      });

    retrieveConfirmation(this.props.match.params.projectId)
      .then((response) => {
        this.setState({
          confirmations: response.data.result.confirmations,
          total_confirmation: response.data.result.total_confirmation,
          loading: false
        });
        console.log(this.state.confirmations);
        console.log(this.state.total_confirmation);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  handleChangeCardNumber = (e) => {
    console.log(e);
    this.setState({ cardNumber: e.target.value });
  };
  handleChangeExpiryDate = (e) => {
    console.log(e);
    this.setState({ expiryDate: e.target.value });
  };
  handleChangeCVC = (e) => {
    console.log(e);
    this.setState({ cvc: e.target.value });
  };
  handleAnonymous = (e) => {
    console.log(e.target.value);
    this.setState({ anonymous: e.target.value });
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

  makeDonation = () => {
    var data = new FormData();
    this.setState({modalloading: true});
    data.set("amount", this.state.amount);
    data.set("project_id", this.state.project_id);
    data.set("donor_id", this.getCookie("donor_id"));
    data.set("donor_address", this.getCookie("donor_address"));
    data.set("anonymous", this.state.anonymous);

    if (this.state.cardNumber === "") {
      this.triggerAlert("danger", "Card Number Required!");
      return;
    }
    makeDonation(data)
      .then((response) => {
        if (response.data.code == "400") {
          this.triggerAlert("danger", response.data.error);
          this.setState({modalloading: false});
        } else {
          console.log(response);
          this.triggerAlert("success", "Donation has been received!");
          this.setState({
            // primary: false
            donationFinished: true,
            modalloading: false 
          });
          this.componentDidMount();
        }
      })
      .catch((e) => {
        this.triggerAlert("danger", "Error!");
      });
  };

  render() {
    return (
      <LoadingOverlay
        active={this.state.loading}
        spinner
        text="Loading..."
        backgroundColor={"gray"}
        opacity="0.4"
        style={{width:"100%"}}
      >
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
                  style={{
                    width: "100%",
                    height: "100%",
                    marginBottom: "1rem",
                  }}
                />
              </div>
              <h2>About This Project</h2>
              <p style={{ marginLeft: "2rem", fontSize: "16px" }}>
                {this.state.project.description}
              </p>
              <hr
                style={{
                  color: "primary",
                  backgroundColor: "primary",
                  height: 5,
                }}
              />
              <h2>About This Charity</h2>
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
                  {this.state.project.charity_description}
                </p>
              </div>
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
              <h2>All Confirmations</h2>
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
              <div className={
                  this.state.project.stop == "1"
                    ? "hidden"
                    : ""
                }>
                    <div
                className={
                  this.state.project.actual_amount >=
                  this.state.project.fundTarget
                    ? "hidden"
                    : ""
                }
              >
                <h2>Donate Now!</h2>
                <Row className="align-items-center">
                  <Col col="6" className="mb-3 mb-xl-0">
                    <Button block outline color="dark" disabled>
                      $10
                    </Button>
                  </Col>
                  <Col col="6" className="mb-3 mb-xl-0">
                    <Button
                      block
                      color="primary"
                      onClick={() => this.setAmount("10")}
                    >
                      Donate
                    </Button>
                  </Col>
                </Row>
                <Row className="align-items-center mt-3">
                  <Col col="6" className="mb-3 mb-xl-0">
                    <Button block outline color="dark" disabled>
                      $20
                    </Button>
                  </Col>
                  <Col col="6" className="mb-3 mb-xl-0">
                    <Button
                      block
                      color="primary"
                      onClick={() => this.setAmount("20")}
                    >
                      Donate
                    </Button>
                  </Col>
                </Row>
                <Row className="align-items-center mt-3">
                  <Col col="6" className="mb-3 mb-xl-0">
                    <Button block outline color="dark" disabled>
                      $30
                    </Button>
                  </Col>
                  <Col col="6" className="mb-3 mb-xl-0">
                    <Button
                      block
                      color="primary"
                      onClick={() => this.setAmount("30")}
                    >
                      Donate
                    </Button>
                  </Col>
                </Row>
                <Row className="align-items-center mt-3">
                  <Col col="6" className="mb-3 mb-xl-0">
                    <Button block outline color="dark" disabled>
                      Customised Amount
                    </Button>
                  </Col>
                  <Col col="6" className="mb-3 mb-xl-0">
                    {/* <Button block color="primary">Donate</Button> */}
                    <Button
                      block
                      color="primary"
                      onClick={this.togglePrimary}
                      className="mr-1"
                    >
                      Donate
                    </Button>
                  </Col>
                </Row>
              </div>
                    <div
                        className={
                        this.state.project.actual_amount >=
                        this.state.project.fundTarget
                            ? ""
                            : "hidden"
                        }
                    >
                        <h2>Donation Closed</h2>
                        <h3 style={{ color: "gray" }}>Thanks For Your Interest!</h3>
                    </div>

                </div>
                <div className={
                    this.state.project.stop == "0"
                        ? "hidden"
                        : ""
                    }>
                    <h1 style={{ color: "red" }}>Project Closed</h1>
              </div>
              
              <Modal
                isOpen={this.state.primary}
                toggle={this.togglePrimary}
                className={
                  "modal-primary " + "modal-lg " + this.props.className
                }
                style={{ height: "80vh" }}
              >
                <LoadingOverlay
                  active={this.state.modalloading}
                  spinner
                  text="Loading..."
                  backgroundColor={"gray"}
                  opacity="0.4"
                  style={{width:"100%"}}
                >
                <ModalHeader toggle={this.togglePrimary}>Donation</ModalHeader>
                <ModalBody>
                  <div className={this.state.donationFinished ? "hidden" : ""}>
                    <div className={this.state.custom ? "hidden" : ""}>
                      <h2>Your donation amount will be ${this.state.amount}</h2>
                      <br></br>
                      <h4 style={{ color: "gray" }}>
                        Please type in your bank card information
                      </h4>
                    </div>

                    <div className={this.state.custom ? "" : "hidden"}>
                      <h4>
                        Please type in your donation Amount and bank card
                        information
                      </h4>
                      <br></br>
                      <p style={{ color: "gray" }}>Donation Amount:</p>
                      <Input
                        style={{ width: "40%" }}
                        type="number"
                        placeholder="100($)"
                        value={this.state.amount}
                        onChange={this.updateValue("amount")}
                      ></Input>
                    </div>
                    <br></br>
                    <p style={{ color: "gray" }}>Bank Card Info:</p>
                    <PaymentInputsContainer>
                      {({
                        meta,
                        wrapperProps,
                        getCardImageProps,
                        getCardNumberProps,
                        getExpiryDateProps,
                        getCVCProps,
                      }) => (
                        <PaymentInputsWrapper {...wrapperProps}>
                          <svg {...getCardImageProps({ images })} />
                          <input
                            {...getCardNumberProps({
                              onChange: this.handleChangeCardNumber,
                            })}
                            value={this.state.cardNumber}
                          />
                          <input
                            {...getExpiryDateProps({
                              onChange: this.handleChangeExpiryDate,
                            })}
                            value={this.state.expiryDate}
                          />
                          <input
                            {...getCVCProps({ onChange: this.handleChangeCVC })}
                            value={this.state.cvc}
                          />
                        </PaymentInputsWrapper>
                      )}
                    </PaymentInputsContainer>
                    <br />
                    <br />
                    <Row className="ml-1">
                      <div className="radio">
                        <h4>Anonymous donation?</h4>
                        <div onChange={this.handleAnonymous.bind(this)}>
                          <input type="radio" value="true" checked={this.state.anonymous === "true"} />
                          Yes
                          <input
                            className="ml-5"
                            type="radio"
                            value="false"
                            checked={this.state.anonymous === "false"}
                          />
                          No
                        </div>
                      </div>
                    </Row>
                    <br></br>
                    <br></br>
                  </div>

                  <div className={this.state.donationFinished ? "" : "hidden"}>
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
                      <h2>Donation finished!</h2>
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
                    className={this.state.donationFinished ? "hidden" : ""}
                    color="primary"
                    onClick={this.makeDonation}
                  >
                    Donate!
                  </Button>
                  <Button color="secondary" onClick={this.togglePrimary}>
                    Close
                  </Button>
                </ModalFooter>
                </LoadingOverlay>
              </Modal>
              <hr
                style={{
                  color: "primary",
                  backgroundColor: "primary",
                  height: 5,
                }}
              />
              <ListGroup className="mt-3">
                <h2>Contact us</h2>
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
      </div>
      </LoadingOverlay>
    );
  }
}
export default ProjectDetails;
