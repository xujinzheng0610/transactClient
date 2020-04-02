import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem
} from "reactstrap";
import PropTypes from "prop-types";

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
      charityLogin: this.checkCharityLogin()
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

  donorLogout = () => {
    document.cookie = 'donor_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    document.cookie = 'donor_username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    document.cookie = 'donor_address=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    window.location.reload();
  }

  charityLogout = () => {
    document.cookie = 'charity_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    document.cookie = 'charity_username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    document.cookie = 'charity_address=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    window.location.reload();
  }

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
                  <DropdownItem onClick={this.donorLogout}>
                    <i className="fa fa-lock" ></i> Logout
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
                  <DropdownItem onClick={this.charityLogout}>
                    <i className="fa fa-lock" ></i> Logout
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
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
