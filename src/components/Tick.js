import React, { Component } from 'react';

class Tick extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLogged: this.props.state.isLogged,
      username: this.props.state.username,
      token: this.props.state.token,
      urlApi: this.props.state.urlApi,
      todo: null,
      loading: true,
      error: false,
    };
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render() {
    const styleTaunt = {textDecorationLine: 'line-through'};

    return (
      <div className="cart" style={styleLoad}>
        
      </div>  
    )
  }
}

export default Tick;
