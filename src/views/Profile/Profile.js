import React, { Component, Suspense } from "react";
import { Container, Row, Col, Card, CardBody, Form, InputGroup, InputGroupAddon, InputGroupText, Input, Button } from "reactstrap";
import { charityProfile, donorProfile, charityUpdate, donorUpdate } from "../../services/axios_api";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: "0x0b37411a8b028DCCB0c93fa34441305d809c0823",
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
      isLoaded: false,
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
    donorProfile(this.state.address).then(
        result => {
        console.log("checkinginging");
        let data = result.data;
        console.log(data);
        let donor_attributes = [
            {
              type: "username",
              logo: "icon-user",
              display: "Username", 
              value: data["username"]
            },
            {
              type: "email",
              logo: "icon-envelope",
              display: "Email",
              value: data["email"]
            },
            {
              type: "eth_address",
              logo: "icon-key",
              display: "ETH Address", 
              value: data["eth_address"]
            },
            {
            type: "password",
            logo: "icon-key",
            display: "Password", 
            value: "*****"
            },
            {
            type: "repeatPassword",
            logo: "icon-key",
            display: "Repeat Password", 
            value: "*****"
            },
            {
            type: "bank_account",
            logo: "icon-credit-card",
            display: "Bank Account",
            value: data["bank_account"]
            },
            {
            type: "physical_address",
            logo: "icon-location-pin",
            display: "Address",
            value: data["physical_address"]
            },
            {
            type: "full_name",
            logo: "icon-notebook",
            display: "Full Name",
            value: data["full_name"]
            },
            {
            type: "contact_number",
            logo: "icon-phone",
            display: "Contact Number",
            value: data["contact_number"]
            },
            {
            type: "registration_hash",
            logo: "icon-phone",
            display: "Registration Hash",
            value: data["registration_hash"]
            }
        ] 
        this.setState({userData: donor_attributes, username:data["username"],email:data["email"], eth_address:this.state.address
    , password:data["password"], repeatPassword:data["repeatPassword"], bank_account:data["bank_account"], physical_address:data["physical_address"],
    full_name:data["full_name"],contact_number:data["contact_number"]});
        },      
        error => {
        this.setState({
            isLoaded: true,
            error
        });
        }
    ) : 
    charityProfile(this.state.address).then(
        result => {
        console.log("checkinginging");
        let data = result.data;
        console.log(data);
        let charity_attributes = [
            {
              type: "username",
              logo: "icon-user",
              display: "Username", 
              value: data["username"]
            },
            {
              type: "email",
              logo: "icon-envelope",
              display: "Email",
              value: data["email"]
            },
            {
              type: "eth_address",
              logo: "icon-key",
              display: "ETH Address", 
              value: data["eth_address"]
            },
            {
            type: "password",
            logo: "icon-key",
            display: "Password", 
            value: "*****"
            },
            {
            type: "repeatPassword",
            logo: "icon-key",
            display: "Repeat Password", 
            value: "*****"
            },
            {
            type: "bank_account",
            logo: "icon-credit-card",
            display: "Bank Account",
            value: data["bank_account"]
            },
            {
            type: "physical_address",
            logo: "icon-location-pin",
            display: "Address",
            value: data["physical_address"]
            },
            {
            type: "name",
            logo: "icon-notebook",
            display: "Full Name",
            value: data["name"]
            },
            {
            type: "contact_number",
            logo: "icon-phone",
            display: "Contact Number",
            value: data["contact_number"]
            },
            {
            type: "description",
            logo: "icon-phone",
            display: "Description",
            value: data["description"]
            },
            {
            type: "registration_hash",
            logo: "icon-phone",
            display: "Registration Hash",
            value: data["registration_hash"]
            }
        ] 
        this.setState({userData: charity_attributes, username:data["username"],email:data["email"], eth_address:this.state.address
        , password:data["password"], repeatPassword:data["repeatPassword"], bank_account:data["bank_account"], physical_address:data["physical_address"],
        full_name:data["name"],contact_number:data["contact_number"], description:data["description"]});
        },      
        error => {
        this.setState({
            isLoaded: true,
            error
        });
        }
    ); 
  }

  updateProfile = () => {
    // if (this.state.password !== this.state.repeatPassword) {
    //   this.triggerAlert("danger", "Password unmatched!");
    // } else if (this.state.username === "") {
    //   this.triggerAlert("danger", "Username is required!");
    // } else if (this.state.email === "") {
    //   this.triggerAlert("danger", "Email is required!");
    // } else if (this.state.password === "") {
    //   this.triggerAlert("danger", "Paasword is required!");
    // } else if (this.state.eth_address === "") {
    //   this.triggerAlert("danger", "ETH Address is required!");
    // } else {
      var data = new FormData();
      data.set("username", this.state.username);
      data.set("eth_address", this.state.address);
      data.set("email", this.state.email);
      data.set("password", this.state.password);
      data.set("eth_address", this.state.eth_address);
      data.set("bank_account", this.state.bank_account);
      data.set("physical_address", this.state.physical_address);
      data.set("full_name", this.state.full_name);
      data.set("contact_number", this.state.contact_number);
    // data.set("financial_info", this.state.financial_info);
      if (this.state.type === "charity") { 
        data.set("description", this.state.description);
        this.setState({ loading: true });
        charityUpdate(data)
          .then(response => {
            if (response.data["code"] === 200) {
              this.setState({ updated: true });
              window.location.reload(true);
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
        donorUpdate(data)
          .then(response => {
            if (response.data["code"] === 200) {
              this.setState({ updated: true });
              window.location.reload(true);
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
    //   }
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
  
  componentDidMount(){
    this.getUsersData();
  };


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

  render() {
    const { userData } = this.state;

    if (!userData) {
      return [];
    }  
    return (<div>
      <Suspense fallback={this.loading()}>
      </Suspense>
      <Container className="mt-3 mb-3">
        <Form>
          <h1>My TransACT Profile
            {/* element style - float right */}
          <Button  onClick = {this.allowEdit.bind(this)} className="fa fa-edit"></Button></h1>
          <p className="text-muted"></p>
          {userData.map(item => {
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
                  onChange={this.updateValue(item.type)}
                placeholder={item.value}>
                </Input>
              </InputGroup>
            );
          })}
          <Button
            color="success"
            block
            onClick={this.updateProfile}>
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