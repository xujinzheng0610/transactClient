import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Badge,
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem
} from "reactstrap";
import PropTypes from "prop-types";

import {
  AppAsideToggler,
  AppNavbarBrand,
  AppSidebarToggler
} from "@coreui/react";
import logo from "../../assets/img/brand/logo.svg";
import sygnet from "../../assets/img/brand/sygnet.svg";

import "../style.css";

const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};

class DefaultHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      donorLogin: this.checkDonorLogin(),
      charityLogin: true
    };
  }

  getCookie = name => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return false;
  };

  checkDonorLogin = () => {
    if (this.getCookie("donor_address")) {
      return true;
    } else {
      return false;
    }
  };

  checkCharityLogin = () => {
    if (this.getCookie("charity_address")) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        {/* <AppSidebarToggler className="d-lg-none" display="md" mobile /> */}
        <h3 className="logo">
          {" "}
          <span style={{ color: "#3ec1d5" }}>Trans</span>ACT
        </h3>
        {/* <AppSidebarToggler className="d-md-down-none" display="lg" /> */}

        <Nav className="ml-auto" navbar>
          <NavItem className="px-3">
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>
          </NavItem>
          <NavItem className="px-3">
            <Link to="/users" className="nav-link">
              About
            </Link>
          </NavItem>
          <NavItem className="px-3">
            <NavLink to="/projects" className="nav-link">
              Projects
            </NavLink>
          </NavItem>
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              {this.state.donorLogin? (
                <img
                  src={"../../assets/img/avatars/4.jpg"}
                  className="img-avatar"
                  alt="admin@bootstrapmaster.com"
                />
              ) : this.state.charityLogin ? (
                <img
                  src={"../../assets/img/avatars/5.jpg"}
                  className="img-avatar"
                  alt="admin@bootstrapmaster.com"
                />
              ):(
                <i className="icon-menu icons" />
              )}
            </DropdownToggle>
            <DropdownMenu right className="mt-2">
              {this.state.donorLogin ? (
                <div>
                  <DropdownItem href="">
                    <i className="fa fa-shield"></i> Donor Profile
                  </DropdownItem>
                  <DropdownItem href="">
                    <i className="fa fa-lock"></i> Logout
                  </DropdownItem>
                </div>
              ) : this.state.charityLogin ? (
                <div>
                  <DropdownItem href="">
                    <i className="fa fa-shield"></i> Charity Profile
                  </DropdownItem>
                  <DropdownItem href="">
                    <i className="fa fa-shield"></i> New Funding Project
                  </DropdownItem>
                  <DropdownItem href="">
                    <i className="fa fa-lock"></i> Logout
                  </DropdownItem>
                </div>
              ) : (
                <div>
                  <DropdownItem header tag="div" className="text-center">
                    <strong>Donors</strong>
                  </DropdownItem>
                  <DropdownItem href="/login/donor">
                    <i className="fa fa-shield"></i> Donor Login
                  </DropdownItem>
                  <DropdownItem href="/register/donor">
                    <i className="fa fa-user"></i> Donor Register
                  </DropdownItem>
                  <DropdownItem header tag="div" className="text-center">
                    <strong>Charity</strong>
                  </DropdownItem>
                  <DropdownItem href="/login/charity">
                    <i className="icons icon-badge"></i> Charity Login
                  </DropdownItem>
                  <DropdownItem href="/register/charity">
                    <i className="fa fa-envelope-o"></i> Charity Register
                  </DropdownItem>
                </div>
              )}
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>

        {/* <Nav className="ml-auto" navbar>
          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-bell"></i><Badge pill color="danger">5</Badge></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-list"></i></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-location-pin"></i></NavLink>
          </NavItem>
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <img src={'../../assets/img/avatars/6.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
              <DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
              <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
              <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
              <DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem>
              <DropdownItem divider />
              <DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem>
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
         */}
        {/* <AppAsideToggler className="d-md-down-none" /> */}
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
