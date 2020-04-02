import React, { Component, Suspense } from "react";
import { Container, Row, Col, Card, CardBody, Form, InputGroup, InputGroupAddon, InputGroupText, Input, Button } from "reactstrap";
import { charityProfile, donorProfile } from "../../services/axios_api";

let donor_attributes = [
  {
    type: "username",
    logo: "icon-user",
    display: "Username", 
    value: "Donor 1"
  },
  {
    type: "email",
    logo: "icon-envelope",
    display: "Email",
    value: "Donor1@gmail.com"
  },
  {
    type: "eth_address",
    logo: "icon-key",
    display: "ETH Address", 
    value: "0xf7FE66d3F2512B035b674De9D084889bCB5f7897"
  },
  {
    type: "bank_account",
    logo: "icon-credit-card",
    display: "Bank Account",
    value: "DBS 123-4567-890"
  },
  {
    type: "physical_address",
    logo: "icon-location-pin",
    display: "Address",
    value: "Lol avenue 1, S12345"
  },
  {
    type: "full_name",
    logo: "icon-notebook",
    display: "Full Name",
    value: "John Wick"
  },
  {
    type: "contact_number",
    logo: "icon-phone",
    display: "Contact Number",
    value: "+65-93211665"
  }
];

let charity_attributes = [
  {
    type: "username",
    logo: "icon-user",
    display: "Username", 
    value: "Charity 1"
  },
  {
    type: "email",
    logo: "icon-envelope",
    display: "Email",
    value: "charity1@gmail.com"
  },
  {
    type: "eth_address",
    logo: "icon-key",
    display: "ETH Address", 
    value: "0xf7FE66d3F2512B035b674De9D084889bCB5f7897"
  },
  {
    type: "bank_account",
    logo: "icon-credit-card",
    display: "Bank Account",
    value: "DBS 123-4567-890"
  },
  {
    type: "physical_address",
    logo: "icon-location-pin",
    display: "Address",
    value: "Lol avenue 1, S12345"
  },
  {
    type: "full_name",
    logo: "icon-notebook",
    display: "Full Name",
    value: "John Wick"
  },
  {
    type: "contact_number",
    logo: "icon-phone",
    display: "Contact Number",
    value: "+65-93211665"
  },
  {
    type: "description",
    logo: "icon-grid",
    display: "Description",
    value:"we save animals"
  }
];

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: this.checkType(),
      disabled: true,
      alertVisible: false,
      alertColor: "info",
      alertMessage: "I am an alert message",
      loading: false,
      submitted: false,
    };
  }

  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  allowEdit() {
    this.setState( {disabled: !this.state.disabled} )
  }

  getUsersData() {
    this.state.type === "donor" ?
    donorProfile("0xcd1c56335D7b6c93345aeBD05Ea348a2f2526a0E") : charityProfile()
        .then(res => {
            const data = res.data
            console.log(data)

        })
        .catch((error) => {
            console.log(error)
        })
  }
  
  componentDidMount(){
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

  render() {
    const attributes =
      this.state.type === "donor" ? donor_attributes : charity_attributes;
    return (<div>
      <Suspense fallback={this.loading()}>
      </Suspense>
      <Container className="mt-3 mb-3">
        <Form>
          <h1>My TransACT Profile
            {/* element style - float right */}
          <Button  onClick = {this.allowEdit.bind(this)} className="fa fa-edit"></Button></h1>
          <p className="text-muted"></p>
          {attributes.map(item => {
            return (
              <InputGroup className="mb-3" key={item.type}>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className={item.logo}> {item.display}</i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  disabled = {(this.state.disabled)}
                  type={
                    ["password", "repeatPassword"].indexOf(
                      item.type
                    ) > -1
                      ? "password"
                      : "text"
                  }
                  // onChange={this.updateValue(item.type)}
                placeholder={item.value}>
                </Input>
              </InputGroup>
            );
          })}
          <Button
            color="success"
            block
            onClick={this.updateAccount}>
            Update Account
          </Button>
        </Form>
      </Container>
      
      <Container className="mt-3 mb-3">
        <Card>
          <CardBody>
            <h2
              style={{
                borderBottom: "2px solid #000",
                width: "fit-content",
                margin: "auto"
              }}
            >
              Contact Us
              </h2>
            <Row className="mt-3">
              <Col xs="12" sm="4">
                <div style={{ textAlign: "center" }}>
                  <i className="fa fa-mobile singleIcon"></i>
                  <p>
                    Call: +65 6666 8888
                        <br />
                    <span>Monday-Friday (9am-5pm)</span>
                  </p>
                </div>
              </Col>
              <Col xs="12" sm="4">
                <div style={{ textAlign: "center" }}>
                  <i className="fa fa-envelope-o singleIcon"></i>
                  <p>
                    Email: info@example.com
                        <br />
                    <span>Web: www.TRANSACT.com</span>
                  </p>
                </div>
              </Col>

              <Col xs="12" sm="4">
                <div style={{ textAlign: "center" }}>
                  <i className="fa fa-map-marker singleIcon"></i>
                  <p>
                    Location: 21 Kent Ridge
                        <br />
                    <span>NY 510000,Singapore </span>
                  </p>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
      <Container className="mb-5">
        <Card style={{ border: "0px" }}></Card>
      </Container>
    </div>)
  }

}

export default Profile