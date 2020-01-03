import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import exit from '../images/sign-out-option.png'

class Nav extends Component {

  render() {
    const exitClass = this.props.isLogged ? 'exit' : 'no-exit';
    const userName = this.props.isLogged ? 'Hello ' + this.props.username : (this.props.isSignUp ? 'Sign In' : 'Sign Up');
    const callToAction = this.props.isLogged ? this.props.logout : this.props.signUp;

    return (
      <nav id="top">
        <ul className="links">
          <Link to="/"><li>Home</li></Link>
          <li onClick={callToAction}>
            {userName}
            <img className={exitClass} src={exit} alt="exit" />
          </li>
        </ul>
      </nav>
    )
  }
}

export default Nav;
