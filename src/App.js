import React, { Component } from 'react';
import './App.css';
import Nav from './pages/Nav';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Wallet from './pages/Wallet';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

class App extends Component {

  render() {
    return (
      <Router>
        <div className="app container container-fluid">
          <Nav />
          <Switch>
            <Route path="/" exact component={Home} />
            <Cart path="/cart" component={Cart} />
            <Wallet path="/wallet" component={Wallet} />
          </Switch>
        </div>  
      </Router>
    )
  }
}

export default App;
