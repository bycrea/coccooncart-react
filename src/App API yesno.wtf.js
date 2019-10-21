import React, { Component } from 'react';
import logo from './image/4000.jpeg';
import './App.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      state: false,
      wtf: {
        answer: "",
        image: "" 
      }
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
      wtf: {
        answer: "...",
        image: logo
      },})
    fetch("https://yesno.wtf/api")
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result)
          this.setState({
            wtf: {
              answer: result.answer,
              image: result.image
            },
            status: true
        })},
        (error) => {
          this.setState({
            rand: {
              status: false
            }
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
        <img src={this.state.wtf.image || logo } className="App-logo" alt="logo" />
        {this.state.status ? <p>The answer is {this.state.wtf.answer.toUpperCase()}</p> : <p>Loading...</p>}
        <button className="App-link" onClick={this.handleClick}>Next</button>
      </header>
    </div>  
    )
  }
}

export default App;
