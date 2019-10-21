import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Nav extends Component {

  render() {
    return (
      <nav id="top">
        <ul className="links">
          <Link to="/"><li>home</li></Link>
          <Link to="/cart"><li>Cart</li></Link>
          <Link to="/"><li>About</li></Link>
        </ul>
      </nav>  
    )
  }
}

export default Nav;
