import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import exit from '../images/sign-out-option.png'

class Nav extends Component {

  render() {
    const exitClass = this.props.username === "Sign In" ? 'exit-rotate' : 'exit';

    return (
      <nav id="top">
        <ul className="links">
          <Link to="/"><li>Home</li></Link>
          <li onClick={this.props.logout}>Hello {this.props.username}</li>
        </ul>
        <i onClick={this.props.logout}>
          <img className={exitClass} src={exit} alt="trash" />
        </i>
      </nav>  
    )
  }
}

export default Nav;
