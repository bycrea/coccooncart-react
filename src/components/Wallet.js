import React, { Component } from 'react';

class Cart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      
    }
  }

  componentDidMount() {
    fetch('http://coccooncart.com/api/products_list')
      .then(res => res.json())
      .then((result) => {
          this.setState({
            
          })
          console.log('success')
      },
      (error) => {
        this.setState({
          loading: false,
          error: true
        })
        console.log(error)
      }
    )
  }

  componentDidUpdate() {
    //console.log(this.state.inTrash[0])
  }

  render() {

    return (
      <div className="wallet">
        <h4 className="title">Wallet</h4>
      </div>  
    )
  }
}

export default Cart;
