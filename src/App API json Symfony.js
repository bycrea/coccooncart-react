import React, { Component } from 'react';
import logo from './image/4000.jpeg';
import './App.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      status: false,
      rand: 0
    }
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    this.callApi()
  }

  handleClick() {
    this.callApi()
  }

  callApi() {
    this.setState({
      status: false,
    })
    //fetch("http://coccooncart.com/api")
    //fetch("http://coccooncart.com/api/" + this.state.rand)
    fetch('http://coccooncart.com/api', {
      method: 'POST',
      body: JSON.stringify({data: this.state.rand})
     })
      .then(res => res.json())
      .then((result) => {
          console.log(result)
          this.setState({
            status: result.status,
            rand: result.rand
        })
      },
      (error) => {
        this.setState({
          status: false
        })
        console.log(error)
      }
    )
  }

  render() {
    return (
    <div>
      <header className="App-header">
        <h4>Mon Appli React.js</h4>
        <img src={ logo } className="App-logo" alt="logo" />
        {this.state.status ? <p>The answer is {this.state.rand}</p> : <p>Loading...</p>}
        <button className="App-link" onClick={this.handleClick}>Next</button>
      </header>
    </div>  
    )
  }
}

export default App;
