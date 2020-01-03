import React, { Component } from 'react';
import Welcome from './Welcome';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  handleChange = (e) => {
    const [name, value] = [e.target.name, e.target.value];
    this.setState({
      [name]: value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.handleLogin(this.state.username, this.state.password);
  }

  render() {    
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="login-page">
          <Welcome />
          { this.props.error ?
            <div className="form-group">
              <span style={{color: 'red'}}>{this.props.errorMessage}</span>
            </div>
            : false
          }
          <div className="form-group">
            <label className="log-user">Username
              <input className="form-control form-control-sm" 
                type="text" 
                name="username" 
                required
                onChange={this.handleChange} 
                placeholder="username"
              />
            </label>
          </div>
          <div className="form-group">
            <label className="log-pass">Password
              <input className="form-control form-control-sm" 
                type="password" 
                name="password" 
                required
                onChange={this.handleChange} 
                placeholder="password"
              />
            </label>
          </div>
          <div className="form-group">
            <input className="btn btn-info" type="submit" value="Sign In" />
          </div>
        </div>  
      </form>
    )
  }
}

export default LoginForm;
