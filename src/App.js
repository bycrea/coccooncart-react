import React, { Component } from 'react';
import './App.css';
import Nav from './components/Nav';
import Home from './components/Home';
import Cart from './components/Cart';
import Wallet from './components/Wallet';
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
