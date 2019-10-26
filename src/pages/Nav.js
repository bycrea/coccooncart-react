import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Nav extends Component {

  render() {
    return (
      <nav id="top">
        <ul className="links">
          <Link to="/"><li>Home</li></Link>
          <Link to="/cart"><li>Cart</li></Link>
          <Link to="/wallet"><li>Wallet</li></Link>
        </ul>
      </nav>  
    )
  }
}

export default Nav;
