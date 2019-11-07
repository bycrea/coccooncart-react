import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Welcome from './Welcome';

class Home extends Component {

  render() {

    return (
      <div className="home-page">
        <Welcome />
        <div>
          <ul className="h-links">
            <Link to="/cart"><li>Cart</li></Link>
            {/* <Link to="/wallet"><li>Wallet</li></Link> */}
            {/* <Link to="/todos"><li>To Do</li></Link> */}
          </ul>
        </div>
      </div>  
    )
  }
}

export default Home;
