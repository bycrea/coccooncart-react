// BROWSER=firefox yarn start
import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Login from './components/LoginForm';
import SignUp from './components/SignUpForm';
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
      isSignUp: true,
      error: false,
      errorMessage: "",
      username: "",
      token: "",
      urlApi: process.env.REACT_APP_API_URL,
      orderOptions: ["a-Z", "Z-a", "Def", "Inv"],
      isOnline: true
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

  componentDidUpdate() {
    const isOnline = navigator.onLine;
    if(isOnline !== this.state.isOnline) {
      this.setState({
        isOnline: isOnline
      });
    }
    console.log(isOnline)
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
        console.log(result);
        if(!result.token) {
          this.setState({
            error: true,
            errorMessage: result.message
          });
        } else {
          console.log(this.parseJwt(result.token))
          cookies.set('coccooncookie', result.token, { path: '/' });
          this.setState({
            isLogged: true,
            username: this.parseJwt(result.token).username,
            token: result.token
          }, /*() => window.location = '/'*/);
        }
      },
      (error) => {
        this.setState({
          error: true,
          errorMessage: "Connection down."
        });
        console.log(error)
      }
    )
  }

  handleSignUp = (credentials) => {
    console.warn('sing up');
    this.setState({
      isSignUp: !this.state.isSignUp
    });

    if(this.state.isSignUp && Object.keys(credentials).length === 3) {
      console.log(credentials);
      // fetch(this.state.urlApi + '/signup/register', {
      //   method: 'POST',
      //   headers: new Headers({'content-type': 'application/json'}),
      //   body: JSON.stringify({email: credentials.email, username: credentials.user, password: credentials.pass})
      // })
      // .then(res => res.json())
      //   .then((result) => {
      //     console.log(result);
      //     if(result.error) {
      //       this.setState({
      //         error: true,
      //         errorMessage: result.message
      //       });
      //     } else {
      //       console.log(result);
      //     }
      //   },
      //   (error) => {
      //     this.setState({
      //       error: true,
      //       errorMessage: "Connection down."
      //     });
      //     console.log(error)
      //   }
      // )
    }
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

  nav = () => { return (
    <Nav  
      username={this.state.username} 
      isLogged={this.state.isLogged} 
      isSignUp={this.state.isSignUp} 
      logout={this.handleLogout} 
      signUp={this.handleSignUp} 
    />
  )}

  // getAllData() {
  //   fetch(this.state.urlApi + '/api/getuserdata', {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Authorization': 'Bearer ' + token
  //     },
  //     body: JSON.stringify({ username: this.parseJwt(token).username })
  //   })
  //   .then(res => res.json())
  //   .then((result) => {
  //     //console.log(result);
  //     if(!result.error && result.options) {
  //       this.setState({
  //         orderBy: result.options.orderBy,
  //         error: false,
  //       });
  //     }
  //   }, (error) => {
  //       this.setState({
  //         error: true,
  //         loading: false
  //       });
  //       console.log(error)
  //     }
  //   )
  // }

  render() {
    const height = this.state.isLogged ? {height: '100vh'} : {height: '0'};
    
    return (
      <Router>
        {this.state.isLogged 
        ?
          <div className="app container container-fluid" style={height}>
            {this.nav()}
            <Switch>
              <Home path="/" exact component={Home} />
              <Cart path="/cart" component={Cart} state={this.state} />
              <Todos path="/todos" component={Todos} state={this.state} />
              <Todo path="/todo" component={Todos} state={this.state} />
              <Route path="/todo/:id" component={Todo} state={this.state} />
              <Wallet path="/wallet" component={Wallet} />
            </Switch>
          </div>
        :
          <div className="app container container-fluid">
            {this.nav()}
            {this.state.isSignUp ?
              <SignUp 
                handleSignUp={this.handleSignUp} 
                error={this.state.error} 
                errorMessage={this.state.errorMessage} 
              />
            : 
              <Login 
                handleLogin={this.handleLogin} 
                error={this.state.error} 
                errorMessage={this.state.errorMessage} 
              />
            }
          </div>
        }
      </Router>
    )
  }
}

export default withCookies(App);
