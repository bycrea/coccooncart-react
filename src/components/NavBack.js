import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavBack extends Component {

  render() {
    return (
      <nav id="top">
        <ul className="links">
          <Link to={this.props.path}><li>back</li></Link>
        </ul>
      </nav>  
    )
  }
}

export default NavBack;
