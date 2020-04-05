import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  FormGroup,
  Label,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Col,
  Alert,
} from "reactstrap";
import LoadingOverlay from "react-loading-overlay";
import { saveProject, downloadBeneficiaryFormat} from "../../services/axios_api";
import "./project.css";

class NewProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      charityAddress: this.getCookie("donor_address"),
      projectId: this.props.match.params.id,
      projectName: "",
      projectCategory: "Education",
      fundTarget: "",
      expirationDate: "",
      description: "",
      beneficiaryList: "",
      breakdownList: [],
      breakdownCategory: "Beneficiary",
      breakdownValue: 100,
      newImage: "",
      imagePreviewUrl: "",
      alertVisible: false,
      alertColor: "info",
      alertMessage: "I am an alert message",
      loading: false,
      submitted: false,
    };
  }

  componentDidMount() {
    if (this.state.projectId !== "0") {
      //TODO: fetch current project info
    }
  }

  getCookie = (name) => {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  updateValue = (type) => (e) => {
    this.setState({
      [type]: e.target.value,
    });
  };

  updateImage = () => (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        newImage: file,
        imagePreviewUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  uploadBeneficisryList = () => (e) => {
    this.setState({
      beneficiaryList: e.target.files[0],
    });
  };

  saveProject = () => {
    let budgetAmountList = [];
    let percentage = 0;
    let beneficiaryGainedRatio = 0;
    this.state.breakdownList.map((item) => {
      budgetAmountList.push({
        category: item.category,
        value: (item.value / 100) * this.state.fundTarget,
      });
      percentage += parseInt(item.value);
      if (item.category === "Beneficiary") {
        beneficiaryGainedRatio = parseInt(item.value);
      }
      return null;
    });

    if (this.state.newImage === "") {
      this.triggerAlert("danger", "Please upload project image.");
    } else if (this.state.beneficiaryList === "") {
      this.triggerAlert("danger", "Please upload beneficiary list excel file.");
    } else if (percentage !== 100) {
      this.triggerAlert("danger", "Please sum the breakdown to 100.");
    } else if (beneficiaryGainedRatio <= 0) {
      this.triggerAlert(
        "danger",
        "Please assign beficiary ratio in budget breakdown."
      );
    } else if (
      this.state.projectName === "" ||
      this.state.fundTarget === "" ||
      this.state.expirationDate === "" ||
      this.state.description === ""
    ) {
      this.triggerAlert("danger", "Please fill in all values");
    } else {
      let data = new FormData();
      data.set("charityAddress", this.getCookie("charity_address"));
      data.set("projectId", this.state.projectId);
      data.set("projectName", this.state.projectName);
      data.set("projectCategory", this.state.projectCategory);
      data.set("fundTarget", this.state.fundTarget);
      data.set("expirationDate", this.state.expirationDate);
      data.set("description", this.state.description);
      data.set("breakdownList", budgetAmountList);
      data.set("beneficiaryGainedRatio", beneficiaryGainedRatio);

      data.append(
        "beneficiaryList",
        this.state.beneficiaryList,
        this.state.beneficiaryList.name
      );
      data.append(
        "projectCover",
        this.state.newImage,
        this.state.newImage.name
      );

      this.setState({ loading: true });
      saveProject(data)
        .then((response) => {
          if (response.data.code === 200) {
            this.setState({ submitted: true });
            let message = this.state.projectName + " has been successfullt created.";
            this.triggerAlert("success", message);
          } else {
            this.triggerAlert("danger", response.data.message);
          }
        })
        .catch((e) => console.log(e))
        .then(() => {
          this.setState({ loading: false });
        });
    }
  };

  addBreakdown = () => {
    let breakdownList = this.state.breakdownList;
    breakdownList.push({
      category: this.state.breakdownCategory,
      value: this.state.breakdownValue,
    });
    this.setState({
      breakdownList: breakdownList,
      breakdownCategory: "",
      breakdownValue: "",
    });
  };

  removeBreakdown = (category) => {
    let breakdownList = this.state.breakdownList.filter(
      (item) => item.category !== category
    );
    this.setState({
      breakdownList: breakdownList,
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

  render() {
    return (
      <div>
        <Alert
          color={this.state.alertColor}
          isOpen={this.state.alertVisible}
          toggle={this.onDismiss}
          style={{
            position: "fixed",
            top: "3.5rem",
            right: "1rem",
            zIndex: "999",
          }}
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
          <Card>
            {this.state.submitted ? (
              <CardBody>
                <h2>
                  Your porject: " {this.state.projectName} " has been submitted.
                </h2>
                <h4>Please wait for platform approval.</h4>
                <h4>
                  {" "}
                  Go back to <a href="/home">Home</a>.
                </h4>
              </CardBody>
            ) : (
              <div>
                <CardBody>
                  {this.state.projectId === "0" ? (
                    <h2>Create New Project</h2>
                  ) : (
                    <h2>Update Project</h2>
                  )}
                  <Form
                    encType="multipart/form-data"
                    className="form-horizontal mt-4"
                  >
                    <FormGroup row>
                      <Col md="3">
                        <Label>Project Name</Label>
                      </Col>
                      <Col xs="9" md="6" lg="3">
                        <Input
                          type="text"
                          placeholder="Project Name"
                          value={this.state.projectName}
                          onChange={this.updateValue("projectName")}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="date-input">Project Category</Label>
                      </Col>
                      <Col xs="9" md="6" lg="3">
                        <Input
                          type="select"
                          placeholder="Project Category"
                          value={this.state.projectCategory}
                          onChange={this.updateValue("projectCategory")}
                        >
                          <option value="Education">Education</option>
                          <option value="Welfare">Welfare</option>
                          <option value="Girls">Girls</option>
                          <option value="Disabled">Disabled</option>
                          <option value="Property">Property</option>
                        </Input>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="date-input">Funding Target</Label>
                      </Col>
                      <Col xs="9" md="6" lg="3">
                        <InputGroup>
                          <Input
                            type="text"
                            placeholder="Funding Target"
                            value={this.state.fundTarget}
                            onChange={this.updateValue("fundTarget")}
                          />
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>SGD</InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="date-input">
                          Funding Expiration Date
                        </Label>
                      </Col>
                      <Col xs="9" md="6" lg="3">
                        <Input
                          type="date"
                          id="date-input"
                          name="date-input"
                          placeholder="date"
                          value={this.state.expirationDate}
                          onChange={this.updateValue("expirationDate")}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="text-input">Project Description</Label>
                      </Col>
                      <Col xs="12" md="6">
                        <Input
                          type="textarea"
                          placeholder="Project Description"
                          rows="5"
                          value={this.state.description}
                          onChange={this.updateValue("description")}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="text-input">
                          Beneficiary List File (.xlsx)   
                          <span style={{color: "royalblue", textDecoration: "underline", cursor: "pointer", marginLeft:"1rem"}} onClick={() => downloadBeneficiaryFormat()}> 
                           Sample
                          </span> 
                        </Label>
                      </Col>
                      <Col xs="12" md="6">
                        <Input
                          type="file"
                          accept=".xlsx"
                          onChange={this.uploadBeneficisryList()}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="text-input">Budget Breakdown</Label>
                      </Col>
                      <Col xs="12" md="9">
                        {this.state.breakdownList.map((item) => {
                          return (
                            <div key={item.category}>
                              <p>
                                {item.category} : {item.value}%
                                <span
                                  style={{
                                    margin: "auto",
                                    padding: "0 10px",
                                    fontSize: "20px",
                                  }}
                                  onClick={() =>
                                    this.removeBreakdown(item.category)
                                  }
                                >
                                  <i className="fa fa-minus-circle"></i>
                                </span>
                              </p>
                            </div>
                          );
                        })}

                        <div style={{ display: "inline-flex" }}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="fa fa-star"></i>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              value={this.state.breakdownCategory}
                              onChange={this.updateValue("breakdownCategory")}
                            />
                          </InputGroup>
                          <span style={{ margin: "auto", padding: "0 10px" }}>
                            :{" "}
                          </span>
                          <InputGroup>
                            <Input
                              value={this.state.breakdownValue}
                              onChange={this.updateValue("breakdownValue")}
                            />
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>%</InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                          <span
                            style={{
                              margin: "auto",
                              padding: "0 10px",
                              fontSize: "20px",
                            }}
                            onClick={() => this.addBreakdown()}
                          >
                            <i className="fa fa-plus-circle"></i>
                          </span>
                        </div>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="text-input">
                          Project Cover Image (.jpg)
                        </Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input
                          type="file"
                          accept=".jpg"
                          onChange={this.updateImage()}
                        />
                        <img
                          className="previewImage"
                          src={this.state.imagePreviewUrl}
                          alt=""
                        />
                      </Col>
                    </FormGroup>
                  </Form>
                </CardBody>
                <CardFooter style={{ textAlign: "center" }}>
                  <Button
                    outline
                    color="primary"
                    onClick={() => this.saveProject()}
                  >
                    Submit
                  </Button>
                  <Button
                    outline
                    color="danger"
                    onClick={() => window.location.reload()}
                  >
                    Reset
                  </Button>
                </CardFooter>
              </div>
            )}
          </Card>
        </LoadingOverlay>
      </div>
    );
  }
}

export default NewProject;
