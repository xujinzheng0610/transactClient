import React, { Component } from "react";
import {
  Alert,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Form,
  FormGroup,
  Input,
  Button,
  Progress,
} from "reactstrap";
import {
  charityProfile,
  donorProfile,
  charityUpdate,
  donorUpdate,
  getProjectByCharity,
  getProjectByDonor,
} from "../../services/axios_api";
import LoadingOverlay from "react-loading-overlay";
import "./profile.css";

let donor_attributes = [
  {
    type: "username",
    logo: "icon-user",
    display: "Username",
  },
  {
    type: "email",
    logo: "icon-envelope",
    display: "Email",
  },
  {
    type: "password",
    logo: "icon-lock",
    display: "Password",
  },
  {
    type: "repeatPassword",
    logo: "icon-lock",
    display: "Repeat Password",
  },
  {
    type: "eth_address",
    logo: "icon-key",
    display: "ETH Address",
  },
  {
    type: "bank_account",
    logo: "icon-credit-card",
    display: "Bank Account",
  },
  {
    type: "physical_address",
    logo: "icon-location-pin",
    display: "Address",
  },
  {
    type: "full_name",
    logo: "icon-notebook",
    display: "Display Name",
  },
  {
    type: "contact_number",
    logo: "icon-phone",
    display: "Contact Number",
  },
  {
    type: "financial_info",
    logo: "icon-handbag",
    display: "Financial Info",
  },
];

let charity_attributes = [...donor_attributes];
charity_attributes.push({
  type: "description",
  logo: "icon-grid",
  display: "Description",
});

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: this.checkAddress(),
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
      projectData: [],
      isLoaded: false,
      type: this.checkType(),
      userData: [],
      editMode: false,
      updatedValue: false,
      alertVisible: false,
      alertColor: "info",
      alertMessage: "I am an alert message",
      loading: false,
      submitted: false,
    };
  }

  allowEdit() {
    this.setState({ editMode: true });
  }

  getUsersData() {
    if (this.state.type === "donor") {
      donorProfile(this.state.address).then(
        (result) => {
          let data = result.data;
          if (data.code === "200") {
            this.setState({
              username: data["username"],
              email: data["email"],
              eth_address: this.state.address,
              password: data["password"],
              repeatPassword: data["password"],
              bank_account: data["bank_account"],
              physical_address: data["physical_address"],
              full_name: data["full_name"],
              financial_info: data["financial_info"],
              contact_number: data["contact_number"],
            });
          } else {
            this.triggerAlert("danger", data.message)
          }
        },
        (error) => {
          console.log(error);
        }
      );
      getProjectByDonor(this.state.address).then(
        (result) => {
        console.log(result.data)
        let data = result.data;
        this.setState({ projectData: data["items"] });
      });
    } else {
      charityProfile(this.state.address).then(
        (result) => {
          let data = result.data;
          console.log(data);
          if (data.code[0] === 200) {
            this.setState({
              username: data["username"],
              email: data["email"],
              eth_address: this.state.address,
              password: data["password"],
              repeatPassword: data["password"],
              bank_account: data["bank_account"],
              physical_address: data["physical_address"],
              full_name: data["full_name"],
              financial_info: data["financial_info"],
              contact_number: data["contact_number"],
              description: data["description"],
            });
          } else {
            //window.history.back()
          }
        },
        (error) => {
          console.log(error);
          //window.history.back()
        }
      );
      getProjectByCharity(this.state.address).then(
        (result) => {
          if (result.data.code === 200){
            this.setState({ projectData: result.data["items"] });
          }else{
            this.triggerAlert("danger", result.data.message)
          }
      });
    }
  }

  updateProfile = () => {
    if (this.state.password !== this.state.repeatPassword) {
      this.triggerAlert("danger", "Password unmatched!");
    } else if (this.state.username === "") {
      this.triggerAlert("danger", "Username is required!");
    } else if (this.state.email === "") {
      this.triggerAlert("danger", "Email is required!");
    } else if (this.state.password === "") {
      this.triggerAlert("danger", "Paasword is required!");
    } else if (this.state.eth_address === "") {
      this.triggerAlert("danger", "ETH Address is required!");
    } else {
      var data = new FormData();
      data.set("username", this.state.username);
      data.set("eth_address", this.state.address);
      data.set("email", this.state.email);
      data.set("password", this.state.password);
      data.set("eth_address", this.state.eth_address);
      data.set("bank_account", this.state.bank_account);
      data.set("physical_address", this.state.physical_address);
      data.set("full_name", this.state.full_name);
      data.set("financial_info", this.state.financial_info);
      data.set("contact_number", this.state.contact_number);
      if (this.state.type === "charity") {
        data.set("description", this.state.description);
        this.setState({ loading: true });
        charityUpdate(data)
          .then((response) => {
            if (response.data["code"] === 200) {
              this.setState({ updated: true });
              window.location.reload(true);
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
      } else {
        this.setState({ loading: true });
        donorUpdate(data)
          .then((response) => {
            if (response.data["code"] === 200) {
              this.setState({ updated: true });
              window.location.reload(true);
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
      }
    }
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

  componentDidMount() {
    if (this.state.type === "donor") {
      this.setState({ userData: donor_attributes });
    } else {
      this.setState({ userData: charity_attributes });
    }

    this.getUsersData();
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

  checkAddress = () => {
    console.log("valid route");
    return this.props.match.params.address;
  };

  updateValue = (type) => (e) => {
    this.setState({
      [type]: e.target.value,
      updatedValue: true,
    });
  };

  render() {
    return (
      <div>
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
          style={{ width: "100%" }}
        >
          <Container className="pt-4">
            <Card style={{ border: "none" }} className="mb-0">
              <CardBody>
                {this.state.editMode ? (
                  <h2>
                    Hi {this.state.full_name}! Edit your profile.
                    <Button
                      outline
                      color="primary"
                      disabled={!this.state.updatedValue}
                      onClick={this.updateProfile}
                      style={{ float: "right" }}
                    >
                      Update Account
                    </Button>
                  </h2>
                ) : (
                  <h2>
                    Hi {this.state.full_name}! Welcome to your profile.
                    <Button
                      outline
                      color="primary"
                      onClick={this.allowEdit.bind(this)}
                      style={{ float: "right" }}
                    >
                      Edit Profile
                    </Button>
                  </h2>
                )}
                <Form
                  encType="multipart/form-data"
                  className="form-horizontal mt-4 ml-5 mr-5"
                  style={{ width: "80%" }}
                >
                  {this.state.userData.map((item) => {
                    if (
                      !this.state.editMode &&
                      ["password", "repeatPassword"].indexOf(item.type) > -1
                    )
                      return null;
                    return (
                      <FormGroup
                        row
                        className={
                          this.state.editMode ? "editMode" : "displayMode"
                        }
                        key={item.type}
                      >
                        <Col md="2">
                          <Label>{item.display}:</Label>
                        </Col>
                        <Col xs="9" md="6">
                          {this.state.editMode ? (
                            <Input
                              type={
                                ["password", "repeatPassword"].indexOf(
                                  item.type
                                ) > -1
                                  ? "password"
                                  : item.type === "description"
                                  ? "textarea"
                                  : "text"
                              }
                              disabled={
                                [
                                  "eth_address",
                                  "registration_hash",
                                  "username",
                                ].indexOf(item.type) > -1
                                  ? true
                                  : this.state.disabled
                              }
                              value={this.state[item.type]}
                              onChange={this.updateValue(item.type)}
                              rows="5"
                            />
                          ) : (
                            <p>{this.state[item.type]}</p>
                          )}
                        </Col>
                      </FormGroup>
                    );
                  })}
                </Form>
              </CardBody>
            </Card>
            <Card style={{ border: "none" }}>
              <CardBody>
                <h2>Involved Projects</h2>
                {this.state.projectData.map((project) => {
                  let expirationDate = new Date(project.expirationDate);
                  let today = new Date();
                  return (
                    <Card className="mt-3" key={project.projectName}>
                      <CardBody>
                        <h3>
                          {project.projectName}
                          {project.approval_hash === ""
                            ? " - Wait for approval"
                            : expirationDate > today
                            ? " - Fundrasing Ongoing"
                            : " - Claiming Required"}
                        </h3>
                        <p className="mb-0">
                          <strong>Target:</strong> ${project.fundTarget}
                          <strong className="ml-3">
                            Expiration Date:
                          </strong>{" "}
                          {project.expirationDate}
                          <strong className="ml-3">
                            Donation Amount:
                          </strong>{" "}
                          {project.actual_amount}
                        </p>
                        <Progress
                          animated
                          color="info"
                          value={
                            (project.actual_amount / project.fundTarget) * 100
                          }
                          className="mb-3"
                        >
                          {(project.actual_amount / project.fundTarget) * 100}%
                        </Progress>

                        {this.state.type === "donor" ? (
                          <div>
                            <h3 key={project.amount}>
                              You have contributed{" "}
                              <strong style={{ color: "royalblue" }}>
                                {" "}
                                {project.amount}{" "}
                              </strong>
                              dollars!
                            </h3>
                            <Button
                              outline
                              color="success"
                              onClick={() => {
                                window.location.replace(`/project/${project._id}`);
                              }}
                            >
                              View More
                            </Button>
                          </div>
                        ):(
                          <div>
                            <Button
                              outline
                              color="success"
                              onClick={() => {
                                window.location.replace(`/project_charity/${project._id}`);
                              }}
                            >
                              View More
                            </Button>
                            <Button
                              outline
                              color="primary"
                              className="ml-3"
                              onClick={() => {
                                window.location.replace(
                                  `/projectNew/${project._id}`
                                );
                              }}
                            >
                              Edit
                            </Button>
                          </div>
                        )
                      }

                      </CardBody>
                    </Card>
                  );
                })}
              </CardBody>
            </Card>
          </Container>
        </LoadingOverlay>
      </div>
    );
  }
}

export default Profile;
