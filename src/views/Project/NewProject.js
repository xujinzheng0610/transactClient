import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  FormGroup,
  Label,
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

class NewProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectId: this.props.match.params.id,
      breakdownList: [
        {
          "category":"operation",
          "value": 10
        },{
          "category":"beneficiary",
          "value": 90
        },{
          "category":"",
          "value": null
        },
      ],
      alertVisible: false,
      alertColor: "info",
      alertMessage: "I am an alert message",
      loading: false
    };
  }

  componentDidMount() {
    if(this.state.projectId !== "0"){
      //TODO: fetch current project info
    };
  }

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
          <Card>
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
                    <Input type="text" placeholder="Project Name" />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="date-input">
                      Project Category and Target
                    </Label>
                  </Col>
                  <Col xs="9" md="6" lg="3">
                    <Input type="select" placeholder="Project Category">
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
                    <Label htmlFor="date-input">
                      Project Category and Target
                    </Label>
                  </Col>
                  <Col  xs="9" md="6" lg="3">
                      <InputGroup>
                        <Input type="text" placeholder="Funding Target" />
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>SGD</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="date-input">Funding Expiration Date</Label>
                  </Col>
                  <Col xs="9" md="6" lg="3">
                    <Input
                      type="date"
                      id="date-input"
                      name="date-input"
                      placeholder="date"
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="text-input">Project Description</Label>
                  </Col>
                  <Col xs="12" md="6" >
                    <Input
                      type="textarea"
                      placeholder="Project Description"
                      rows="5"
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="text-input">Beneficiary List</Label>
                  </Col>
                  <Col xs="12" md="6">
                    <Input
                      type="textarea"
                      placeholder="Please use semi-comma to seperate: <A, NUS>; <B, NTU> "
                      rows="5"
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="text-input">Budget Breakdown</Label>
                  </Col>
                  <Col xs="12" md="9">
                    {this.state.breakdownList.map( item => {
                      return <div style={{ display: "inline-flex", marginTop:"1rem" }}>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText><i className="fa fa-star"></i></InputGroupText>
                        </InputGroupAddon>
                        <Input value={item.category} />
                      </InputGroup>
                      <span style={{margin:"auto", padding:"0 10px"}}>: </span>
                      <InputGroup>
                        <Input value={item.value} />
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>%</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <span style={{margin:"auto", padding:"0 10px", fontSize:"20px"}}>
                        {item.category === "" ? <i className="fa fa-plus-circle"></i>
                        :<i className="fa fa-minus-circle"></i>
                        }
                      </span>
                    </div>
                    })}
                    
                    
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="text-input">Pictures</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <p>TODO: implement file upload and picture review</p>
                  </Col>
                </FormGroup>
              </Form>
            </CardBody>
            <CardFooter style={{ textAlign: "center" }}>
              <Button outline color="primary">
                <i className="fa fa-dot-circle-o"></i> Submit
              </Button>
              <Button outline color="danger">
                <i className="fa fa-ban"></i> Reset
              </Button>
            </CardFooter>
          </Card>
        </LoadingOverlay>
      </div>
    );
  }
}

export default NewProject;
