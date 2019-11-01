import React from 'react';
import logo from '../images/cart.png';

function Welcome() {

  return <div className="welcome">
          <h2 className="title-welcome">Welcome<br />in CoccoonCart</h2>
          <img className="coccoon-logo" src={ logo } alt="coucou"/>
        </div>  
}

export default Welcome;
