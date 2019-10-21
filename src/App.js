import React, { Component } from 'react';
import './App.css';
import Nav from './pages/Nav';
import Home from './pages/Home';
import Cart from './pages/Cart';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

class App extends Component {

  render() {
    return (
      <Router>
        <div className="app">
          <Nav />
          <Switch>
            <Route path="/" exact component={Home} />
            <Cart path="/cart" exact component={Cart} />
          </Switch>
        </div>  
      </Router>
    )
  }
}

export default App;
