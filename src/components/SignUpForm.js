import React, { Component } from 'react';

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
      repassword: ""
    };
  }

  handleChange = (e) => {
    const [name, value] = [e.target.name, e.target.value];
    this.setState({
      [name]: value
    });

    switch(name) {
      case "email" : console.warn("email"); break;
      case "username" : console.warn("username"); break;
      case "password" : 
      case "repassword" : console.warn("password need to be secured"); break;
      default: break;
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.handleSignUp({
      email: this.state.username, 
      user: this.state.username, 
      pass: this.state.password
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="signup-page">
          <h4 className="title">Sign Up</h4>
          { this.props.error ?
            <div className="form-group">
              <span style={{color: 'red'}}>{this.props.errorMessage}</span>
            </div>
            : false
          }
          <div className="form-group">
            <label className="log-user">Email <em className="asterix">*</em>
              <input className="form-control form-control-sm" 
                type="text" 
                name="email" 
                required
                onChange={this.handleChange} 
                placeholder="email"
              />
            </label>
          </div>
          <div className="form-group">
            <label className="log-user">Username <em className="asterix">*</em>
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
            <label className="log-user">Password <em className="asterix">*</em>
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
            <label className="log-pass">Confirm password <em className="asterix">*</em>
              <input className="form-control form-control-sm" 
                type="password" 
                name="repassword" 
                required
                onChange={this.handleChange} 
                placeholder="confirm password"
              />
            </label>
          </div>
          <div className="form-group">
            <input className="btn btn-warning" type="submit" value="Sign Up" />
          </div>
        </div>  
      </form>
    )
  }
}

export default SignUpForm;
