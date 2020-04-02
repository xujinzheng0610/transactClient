import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Alert
} from "reactstrap";
import {
  adminLogin,
  donorLogin,
  charityLogin
} from "../../../services/axios_api";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: this.checkType(),
      username: "",
      password: "",
      alertVisible: false,
      alertColor: "info",
      alertMessage: "I am an alert message",
    };
  }

  checkType = () => {
    if (
      ["donor", "charity", "admin"].indexOf(this.props.match.params.type) > -1
    ) {
      console.log("valid route");
      return this.props.match.params.type;
    } else {
      console.log("invalid route");
      window.location.replace("/home");
    }
  };

  componentDidMount() {}

  updateValue = type => e => {
    this.setState({
      [type]: e.target.value
    });
  };

  setCookie = (name, value, days) => {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  };

  getCookie = (name) => {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  login = () => {
    if (this.state.username !== "" && this.state.password !== "") {
      if (this.state.type === "admin") {
        adminLogin(this.state.username, this.state.password)
          .then(response => {
            if (response.data.code === 200) {
              //set local key
              this.setCookie("admin", response.data.eth_address, 1);
              window.location.replace("/admin");
            } else {
              this.triggerAlert("danger", response.data.message);
            }
          })
          .catch(e => console.log(e));
      } else if (this.state.type === "donor") {
        donorLogin(this.state.username, this.state.password)
        .then(response => {
          console.log(response.data)
          if (response.data.code === 200) {
            this.setCookie("donor_id", response.data.id, 1);
            this.setCookie("donor_username", response.data.username, 1);
            this.setCookie("donor_address", response.data.eth_address, 1);
            window.history.back();
          } else {
            this.triggerAlert("danger", response.data.message);
          }
        })
      } else if (this.state.type === "charity") {
        charityLogin(this.state.username, this.state.password)
        .then(response => {
          if (response.data.code === 200) {
            this.setCookie("charity_id", response.data.id, 1);
            this.setCookie("charity_username", response.data.username, 1);
            this.setCookie("charity_address", response.data.eth_address, 1);
            window.history.back();
          } else {
            this.triggerAlert("danger", response.data.message);
          }
        })
      } else {
        window.location.replace("/home");
      }
    } else {
      this.triggerAlert("danger", "Please key in both Username and Password.");
    }
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

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Alert
          color={this.state.alertColor}
          isOpen={this.state.alertVisible}
          toggle={this.onDismiss}
          style={{ position: "fixed", top: "2rem", right: "1rem" }}
        >
          {this.state.alertMessage}
        </Alert>
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form
                      onSubmit={e => {
                        e.preventDefault();
                        this.login();
                      }}
                    >
                      <h1>Login : {this.state.type}</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"> Username</i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          onChange={this.updateValue("username")}
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"> Password</i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          onChange={this.updateValue("password")}
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button
                            color="primary"
                            className="px-4"
                            onClick={this.login}
                          >
                            Login
                          </Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">
                            Forgot password?
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                {this.state.type === "admin" ? (
                  ""
                ) : (
                  <Card
                    className="text-white bg-primary py-5 d-md-down-none"
                    style={{ width: "44%" }}
                  >
                    <CardBody className="text-center">
                      <div>
                        <h2>Sign up</h2>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua.
                        </p>
                        <Link to={"/register/".concat(this.state.type)}>
                          <Button
                            color="primary"
                            className="mt-3"
                            active
                            tabIndex={-1}
                          >
                            Register Now!
                          </Button>
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                )}
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
