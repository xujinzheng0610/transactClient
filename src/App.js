import React, { Component } from 'react';
import { HashRouter, BrowserRouter, Route, Switch } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import './App.scss';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));
const AdminLayout = React.lazy(() => import('./containers/AdminLayout'));

// Pages
const Login = React.lazy(() => import('./views/Pages/Login'));
const Register = React.lazy(() => import('./views/Pages/Register'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));
const Profile = React.lazy(() => import('./views/Profile'));

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)===' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
  }
  return false;
}

class App extends Component {
  
  render() {
    var adminLogin = getCookie("admin")
    return (
      <BrowserRouter>
          <React.Suspense fallback={loading()}>
            <Switch>
              {/* <Route exact path="/profile/:type" name="Profile Page" render={props => <Profile {...props}/>} />  */}
              <Route exact path="/login/:type" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/register/:type" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              <Route path="/admin" name="Home" render={props => adminLogin ? <AdminLayout {...props}/> : window.location.replace("/login/admin") } />
              <Route path="/" name="Home" render={props =>  <DefaultLayout {...props}/> } />
            </Switch>
          </React.Suspense>
      </BrowserRouter>
    );  
  }
}

export default App;
