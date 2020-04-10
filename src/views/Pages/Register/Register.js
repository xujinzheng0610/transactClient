import React, { Component} from "react";
import {
  Button,
  Card,
  CardBody,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Col,
  Alert
} from "reactstrap";
import LoadingOverlay from "react-loading-overlay";

import { charityRegister, donorRegister } from "../../../services/axios_api";

let donor_attributes = [
  {
    type: "username",
    logo: "icon-user",
    display: "Username"
  },
  {
    type: "email",
    logo: "icon-envelope",
    display: "Email"
  },
  {
    type: "password",
    logo: "icon-lock",
    display: "Password"
  },
  {
    type: "repeatPassword",
    logo: "icon-lock",
    display: "Repeat Password"
  },
  {
    type: "eth_address",
    logo: "icon-key",
    display: "ETH Address"
  },
  {
    type: "bank_account",
    logo: "icon-credit-card",
    display: "Bank Account"
  },
  {
    type: "physical_address",
    logo: "icon-location-pin",
    display: "Address"
  },
  {
    type: "full_name",
    logo: "icon-notebook",
    display: "Display Name"
  },
  {
    type: "contact_number",
    logo: "icon-phone",
    display: "Contact Number"
  },
  {
    type: "financial_info",
    logo: "icon-handbag",
    display: "Financial Info"
  }
];

let charity_attributes = [...donor_attributes];
charity_attributes.push({
  type: "description",
  logo: "icon-grid",
  display: "Description"
});

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: this.checkType(),
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
      eth_address: "",
      bank_account: "",
      physical_address: "",
      full_name: "",
      contact_number: "",
      financial_info: "",
      description: "",
      alertVisible: false,
      alertColor: "info",
      alertMessage: "I am an alert message",
      loading: false,
      submitted: false,
    }; 
  }

  checkType = () => {
    if (["donor", "charity"].indexOf(this.props.match.params.type) > -1) {
      console.log("valid route");
      return this.props.match.params.type;
    } else {
      console.log("invalid route");
      window.location.replace("/home");
    }
  };

  updateValue = type => e => {
    this.setState({
      [type]: e.target.value
    });
  };

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

  createAccount = () => {
    if (this.state.password !== this.state.repeatPassword) {
      this.triggerAlert("danger", "Password unmatched!");
    } else if (this.state.username === "") {
      this.triggerAlert("danger", "Username is required!");
    } else if ( this.state.username.includes(' ')){
      this.triggerAlert("danger", "Cannot have space in your username");
    }else if (this.state.email === "") {
      this.triggerAlert("danger", "Email is required!");
    } else if (this.state.password === "") {
      this.triggerAlert("danger", "Paasword is required!");
    } else if (this.state.eth_address === "") {
      this.triggerAlert("danger", "ETH Address is required!");
    } else {
      var data = new FormData();
      data.set("username", this.state.username);
      data.set("email", this.state.email);
      data.set("password", this.state.password);
      data.set("eth_address", this.state.eth_address);
      data.set("bank_account", this.state.bank_account);
      data.set("physical_address", this.state.physical_address);
      data.set("full_name", this.state.full_name);
      data.set("contact_number", this.state.contact_number);
      data.set("financial_info", this.state.financial_info);
      if (this.state.type === "charity") {
        data.set("description", this.state.description);
        this.setState({ loading: true });
        charityRegister(data)
          .then(response => {
            if (response.data["code"] === 200) {
              this.setState({ submitted: true });
            } else {
              this.triggerAlert("danger", response.data["message"]);
            }
          })
          .catch(e => {
            console.log(e);
          })
          .then(() => {
            this.setState({ loading: false });
          });
      } else {
        this.setState({ loading: true });
        donorRegister(data)
          .then(response => {
            if (response.data["code"] === 200) {
              this.setState({ submitted: true });
            } else {
              this.triggerAlert("danger", response.data["message"]);
            }
          })
          .catch(e => {
            console.log(e);
          })
          .then(() => {
            this.setState({ loading: false });
          });
      }
    }
  };

  render() {
    const attributes =
      this.state.type === "donor" ? donor_attributes : charity_attributes;
    return (
      <div className="app ">
        <Alert
          color={this.state.alertColor}
          isOpen={this.state.alertVisible}
          toggle={this.onDismiss}
          style={{ position: "fixed", top: "2rem", right: "1rem" }}
        >
          {this.state.alertMessage}
        </Alert>
        <LoadingOverlay
          active={this.state.loading}
          spinner
          text="Loading..."
          backgroundColor={"gray"}
          opacity="0.4"
          style={{width:"100%"}}
        >
          <Container className="mt-4">
            <Row className="justify-content-center">
              <Col md="9" lg="7" xl="6">
                <Card className="mx-4">
                  <CardBody className="p-4">
                    {this.state.submitted ? (
                      <div>
                        <h2>
                          Your registration has been submitted successfully!
                        </h2>
                        <h4>Please wait for platform approval.</h4>
                        <h4>
                          {" "}
                          Go back to <a href="/home">Home</a>.
                        </h4>
                      </div>
                    ) : (
                      <Form>
                        <h1>Welcome to Join TransACT!</h1>
                        <p className="text-muted">
                          Create your {this.state.type} account
                        </p>
                        {attributes.map(item => {
                          return (
                            <InputGroup className="mb-3" key={item.type}>
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className={item.logo}> {item.display}</i>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type={
                                  ["password", "repeatPassword"].indexOf(
                                    item.type
                                  ) > -1
                                    ? "password"
                                    : item.type === "description" ? "textarea" : "text"
                                }

                                rows="9"
                                onChange={this.updateValue(item.type)}
                                // placeholder={item.display}
                              />
                            </InputGroup>
                          );
                        })}
                        <Button
                          color="success"
                          block
                          onClick={this.createAccount}
                        >
                          Create Account
                        </Button>
                      </Form>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </LoadingOverlay>
      </div>
    );
  }
}

export default Register;
