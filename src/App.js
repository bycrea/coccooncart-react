// BROWSER=firefox yarn start
import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Login from './components/LoginForm';
import Nav from './components/Nav';
import Home from './components/Home';
import Cart from './components/Cart';
import Todos from './components/Todos';
import Todo from './components/Todo';
import Wallet from './components/Wallet';

class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
  
  constructor(props) {
    super(props);
    
    this.state = {
      isLogged: false,
      error: false,
      username: "",
      token: "",
      //urlApi: 'https://api.bycrea.me'
      urlApi: process.env.REACT_APP_API_URL
    };
  }

  componentDidMount() {
    const { cookies } = this.props;
    const token = cookies.get('coccooncookie') || "";

    if(token !== "") {
      this.setState({
        isLogged: true,
        username: this.parseJwt(token).username,
        token: token
      });
    }
  }

  parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  handleLogin = (user, pass) => {
    if(user === "" || pass === "")
      return false;

    const { cookies } = this.props;
    fetch(this.state.urlApi + '/api/login_check', {
      method: 'POST',
      headers: new Headers({'content-type': 'application/json'}),
      body: JSON.stringify({username: user, password: pass})
    })
    .then(res => res.json())
      .then((result) => {
        //console.log(result);
        if(!result.token) {
          this.setState({
            error: true,
          });
        } else {
          cookies.set('coccooncookie', result.token, { path: '/' });
          this.setState({
            isLogged: true,
            username: this.parseJwt(result.token).username,
            token: result.token
          });
        }
      },
      (error) => {
        this.setState({
          error: true,
        });
        console.log(error)
      }
    )
  }

  handleLogout = () => {
    const { cookies } = this.props;
    
    cookies.remove('coccooncookie');
    this.setState({
      isLogged: false,
      username: "",
      token: ""
    });
  }

  render() {
    const height = this.state.isLogged ? {height: '100vh'} : {height: '0'};
    
    return (
      <Router>
        {this.state.isLogged 
        ?
          <div className="app container container-fluid" style={height}>
            <Nav logout={this.handleLogout} username={this.state.username}/>
            <Switch>
              <Home path="/" exact component={Home} />
              <Cart path="/cart" component={Cart} state={this.state} />
              <Todos path="/todos" component={Todos} state={this.state} />
              <Route path="/todo/:id" component={Todo} state={this.state} />
              <Wallet path="/wallet" component={Wallet} />
            </Switch>
          </div>
        :
          <div className="app container container-fluid">
            <Nav logout={this.handleLogout} username={'Sign In'}/>
            <Login handleLogin={this.handleLogin} error={this.state.error}/>
          </div>
        }
      </Router>
    )
  }
}

export default withCookies(App);
