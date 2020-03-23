import React, { Component } from "react";
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

const donor_attributes = [
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
    display: "Full Name"
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

var charity_attributes = donor_attributes
charity_attributes.push({
  type: "description",
  logo: "icon-grid",
  display: "Description"
})


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
      alertMessage: "I am an alert message"
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

  onDismiss = () => {
    this.setState({ alertVisible: !this.state.alertVisible });
  };

  createAccount = () => {
    if(this.state.password !== this.state.repeatPassword){
      this.setState({
        alertColor: "danger",
        alertMessage: "Password Unmatched!"
      })
      this.onDismiss()
    }
  }

  render() {
    const attributes = this.state.type === "donor"? donor_attributes : charity_attributes
    return (
      <div className="app flex-row ">
        <Alert
          color={this.state.alertColor}
          isOpen={this.state.alertVisible}
          toggle={this.onDismiss}
          style={{ position: "fixed", top: "2rem", right: "1rem" }}
        >
          {this.state.alertMessage}
        </Alert>
        <Container className="mt-4">
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form>
                    <h1>Welcome to Join TransACT!</h1>
                    <p className="text-muted">Create your account</p>
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
                                    : "text"
                                }
                                onChange={this.updateValue(item.type)}
                                // placeholder={item.display}
                              />
                            </InputGroup>
                          );
                        })}

                    <Button color="success" block onClick={this.createAccount}>
                      Create Account
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;
