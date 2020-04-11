import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  AppHeader,
} from '@coreui/react';

// routes config
import routes from '../../routes';

const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  signOut(e) {
    e.preventDefault()
    this.props.history.push('/login')
  }

  checkRoute = (route, props) => {
    if( route.path.includes("/projectnew") && this.getCookie("charity_address") === undefined){
      window.location.replace('/home')
    } else if (route.path.includes("/project_charity") && this.getCookie("charity_address") === undefined){
      //imcompleted, should check project ownership
      window.location.replace('/home')
    }
    return <route.component {...props} />
  }

  getCookie = (name) => {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense  fallback={this.loading()}>
            <DefaultHeader onLogout={e=>this.signOut(e)}/>
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <main className="main">
            {/* <AppBreadcrumb appRoutes={routes} router={router}/> */}
            <Container fluid style={{padding: "0px", background:"white"}}>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        
                        render={props => 
                          this.checkRoute(route, props)
                          // <route.component {...props} />
                        } />
                    ) : <Redirect from="/" to="/home" />;
                  })}
                  <Redirect from="/" to="/home" />
                </Switch>
              </Suspense>
            </Container>
          </main>

        </div>
        {/* <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter> */}
      </div>
    );
  }
}

export default DefaultLayout;
