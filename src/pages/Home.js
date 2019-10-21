import React, { Component } from 'react';
import logo from '../images/cart.png';

class Home extends Component {

  render() {
    const style = {
      width: '40%'
    };

    return (
      <div className="home-page">
        <h1>Welcome</h1>
        <img src={ logo } alt="coucou" style={style}/>
        <h2>in CoccoonCart !</h2>
      </div>  
    )
  }
}

export default Home;
